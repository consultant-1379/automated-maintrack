"""
    Unit testing product_set_information.py
"""

import unittest

# pylint: disable=import-error
# pylint: disable=invalid-name
from miscellaneous.amt_ml_dataset_generator.product_set_information import \
    ProductSetInformation

valid_product_sets_info = "{\n    'delivered_dgs': [{'dg_id': 99999, 'dg_rpms': [{'rpm_name': " \
                          "'ERICpmic_CXP9030369', 'rpm_version': '2.22.1', 'categories': " \
                          "'service', 'services': 'pmserv', 'rpm_team': ['Dynamo', 'Warriors', " \
                          "'Striders']}, {'rpm_name': 'ERICpmicmodel_CXP9030403', 'rpm_version': " \
                          "'2.43.1', 'categories': 'model', 'services': 'No Services', " \
                          "'rpm_team': ['Dynamo', 'Warriors', 'Striders']}]}\n    ]," \
                          "\n    'obsoleted_dgs': [{'dg_id': 88888, 'dg_rpms': [{'rpm_name': " \
                          "'ERICpmic_CXP9030388', 'rpm_version': '2.33.1', 'categories': " \
                          "'service', 'services': 'pmserv', 'rpm_team': ['Thunderbee', " \
                          "'Warriors', 'Striders']}, {'rpm_name': 'ERICpmicmodel_CXP9030777', " \
                          "'rpm_version': '2.48.1', 'categories': 'model', 'services': 'No " \
                          "Services', 'rpm_team': ['Dynamo', 'Warriors', 'Striders']}]}\n    ]," \
                          "\n    'rfa_250_results': {},\n    'adu_results_urls': [" \
                          "'https://oss-taf-logs.seli.wh.rnd.internal.ericsson.com/6ba95ef0-6370" \
                          "-4fc9-8ac3-573fb784db28/data/xunit.json'],\n    'adu_results': {}," \
                          "\n    'aptu_results_urls': [" \
                          "'https://apt.seli.wh.rnd.internal.ericsson.com/apt_reports/293" \
                          "/20201211T135127/report/data/behaviors.json'],\n    'aptu_results': {" \
                          "},\n    'rfa_250_results_urls': [" \
                          "'https://oss-taf-logs.seli.wh.rnd.internal.ericsson.com/6c468f98-b640" \
                          "-46d7-8f72-22ebd1940b7e/data/xunit.json']\n}"

delivered_dgs_test_data = {'dg_id': 99999, 'dg_rpms': [{'rpm_name': 'ERICpmic_CXP9030369',
                                                        'rpm_version': '2.22.1',
                                                        'categories': 'service',
                                                        'services': 'pmserv',
                                                        'rpm_team': [
                                                            'Dynamo',
                                                            'Warriors',
                                                            'Striders']},
                                                       {
                                                           'rpm_name': 'ERICpmicmodel_CXP9030403',
                                                           'rpm_version': '2.43.1',
                                                           'categories': 'model',
                                                           'services': 'No Services',
                                                           'rpm_team': [
                                                               'Dynamo',
                                                               'Warriors',
                                                               'Striders']}]}

obsoleted_dgs_test_data = {'dg_id': 88888, 'dg_rpms': [{'rpm_name': 'ERICpmic_CXP9030388',
                                                        'rpm_version': '2.33.1',
                                                        'categories': 'service',
                                                        'services': 'pmserv',
                                                        'rpm_team': [
                                                            'Thunderbee',
                                                            'Warriors',
                                                            'Striders']},
                                                       {
                                                           'rpm_name': 'ERICpmicmodel_CXP9030777',
                                                           'rpm_version': '2.48.1',
                                                           'categories': 'model',
                                                           'services': 'No Services',
                                                           'rpm_team': [
                                                               'Dynamo',
                                                               'Warriors',
                                                               'Striders']}]}


class TestProductSetInformation(unittest.TestCase):
    """
    This tests the Product Set Information class in product_set_information.py
    """
    test_product_set_information = {}

    def setUp(self):
        """
        Setup for testing
        """
        self.test_product_set_information['99.99.99'] = ProductSetInformation('99.99.99')
        self.test_product_set_information['99.99.99'].obsoleted_dgs.append(obsoleted_dgs_test_data)
        self.test_product_set_information['99.99.99'].delivered_dgs.append(delivered_dgs_test_data)
        self.test_product_set_information['99.99.99'].rfa_250_results_urls.append(
            'https://oss-taf-logs.seli.wh'
            '.rnd.internal.ericsson.com'
            '/6c468f98-b640-46d7-8f72'
            '-22ebd1940b7e/data/xunit.json')
        self.test_product_set_information['99.99.99'].aptu_results_urls.append(
            'https://apt.seli.wh.rnd.internal'
            '.ericsson.com/apt_reports/293'
            '/20201211T135127/report/data'
            '/behaviors.json')
        self.test_product_set_information['99.99.99'].adu_results_urls.append(
            'https://oss-taf-logs.seli.wh.rnd.internal.ericsson.com/6ba95ef0-6370-4fc9-8ac3'
            '-573fb784db28/data/xunit.json')

    def test_get_list_of_all_delivered_dgs(self):
        """
        Tests getting the list of all delivered dgs
        """
        self.assertEqual(str(delivered_dgs_test_data), str(self.test_product_set_information[
                                                               '99.99.99']
                                                           .get_list_of_all_delivered_dgs()))

    def test_get_list_of_all_obsoleted_dgs(self):
        """
        Tests getting the list of all obsoleted dgs
        """
        self.assertEqual(str(obsoleted_dgs_test_data), str(self.test_product_set_information[
                                                               '99.99.99']
                                                           .get_list_of_all_obsoleted_dgs()))

    def test_get_product_set_information_back_as_string(self):
        """
        Tests the overrided str method
        """

        self.maxDiff = None
        self.assertEqual(valid_product_sets_info,
                         str(self.test_product_set_information['99.99.99']))


if __name__ == '__main__':
    unittest.main()
