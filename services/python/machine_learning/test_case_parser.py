"""This module will take an allure url and
return a list of the failed test suite names
"""
import requests

ADU_FAILURES_TO_TRACK = ["Failed to wait for Upgrade to start", "ENM Downtime Assertion",
                         "Upgrade failed during SVC/EVT/SCP", "ESMON Vm Not Online"]
ADU_FAILURES_TO_SKIP = ["failed in preparation method",
                        "HA_01 is disabled or not configured",
                        "JSchCLIToolException", "JSchException"]


class TestCaseParser:
    """
    This object will take an allure url and
    return a list of the failed test suite names
    """
    def __init__(self, url):
        """
        Initialize TestCaseParser
        :param: url
        """
        self.url = url
        self.failed_suites = {}

    def add_test_suite(self, suite_name):
        """
        This function will add the failed suite if doesn't already exist
        :param suite_name: The name of the test suite
        """
        if suite_name not in self.failed_suites:
            self.failed_suites[suite_name] = []

    def add_failed_test_cases(self, suite_name, test_case):
        """
        This function will add the failed test case to test suite
        :param suite_name: The name of the test suite
        :param test_case: The test case
        """
        test_suite_name = suite_name.replace(',', ' ')
        test_case = test_case.replace(',', ' ')
        self.add_test_suite(test_suite_name)
        self.failed_suites[test_suite_name].append(test_case)

    def retrieve_failed_aptu_suites_information(self):
        """
        This function will retrieve failed aptu test suite information
        :return failed suites if some exist, otherwise None
        """
        try:
            if 'gerrit' in self.url:
                aptu_data_json_url = self.url
            else:
                aptu_data_json_url = '/'.join(self.url.split('/')[:-1]) + "/data/behaviors.json"
            aptu_api_response = requests.get(aptu_data_json_url).json()
            if 'children' in aptu_api_response:
                for children in aptu_api_response['children']:
                    if 'children' not in children:
                        continue
                    for child in children['children']:
                        status = child['children'][0]['status']
                        if status not in ('passed', 'skipped'):
                            failed_test_case = child['name']
                            failed_test_case_uid = child['children'][0]['uid']
                            if 'gerrit' in self.url:
                                lower_level_aptu_data_json_url = self.url.split(
                                    ".json")[0] + "-" + failed_test_case_uid + "-test-cases.json"
                            else:
                                lower_level_aptu_data_json_url = '/'.join(
                                    self.url.split('/')[:-1]
                                    ) + '/data/test-cases/' + failed_test_case_uid + '.json'
                            lower_level_allure_api_response = requests.get(
                                lower_level_aptu_data_json_url).json()
                            failed_test_case_full_name = lower_level_allure_api_response[
                                'fullName']
                            failed_lower_level_test_case_name = failed_test_case_full_name.split(
                                '#')[1]
                            self.add_failed_test_cases(failed_lower_level_test_case_name,
                                                       failed_test_case)
            return self.failed_suites
        except ValueError:
            print('ERROR: APTU allure url not contactable')
            return None

    def retrieve_failed_allure_suites_information(self):
        """
        This function will retrieve failed allure test suite information
        :return failed suites if some exist, otherwise None
        """
        try:
            if 'gerrit' in self.url:
                allure_data_json_url = self.url
            else:
                allure_data_json_url = self.url + "/data/xunit.json"
            allure_api_response = requests.get(allure_data_json_url).json()
            if 'testSuites' in allure_api_response:
                for test_suite in allure_api_response['testSuites']:
                    number_of_failed_suites = test_suite['statistic']['failed']
                    number_of_broken_suites = test_suite['statistic']['broken']

                    if not (number_of_failed_suites > 0 or number_of_broken_suites > 0):
                        continue

                    test_suite_name = test_suite['name']
                    test_suite_test_cases = test_suite['testCases']
                    for test_case in test_suite_test_cases:
                        if test_case['status'] != 'PASSED':
                            test_case_name = test_case['title']
                            self.add_failed_test_cases(test_suite_name, test_case_name)
            return self.failed_suites
        except ValueError:
            print('ERROR: Allure URL not contactable')
            return None

    def retrieve_failed_adu_information(self):
        """
        This function will retrieve the json contained within an ADU report
        If ADU failed, it will then find and retrieve the testcase.json file associated with it
        :return: self.failed_suites or None
        """
        try:
            if 'gerrit' in self.url:
                allure_data_json_url = self.url
            else:
                allure_data_json_url = self.url + "/data/xunit.json"
            allure_api_response = requests.get(allure_data_json_url).json()
            if 'testSuites' in allure_api_response:
                adu_test_suite_json = allure_api_response["testSuites"][0]
                if 'testCases' in adu_test_suite_json:
                    if adu_test_suite_json["testCases"][0]["status"] != "PASSED":
                        adu_test_case_json_uid = adu_test_suite_json["testCases"][0]["uid"]
                        if 'gerrit' in self.url:
                            adu_testcase_url = self.url.split(
                                ".json")[0] + "-" + adu_test_case_json_uid + "-testcase.json"
                        else:
                            adu_testcase_url = self.url + "data/" + \
                                adu_test_case_json_uid + "-testcase.json"
                        adu_test_case_json = requests.get(adu_testcase_url).json()
                        self.parse_adu_suite_failures(adu_test_case_json)
            return self.failed_suites
        except ValueError:
            print('ERROR: Allure URL not contactable')
            return None

    def parse_adu_suite_failures(self, adu_test_case_json):
        """
        This function will parse ADU's testcase.json file to find the necessary failure(s)
        :param adu_test_case_json: The json of the ADU testcase.json you want to find failures for
        :return: True if encountered an ADU_FAILURES_TO_SKIP, False if the ADU failure is not being
        catered for in the current solution, otherwise nothing will be returned
        """
        adu_failure_message = adu_test_case_json["failure"]["message"]

        if any(adu_failure_to_track in adu_failure_message
               for adu_failure_to_track in ADU_FAILURES_TO_TRACK):
            self.add_failed_test_cases("UpgradeAvailability", "UpgradeAvailability")
        elif any(adu_failure_to_skip in adu_failure_message
                 for adu_failure_to_skip in ADU_FAILURES_TO_SKIP):
            return True
        elif 'steps' in adu_test_case_json:
            if adu_test_case_json['steps'][0]["status"] == "FAILED":
                self.add_failed_test_cases("UpgradeAvailability", "UpgradeAvailability")
            else:
                for adu_test_case in adu_test_case_json['steps']:
                    if adu_test_case["status"] != "PASSED":
                        if "@After suite" in adu_test_case['title']:
                            self.add_failed_test_cases(
                                "UpgradeAvailability", "UpgradeAvailability")
                        else:
                            test_case_info = adu_test_case['title'].split(":")
                            self.add_failed_test_cases(test_case_info[0].strip(),
                                                       test_case_info[1].strip())
        else:
            print('ERROR: ADU failure not catered for in current solution')
            return False
