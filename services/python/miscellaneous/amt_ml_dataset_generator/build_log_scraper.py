"""
This script will go through the build log soup
It gets each table row and goes through it from bottom to top
For each row it retrieves PS and its information
For each DG, it retrieves the RPM info from the queue of that drop
At the end we should have all PS in the drop with their information
"""
import logging

import requests
import sys

import miscellaneous.amt_ml_dataset_generator.logger
import miscellaneous.amt_ml_dataset_generator.html_getter
from miscellaneous.amt_ml_dataset_generator.delivery_group_information \
    import DeliveryGroupInformation
from miscellaneous.amt_ml_dataset_generator.product_set_information \
    import ProductSetInformation

EMT_SEARCH_URL = "https://emt.athtem.eei.ericsson.se/api/deployments/search?"
MTE_VENM_ENVS_SEARCH_URL = EMT_SEARCH_URL + "q=testPhase=MTE&q=platformType=vENM"
MTE_PHYSICAL_ENVS_SEARCH_URL = EMT_SEARCH_URL + "q=testPhase=MTE&q=platformType=physical"
APTU_REPORTS_URL = "https://apt.seli.wh.rnd.internal.ericsson.com/apt_reports/"
APTU_REPORT_DATA_DIRECTORY = "/report/data/"

class BuildLogParser(object):
    def __init__(self):
        self.info = {}
        self.obsoleted_dgs = {}
        self.delivered_dgs = {}
        self.mte_phys_envs = []
        self.mte_venm_envs = []

    def add_product_set_to_info(self, product_set):
        if product_set and product_set not in self.info:
            self.info[product_set] = ProductSetInformation(product_set)

    def retrieve_product_set_from_iso_table_cell(self, td):
        logging.info('Retrieve PS from TD')
        product_set = None
        if td.a is not None:
            product_set = td.a.text
            logging.info('Product Set Version: ' + product_set)
            self.add_product_set_to_info(product_set)
        return product_set

    @staticmethod
    def retrieve_rpm_info(portal_queue_soup, delivery_group_id):
        """
        This function takes a DG number, searches the portal queue to retrieve a list of RPMs in
        that DG and returns a list of those RPMs with their information.
        :param portal_queue_soup HTML soup of the CI portal
        :param delivery_group_id DG number
        :return: rpm_info
        :rtype: List
        """
        logging.info('Retrieve RPM info for DG ' + delivery_group_id)
        rpm_info = []
        delivery_group_heading_id = 'group' + delivery_group_id
        delivery_group_heading = portal_queue_soup.find(id=delivery_group_heading_id)
        if delivery_group_heading:
            delivery_group_info = delivery_group_heading.findNext('div').table.tbody
            delivery_group_info_rows = delivery_group_info.find_all("tr",
                                                                    "productware_artifact_in_group")
            if len(delivery_group_info_rows) == 0:
                delivery_group_info_rows = \
                    delivery_group_info.find_all("tr", "priority_testware_artifact_in_group")
            if len(delivery_group_info_rows) == 0:
                delivery_group_info_rows = \
                    delivery_group_info.find_all("tr", "testware_artifact_in_group")
            if len(delivery_group_info_rows) == 0:
                print("ERROR failed to get RPM info for DG " + delivery_group_id)
            for delivery_group_info_row in delivery_group_info_rows:
                all_tds_in_row = delivery_group_info_row.find_all('td')
                rpm_name = all_tds_in_row[0].a.text
                rpm_version = all_tds_in_row[1].a.text
                services = ''
                categories_td = all_tds_in_row[5]
                services_td = all_tds_in_row[4]
                if 'No Services' not in services_td.text:
                    services_list = services_td.div.div.ul.find_all('li')
                    for service_list_item in services_list:
                        if services:
                            services += ';'
                        services += service_list_item.text
                if not services:
                    services = 'No Services'
                categories = categories_td.text.replace(',', ';')
                rpm_team = all_tds_in_row[7].text
                if not rpm_team or rpm_team == "No Team Data":
                    rpm_team = ['No Team']
                else:
                    rpm_team = rpm_team.split(" ")
                rpm_info.append({
                    'rpm_name': rpm_name,
                    'rpm_version': rpm_version,
                    'categories': categories,
                    'services': services,
                    'rpm_team': rpm_team,
                })
        return rpm_info

    @staticmethod
    def check_rpms_match_iso_diff(rpm_info, iso_diff):
        """
        This function checks if the RPM names and versions in a DG are present in the ISO diff.
        :param rpm_info the information for each RPM in the DG
        :param iso_diff the difference between current ISO and previous ISO
        :return: rpms_match
        :rtype: Boolean
        """
        rpms_match = True
        for rpm in rpm_info:
            if rpm['rpm_name'] not in iso_diff.text or rpm['rpm_version'] not in iso_diff.text:
                rpms_match = False
        return rpms_match

    def check_dg_was_actually_delivered_in_product_set(self, rpm_info, iso_diff,
                                                       delivery_group_id_formatted):
        """
        This function is used to double check that the build log is correct in saying a DG was
        delivered in a product set. It does that by checking the difference between the current
        ISO and the previous ISO. If the DG ID or the RPM name and version is in the difference
        then we know the build log is correct.
        :param rpm_info the information for each RPM in the DG
        :param iso_diff the difference between current ISO and previous ISO
        :param delivery_group_id_formatted DG id where its only numbers
        :rtype: Boolean
        """
        rpms_match = self.check_rpms_match_iso_diff(rpm_info, iso_diff)
        if delivery_group_id_formatted not in iso_diff.text and not rpms_match:
            logging.warn("Not adding DG {0} as not in REST call"
                            .format(delivery_group_id_formatted))
            print("Not adding DG {0} as not in REST call".format(delivery_group_id_formatted))
            return False
        return True

    def add_dg_to_product_set(self, delivery_group_id, product_set, portal_queue_soup, iso_diff):
        """
        This function adds a DG and its information to the product set information object's
        delivered DGs property
        :param delivery_group_id
        :param product_set
        :param portal_queue_soup
        :param iso_diff
        """
        delivery_group_id_formatted = delivery_group_id.strip("+").strip("-").strip("(tw)")
        rpm_info = self.retrieve_rpm_info(portal_queue_soup, delivery_group_id_formatted)
        if self.check_dg_was_actually_delivered_in_product_set(rpm_info,
                                                               iso_diff,
                                                               delivery_group_id_formatted):
            logging.info('Add DG {0} to PS'.format(delivery_group_id_formatted))
            delivery_group = DeliveryGroupInformation(delivery_group_id_formatted, rpm_info)
            if delivery_group not in self.info[product_set].delivered_dgs:
                if delivery_group_id_formatted not in self.delivered_dgs:
                    self.delivered_dgs[delivery_group_id_formatted] = []
                self.delivered_dgs[delivery_group_id_formatted].append(product_set)
                self.info[product_set].delivered_dgs.append(delivery_group)

    def add_dg_to_obsoleted_list(self, delivery_group_id, product_set):
        """
        This function adds a DG and its information to the list of obsoleted DGs
        :param delivery_group_id
        :param product_set
        """
        delivery_group_id_formatted = delivery_group_id.strip("+").strip("-").strip("(tw)")
        if delivery_group_id_formatted not in self.obsoleted_dgs:
            self.obsoleted_dgs[delivery_group_id_formatted] = []
        if product_set not in self.obsoleted_dgs[delivery_group_id_formatted]:
            self.obsoleted_dgs[delivery_group_id_formatted].append(product_set)

    @staticmethod
    def get_previous_product_set(product_set):
        product_set_broken_down = product_set.split('.')
        product_set_broken_down[2] = str(int(product_set_broken_down[2]) - 1)
        previous_product_set = '.'.join(product_set_broken_down)
        return previous_product_set

    @staticmethod
    def get_previous_iso_and_drop_version(to_iso, drop):
        # Temporary workaround for 21.01. Should be removed when script is productified.
        if to_iso == '1.102.1':
            return '1.101.98', '20.17'
        if to_iso == '2.1.1':
            return '1.121.32', '22.02'
        split_to_iso = to_iso.split('.')
        if split_to_iso[2] == '1':
            split_drop = drop.split('.')
            previous_drop = split_drop[0] + '.'
            if int(split_drop[1]) - 1 < 10:
                previous_drop += '0' + str(int(split_drop[1]) - 1)
            else:
                previous_drop += str(int(split_drop[1]) - 1)
            previous_iso = split_to_iso[0] + '.' + str(int(split_to_iso[1]) - 1) + '.100'
        else:
            previous_iso = split_to_iso[0] + '.' + split_to_iso[1] + '.' + \
                           str(int(split_to_iso[2]) - 1)
            previous_drop = drop
        return previous_iso, previous_drop

    @staticmethod
    def make_request_to_get_enm_iso_diff(drop, to_iso, previous_drop, previous_iso):
        iso_diff_rest_call = 'https://ci-portal.seli.wh.rnd.internal.ericsson.com/' \
                             'getISOContentDelta/?product=ENM&drop' \
                             '={0}&isoVersion={1}&previousDrop={2}' \
                             '&previousISOVersion={3}&json=true'.format(drop, to_iso, previous_drop,
                                                                        previous_iso)
        logging.info('ISO Diff Request URL: ' + iso_diff_rest_call)
        return requests.get(iso_diff_rest_call)

    @staticmethod
    def make_request_to_get_testware_iso_diff(drop, to_tw_iso, previous_drop, previous_tw_iso):
        tw_iso_diff_rest_call = 'https://ci-portal.seli.wh.rnd.internal.ericsson.com/' \
                                'getISOContentDelta/?product=ENM&drop' \
                                '={0}&isoVersion={1}&previousDrop={2}' \
                                '&previousISOVersion={3}&json=true&testware=True' \
            .format(drop, to_tw_iso, previous_drop, previous_tw_iso)
        logging.info('TW ISO Diff Request URL: ' + tw_iso_diff_rest_call)
        return requests.get(tw_iso_diff_rest_call)

    def get_enm_iso_diff(self, drop, to_iso):
        """
        Takes in an ENM ISO, gets the next previous ISO and queries the CI Portal to get the
        difference between those two ISOs
        :return: iso_diff_response
        :rtype: String
        """
        previous_iso, previous_drop = self.get_previous_iso_and_drop_version(to_iso, drop)
        iso_diff_response = self.make_request_to_get_enm_iso_diff(drop, to_iso, previous_drop,
                                                                  previous_iso)
        while 'was not found, please try again' in iso_diff_response.text:
            logging.warn('ISO {0} does not exist. Trying the one previous to it.'
                         .format(previous_iso))
            previous_iso, previous_drop = self.get_previous_iso_and_drop_version(previous_iso,
                                                                                 previous_drop)
            iso_diff_response = self.make_request_to_get_enm_iso_diff(drop, to_iso, previous_drop,
                                                                      previous_iso)
        return iso_diff_response

    def get_enm_testware_iso_diff(self, drop, to_iso):
        """
        Takes in an ENM testware ISO, gets the next previous ISO and queries the CI Portal to get
        the difference between those two testware ISOs
        :param drop
        :param to_iso
        :return: tw_iso_diff_response
        :rtype: String
        """
        previous_iso, previous_drop = self.get_previous_iso_and_drop_version(to_iso, drop)
        to_tw_iso = self.get_testware_iso_from_enm_iso(to_iso, drop)
        previous_tw_iso = self.get_testware_iso_from_enm_iso(previous_iso, drop)
        tw_iso_diff_response = self.make_request_to_get_testware_iso_diff(drop, to_tw_iso,
                                                                          previous_drop,
                                                                          previous_tw_iso)
        while 'was not found, please try again' in tw_iso_diff_response.text:
            logging.warn('TW ISO {0} does not exist. Trying the one previous to it.'
                         .format(previous_tw_iso))
            previous_tw_iso, previous_drop = self.get_previous_iso_and_drop_version(previous_tw_iso,
                                                                                    previous_drop)
            tw_iso_diff_response = self.make_request_to_get_testware_iso_diff(drop, to_tw_iso,
                                                                              previous_drop,
                                                                              previous_tw_iso)
        return tw_iso_diff_response

    def retrieve_dgs(self, delivery_group_divs, product_set, portal_queue_soup, to_iso, drop):
        logging.info('Retrieving DGs in TD')
        delivery_grop_spans = delivery_group_divs[0].find_all("span", "ng-scope")
        iso_diff = self.get_enm_iso_diff(drop, to_iso)
        tw_iso_diff = self.get_enm_testware_iso_diff(drop, to_iso)
        if delivery_grop_spans is not None and len(delivery_grop_spans) > 0:
            for delivery_grop_span in delivery_grop_spans:
                if delivery_grop_span.a is not None:
                    delivery_group = delivery_grop_span.a.text.encode('ascii',
                                                                      'ignore').decode(
                        'ascii').strip()
                    if delivery_group is not None:
                        if '+' in delivery_group:
                            if "(tw)" not in delivery_group:
                                self.add_dg_to_product_set(delivery_group, product_set,
                                                           portal_queue_soup,
                                                           iso_diff)
                            else:
                                self.add_dg_to_product_set(delivery_group, product_set,
                                                           portal_queue_soup,
                                                           tw_iso_diff)
                        elif '-' in delivery_group:
                            self.add_dg_to_obsoleted_list(delivery_group, product_set)

    def retrieve_rfa_250_test_results_urls(self, test_results_result_divs, product_set):
        rfa_test_result_divs = test_results_result_divs.find_all("div", "textRight")
        if rfa_test_result_divs is not None and len(rfa_test_result_divs) > 0 and not self.info[
            product_set].contains_re_runner_results:
            test_results_urls_anchor = rfa_test_result_divs[1].find_all("a", "failedCellLink")
            if len(test_results_urls_anchor) == 1:
                logging.info('Re runner detected for ' + product_set)
                self.info[product_set].contains_re_runner_results = True
            else:
                test_results_urls_anchor = rfa_test_result_divs[0].find_all("a", "failedCellLink")

            if test_results_urls_anchor is not None and len(test_results_urls_anchor) == 1:
                if len(test_results_urls_anchor[0].text) > 1:
                    test_results_urls = test_results_urls_anchor[0].get("href")
                    if test_results_urls:
                        test_results_urls = test_results_urls.split('/')
                        test_results_urls_id = list(
                            filter(lambda char: char != '', test_results_urls))
                        test_results_urls = 'https://oss-taf-logs.seli.wh.rnd.internal.ericsson.com/' \
                                            + test_results_urls_id[-1] + '/data/xunit.json'
                    if test_results_urls not in self.info[product_set].rfa_250_results_urls:
                        if self.info[product_set].contains_re_runner_results:
                            self.info[product_set].rfa_250_results_urls = [test_results_urls]
                        else:
                            self.info[product_set].rfa_250_results_urls.append(test_results_urls)

    def retrieve_aptu_test_results_urls(self, aptu_td, product_set):
        aptu_results_url_id = self.retrieve_tests_table_column_as_list(aptu_td)
        if len(aptu_results_url_id) > 0:
            if "apt_reports" == aptu_results_url_id[2]:
                aptu_url = APTU_REPORTS_URL + aptu_results_url_id[3] + '/' + aptu_results_url_id[
                    4] + APTU_REPORT_DATA_DIRECTORY
            else:
                aptu_url = APTU_REPORTS_URL + aptu_results_url_id[2] + '/' + aptu_results_url_id[
                    3] + APTU_REPORT_DATA_DIRECTORY

            if len(self.info[product_set].aptu_results_urls) > 0:
                self.info[product_set].aptu_results_urls.append(aptu_url)
            else:
                self.info[product_set].aptu_results_urls = [aptu_url]

    def retrieve_adu_test_results_urls(self, adu_td, product_set):
        adu_results_url_id = self.retrieve_tests_table_column_as_list(adu_td)
        if len(adu_results_url_id) > 0:
            test_results_url = 'https://oss-taf-logs.seli.wh.rnd.internal.ericsson.com/' \
                               + adu_results_url_id[-1] + '/data/xunit.json'
            if len(self.info[product_set].adu_results_urls) > 0:
                self.info[product_set].adu_results_urls.append(test_results_url)
            else:
                self.info[product_set].adu_results_urls = [test_results_url]

    def retrieve_tests_table_column_as_list(self, test_columns_td):
        passed_test_cell = test_columns_td.find_all("a", "passedCellLink")
        failed_test_cell = test_columns_td.find_all("a", "failedCellLink")

        test_cell = ""
        if len(failed_test_cell) > 0:
            test_cell = failed_test_cell
        elif len(passed_test_cell) > 0:
            test_cell = passed_test_cell
        if test_cell:
            test_results_urls = test_cell[0].get("href").split('/')
            return list(filter(lambda char: char != '', test_results_urls))
        else:
            return []

    def iterate_over_table_cells(self, row, portal_queue_soup, drop):
        all_tds = row.find_all("td")
        if len(all_tds) == 14:
            result_of_run_td = all_tds[0]
            # Due to some inconsistencies in the buildlog, some upgrade
            # entries fall under the "II" column in the buildlog
            if 'MTE' in result_of_run_td.text and (
                    'RFA250' in result_of_run_td.text or
                    'UG' in result_of_run_td.text or
                    'II' in result_of_run_td.text) or\
                    'PASSED *' == result_of_run_td.text or\
                    'FAILED *' == result_of_run_td.text:
                environment = all_tds[2]
                to_iso_td = all_tds[5]
                product_set_td = all_tds[7]
                delivery_group_td = all_tds[8]
                rfa_test_results_result_td = all_tds[9]
                aptu_test_results_td = all_tds[10]
                adu_test_results_td = all_tds[11]
                if product_set_td:
                    product_set = self.retrieve_product_set_from_iso_table_cell(product_set_td)
                    if product_set:
                        to_iso = to_iso_td.a.text
                        delivery_group_divs = delivery_group_td.find_all("div", "delGroup")
                        if delivery_group_divs is not None and len(delivery_group_divs) > 0:
                            self.retrieve_dgs(delivery_group_divs, product_set, portal_queue_soup,
                                              to_iso, drop)
                        if '-' not in environment.text:
                            if environment.text in self.mte_venm_envs:
                                self.retrieve_rfa_250_test_results_urls(rfa_test_results_result_td,
                                                                        product_set)
                        elif '-' in environment.text:
                            if environment.text[-3:] in self.mte_phys_envs:
                                self.retrieve_aptu_test_results_urls(aptu_test_results_td,
                                                                     product_set)
                                self.retrieve_adu_test_results_urls(adu_test_results_td,
                                                                    product_set)

    def assign_obsoleted_dgs_to_product_sets(self, portal_queue_soup):
        for obsoleted_dg in self.obsoleted_dgs:
            if obsoleted_dg in self.delivered_dgs:
                actions_on_dg = []
                for product_set_version in self.obsoleted_dgs[obsoleted_dg]:
                    actions_on_dg.append((product_set_version, 'obsoleted'))
                for product_set_version in self.delivered_dgs[obsoleted_dg]:
                    actions_on_dg.append((product_set_version, 'delivered'))
                sorted_actions_on_dg = sorted(actions_on_dg,
                                              key=lambda action: int(action[0].split(".")[2]))
                obsoleted = False
                for product_set_version, action in sorted_actions_on_dg:
                    if action == 'delivered' and obsoleted:
                        obsoleted = False
                    if action == 'obsoleted' and not obsoleted:
                        obsoleted = True
                if obsoleted:
                    for product_set_version in self.delivered_dgs[obsoleted_dg]:
                        rpm_info = self.retrieve_rpm_info(portal_queue_soup, obsoleted_dg)
                        obsoleted_delivery_group = DeliveryGroupInformation(obsoleted_dg, rpm_info)
                        self.info[product_set_version].obsoleted_dgs.append(
                            obsoleted_delivery_group)
            else:
                print('DG {0} was obsoleted but not delivered'.format(obsoleted_dg))

    def populate_mte_environments(self):
        """
        We need to get MTE physical and cloud environments from EMT as some CDL, PLM etc
        environments are contained within "PASSED *" and "FAILED *" entries in the buildlog
        """
        logging.info('Getting MTE environments from EMT')
        try:
            mte_phys_environments = requests.get(MTE_PHYSICAL_ENVS_SEARCH_URL).json()
            mte_venm_environments = requests.get(MTE_VENM_ENVS_SEARCH_URL).json()
            for mte_phys_environment in mte_phys_environments:
                self.mte_phys_envs.append(mte_phys_environment['name'])

            for mte_venm_environment in mte_venm_environments:
                self.mte_venm_envs.append(mte_venm_environment['name'])
        except Exception:
            logging.error('Unable to get MTE environments from EMT')
            sys.exit(1)

    def iterate_over_table_rows(self, drop):
        self.populate_mte_environments()
        logging.info('Getting build log html')
        build_log_soup = miscellaneous.amt_ml_dataset_generator.html_getter.get_build_log_html(
            'https://ci-portal.seli.wh.rnd.internal.ericsson.com/visualisation/baseline/' + drop)
        table_rows = build_log_soup.find_all("tr", "BLTR")
        logging.info('Getting portal queue html')
        portal_queue_soup = miscellaneous.amt_ml_dataset_generator.html_getter \
            .get_portal_queue_html('https://ci-portal.seli.wh.rnd.internal.ericsson.com'
                                   '/ENM/queue/' + drop)

        logging.info('Iterating through each row in build log')
        for row_index in reversed(range(0, len(table_rows))):
            self.iterate_over_table_cells(table_rows[row_index], portal_queue_soup, drop)
        logging.info('Going through each obsoleted DGs to assign it to the correct PS')
        self.assign_obsoleted_dgs_to_product_sets(portal_queue_soup)
        return self.info

    def get_testware_iso_from_enm_iso(self, enm_iso_version, drop):
        """
        :param enm_iso_version: ENM ISO version in which to get the
        testware ISO version from.
        :param drop: drop version
        :return Testware ISO version mapped to ENM ISO version.
        """
        logging.info("Getting testware_iso mapped to enm iso version "
                     + str(enm_iso_version))
        productware_to_testware_media_mapping_url = "https://" \
                                                    "ci-portal.seli.wh.rnd.internal.ericsson.com/" \
                                                    "api/getProductwareToTestwareMediaMapping/" \
                                                    "mediaArtifact/ERICenm_CXP9027091/version/" \
                                                    + enm_iso_version + "/?format=json&pretty=true"
        testware_response = requests.get(
            productware_to_testware_media_mapping_url).json()
        while 'Issue getting Testware Media Artifact versions for Productware Media Artifact' in str(testware_response):
            logging.info("Issue so rerunning rest call")
            previous_iso, previous_drop = self.get_previous_iso_and_drop_version(enm_iso_version, drop)
            logging.info("Pre ISO: " + previous_iso)
            enm_iso_version = previous_iso
            productware_to_testware_media_mapping_url = "https://" \
                                                        "ci-portal.seli.wh.rnd.internal.ericsson.com/" \
                                                        "api/getProductwareToTestwareMediaMapping/" \
                                                        "mediaArtifact/ERICenm_CXP9027091/version/" \
                                                        + previous_iso + "/?format=json&pretty=true"
            testware_response = requests.get(
                productware_to_testware_media_mapping_url).json()

        testware_iso = testware_response["testwareMediaArtifactVersions"][-1]
        logging.info("testware_iso:" + testware_iso)
        return testware_iso
