"""
    Unit testing pickle_actions.py
"""

# pylint: disable=import-error
import unittest
import unittest.mock
import shutil
import os
import requests

from miscellaneous.amt_ml_dataset_generator.pickle_actions import \
    retrieve_product_sets_info_from_pickle, get_list_of_previous_drops_from_pickles, \
    get_product_set_max_range, store_product_set_information_into_pickle

VALID_PRODUCT_SET_INFO = "{\n    'delivered_dgs': [\n        {\n            'dg_id': 81967," \
                         "\n            'dg_rpms': [{'rpm_name': 'ERICasr_CXP9039965', " \
                         "'rpm_version': '1.9.2', 'categories': 'asrstream', " \
                         "'services': 'sparkWorker9;sparkWorker8;sparkWorker7;sparkWorker6;" \
                         "sparkWorker5;sparkWorker4;sparkWorker3;sparkWorker2;sparkWorker10;" \
                         "sparkWorker1', 'rpm_team': ['Anveshan']}, {'rpm_name': " \
                         "'ERICasrnrecordmodel_CXP9039075', 'rpm_version': '1.13.1', " \
                         "'categories': 'model', 'services': 'No Services', 'rpm_team': " \
                         "['Anveshan']}]\n        },\n        {\n            'dg_id': 81962," \
                         "\n            'dg_rpms': [{'rpm_name': " \
                         "'ERICautosoftwareupgradeflow_CXP9037043', 'rpm_version': '1.59.1', " \
                         "'categories': 'service', 'services': 'flowautomation', 'rpm_team': [" \
                         "'No Team']}]\n        },\n        {\n            'dg_id': 81965," \
                         "\n            'dg_rpms': [{'rpm_name': 'ERICidenmgmtopendj" \
                         "_CXP9030738', 'rpm_version': '1.96.1', 'categories': 'db', 'services': " \
                         "'No Services', 'rpm_team': ['ENMeshed']}]\n        }\n    ],\n    " \
                         "'obsoleted_dgs': [\n    ],\n    'rfa_250_results': {'FM_FMX - Dhruva': " \
                         "['Create new alarm in FM by executing FMX rule', " \
                         "'Update existing alarm in FM by executing FMX rule']},\n " \
                         "   'adu_results_urls': [" \
                         "'https://oss-taf-logs.seli.wh.rnd.internal.ericsson.com/b91eb3fb-d794" \
                         "-4a0d-be9c-2877daa2604b/data/xunit.json'],\n    'adu_results': " \
                         "{'UpgradeAvailability': ['UpgradeAvailability']},\n    'aptu_results" \
                         "_urls': ['https://apt.seli.wh.rnd.internal.ericsson.com/apt_reports/295" \
                         "/20220114T161636/report/data/'],\n    'aptu_results': " \
                         "{'test_are_same_number_of_apg_nodes_fm_supervised_at_start_and_end_of" \
                         "_assertion_period': ['Are same number of APG nodes FM supervised at " \
                         "start and end of assertion period?'], 'test_no_heartbeat_failures_occ" \
                         "urred': ['No heartbeat failures occurred']},\n    'rfa_250_results" \
                         "_urls': ['https://oss-taf-logs.seli.wh.rnd.internal.ericsson.com/" \
                         "33856172-47a5-4554-b07d-e19678101382/data/xunit.json']\n}"

VALID_PRODUCT_SET_JSON = [{"version": "22.04.83"}]
INVALID_PRODUCT_SET_JSON = [{""}]

VALID_PREVIOUS_DROP_LIST = os.listdir(
    "miscellaneous/amt_ml_dataset_generator/ml_pickles/")
INVALID_PREVIOUS_DROP_LIST = ['20.14', '20.15']

MOCK_PICKLES_LOCATION = 'python_tests/mock_ml_pickles/'


class TestPickleActions(unittest.TestCase):
    """
    This tests the Pickle Actions class in pickle_actions.py
    """

    @staticmethod
    def response_mock(json_to_mock_response_of):
        """
        This is a staticmethod used for testing purposes. This will take in a json object and
        return a mocked response. We need this function for testing as production code calls
        response.json which must be mocked
        :param json_to_mock_response_of
        :return: response
        """
        res = requests.Response()
        res.status_code = 200

        def json_mock_func():
            return json_to_mock_response_of

        res.json = json_mock_func
        return res

    def test_retrieve_valid_product_sets_info_from_pickle(self):
        """
        Test the retrieval of product set information from pickle 22.03.2
        """
        # pylint: disable=invalid-name
        self.maxDiff = None
        self.assertEqual(str(VALID_PRODUCT_SET_INFO),
                         str(retrieve_product_sets_info_from_pickle('22.03', '22.03.2')))

    def test_none_returned_if_pickle_with_product_set_does_not_exist(self):
        """
        Tests that none is returned if pickle does not exist
        """
        test_product_set_info = retrieve_product_sets_info_from_pickle('19.02', '19.665.2')
        self.assertIsNone(test_product_set_info)

    @unittest.mock.patch('requests.get')
    def test_get_product_set_max_range(self, get_request_mock):
        """
        Test that a valid product set max range is returned
        :param get_request_mock:
        """
        get_request_mock.return_value = self.response_mock(VALID_PRODUCT_SET_JSON)
        self.assertEqual('83', get_product_set_max_range('22.04'))

    def test_get_list_of_previous_drops_from_pickles(self):
        """
        Tests the getting of the previous drops from the pickle directories
        """
        self.assertEqual(get_list_of_previous_drops_from_pickles(), VALID_PREVIOUS_DROP_LIST)
        self.assertNotEqual(get_list_of_previous_drops_from_pickles(), INVALID_PREVIOUS_DROP_LIST)

    @unittest.mock.patch('miscellaneous.amt_ml_dataset_generator.pickle_actions.PICKLES_LOCATION',
                         MOCK_PICKLES_LOCATION)
    def test_store_product_set_information_into_pickle(self):
        """
        Test adding product set information into a new pickle
        """
        os.mkdir(MOCK_PICKLES_LOCATION + '99.99')
        store_product_set_information_into_pickle(VALID_PRODUCT_SET_INFO, '99.99.99', '99.99')
        self.assertTrue(os.path.exists(MOCK_PICKLES_LOCATION + '99.99'))
        test_product_set_info = retrieve_product_sets_info_from_pickle('99.99', '99.99.99')
        self.assertEqual(str(VALID_PRODUCT_SET_INFO), str(test_product_set_info))
        shutil.rmtree(MOCK_PICKLES_LOCATION + '99.99')


if __name__ == '__main__':
    unittest.main()
