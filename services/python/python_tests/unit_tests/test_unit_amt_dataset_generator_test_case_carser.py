"""
    Unit testing test_case_parser.py
"""

import unittest
import unittest.mock
import json
import requests

# pylint: disable=import-error
from miscellaneous.amt_ml_dataset_generator.test_case_parser import TestCaseParser
from python_tests.unit_tests import test_case_parser_test_data as test_data


class TestTestCaseParser(unittest.TestCase):
    """
    This tests the TestCaseParser class in test_case_parser.py
    """

    successful_aptu_report = json.loads(test_data.SUCCESSFUL_APTU_REPORT)
    skipped_aptu_report = json.loads(test_data.SKIPPED_APTU_REPORT)
    failed_high_level_aptu_report_one_failure = json.loads(
        test_data.FAILED_HIGH_LEVEL_APTU_REPORT_ONE_FAILURE)
    failed_low_level_aptu_report_one_failure = json.loads(
        test_data.FAILED_LOW_LEVEL_APTU_REPORT_ONE_FAILURE)
    aptu_report_one_failure_output = json.loads(test_data.APTU_REPORT_ONE_FAILURE_OUTPUT)
    failed_high_level_aptu_report_multiple_failures = json.loads(
        test_data.FAILED_HIGH_LEVEL_APTU_REPORT_MULTIPLE_FAILURES)
    first_failed_low_level_aptu_report_multiple_failures = json.loads(
        test_data.FIRST_FAILED_LOW_LEVEL_APTU_REPORT_MULTIPLE_FAILURES)
    second_failed_low_level_aptu_report_multiple_failures = json.loads(
        test_data.SECOND_FAILED_LOW_LEVEL_APTU_REPORT_MULTIPLE_FAILURES)
    third_failed_low_level_aptu_reports_multiple_failures = json.loads(
        test_data.THIRD_FAILED_LOW_LEVEL_APTU_REPORT_MULTIPLE_FAILURES)
    aptu_report_multiple_failures_output = json.loads(
        test_data.APTU_REPORT_MULTIPLE_FAILURES_OUTPUT)

    successful_allure_report = json.loads(test_data.SUCCESSFUL_ALLURE_REPORT)
    failed_allure_report = json.loads(test_data.FAILED_ALLURE_REPORT)
    allure_report_failure_output = json.loads(test_data.ALLURE_REPORT_FAILURE_OUTPUT)
    broken_allure_report = json.loads(test_data.BROKEN_ALLURE_REPORT)
    allure_report_broken_output = json.loads(test_data.ALLURE_REPORT_BROKEN_OUTPUT)

    failed_high_level_adu_suite = json.loads(test_data.FAILED_HIGH_LEVEL_ADU_REPORT)
    failed_low_level_adu_suite = json.loads(test_data.FAILED_LOWLEVEL_ADU_REPORT)
    adu_report_failed_output = json.loads(test_data.ADU_REPORT_FAILED_OUTPUT)
    successful_adu_report = json.loads(test_data.SUCCESSFUL_ADU_REPORT)

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

    @unittest.mock.patch('requests.get')
    def test_retrieve_failed_aptu_suites_information_successful_suites(self, get_request_mock):
        """
        Tests that retrieve_failed_aptu_suites_information will return an empty object if all
        suites have passed
        :param get_request_mock
        :return: None
        """
        get_request_mock.return_value = self.response_mock(self.successful_aptu_report)
        parsed_test_cases = TestCaseParser("DUMMY_URL").retrieve_failed_aptu_suites_information()
        self.assertEqual({}, parsed_test_cases)

    @unittest.mock.patch('requests.get')
    def test_retrieve_failed_aptu_suites_information_skipped_suites(self, get_request_mock):
        """
        Tests that retrieve_failed_aptu_suites_information will return an empty object if all
        suites have skipped
        :param get_request_mock
        :return: None
        """
        get_request_mock.return_value = self.response_mock(self.skipped_aptu_report)
        parsed_test_cases = TestCaseParser("DUMMY_URL").retrieve_failed_aptu_suites_information()
        self.assertEqual({}, parsed_test_cases)

    @unittest.mock.patch('requests.get')
    def test_retrieve_failed_aptu_suites_information_one_failed_suite(self, get_request_mock):
        """
        Tests that retrieve_failed_aptu_suites_information will return only failed suites from the
        necessary APTU report
        :param get_request_mock
        :return: None
        """
        get_request_mock.side_effect = [self.response_mock(
            self.failed_high_level_aptu_report_one_failure),
                                        self.response_mock(
                                            self.failed_low_level_aptu_report_one_failure)]
        parsed_test_cases = TestCaseParser("DUMMY_URL").retrieve_failed_aptu_suites_information()
        self.assertEqual(self.aptu_report_one_failure_output, parsed_test_cases)

    @unittest.mock.patch('requests.get')
    def test_retrieve_failed_aptu_suites_information_multiple_failed_suite(self, get_request_mock):
        """
        Tests that retrieve_failed_aptu_suites_information will return only failed suites from the
        necessary APTU report
        :param get_request_mock
        :return: None
        """
        get_request_mock.side_effect = [
            self.response_mock(self.failed_high_level_aptu_report_multiple_failures),
            self.response_mock(self.first_failed_low_level_aptu_report_multiple_failures),
            self.response_mock(self.second_failed_low_level_aptu_report_multiple_failures),
            self.response_mock(self.third_failed_low_level_aptu_reports_multiple_failures)]
        parsed_test_cases = TestCaseParser("DUMMY_URL").retrieve_failed_aptu_suites_information()
        self.assertEqual(self.aptu_report_multiple_failures_output, parsed_test_cases)

    @unittest.mock.patch('requests.get')
    def test_retrieve_failed_allure_suites_information_on_successful_suites(self,
                                                                            get_request_mock):
        """
        Tests that retrieve_failed_allure_suites_information will return an empty object if all
        suites have passed
        :param get_request_mock
        :return: None
        """
        get_request_mock.return_value = self.response_mock(self.successful_allure_report)
        parsed_test_cases = TestCaseParser(
            "DUMMY_URL").retrieve_failed_allure_suites_information()
        self.assertEqual({}, parsed_test_cases)

    @unittest.mock.patch('requests.get')
    def test_retrieve_failed_allure_suites_information_on_failed_suites(self, get_request_mock):
        """
        Tests that retrieve_failed_aptu_suites_information will return a empty object containing
        the failed suites information, if some suite failed
        :param get_request_mock
        :return: None
        """
        get_request_mock.return_value = self.response_mock(self.failed_allure_report)
        parsed_test_cases = TestCaseParser(
            "DUMMY_URL").retrieve_failed_allure_suites_information()
        self.assertEqual(self.allure_report_failure_output, parsed_test_cases)

    @unittest.mock.patch('requests.get')
    def test_retrieve_failed_allure_suites_information_on_broken_suites(self, get_request_mock):
        """
        Tests that retrieve_failed_aptu_suites_information will return a empty object containing
        the failed suites information, if some suite was broken
        :param get_request_mock
        :return: None
        """
        get_request_mock.return_value = self.response_mock(self.broken_allure_report)
        parsed_test_cases = TestCaseParser("DUMMY_URL").retrieve_failed_allure_suites_information()
        self.assertEqual(self.allure_report_broken_output, parsed_test_cases)

    @unittest.mock.patch('requests.get')
    def test_failed_adu_suite(self, get_request_mock):
        """
        Tests that retrieve_failed_adu_information will return the appropriate failure
        :param get_request_mock
        :return: None
        """
        get_request_mock.side_effect = [self.response_mock(self.failed_high_level_adu_suite),
                                        self.response_mock(self.failed_low_level_adu_suite)]
        parsed_test_cases = TestCaseParser("DUMMY_URL").retrieve_failed_adu_information()

        self.assertEqual(parsed_test_cases, self.adu_report_failed_output)

    @unittest.mock.patch('requests.get')
    def test_successful_adu_suite(self, get_request_mock):
        """
        Tests that retrieve_failed_adu_information will return an empty object if all
        suites have passed
        :param get_request_mock
        :return: None
        """
        get_request_mock.return_value = self.response_mock(self.successful_adu_report)
        parsed_test_cases = TestCaseParser("DUMMY_URL").retrieve_failed_adu_information()
        self.assertEqual(parsed_test_cases, {})

    def test_parse_adu_suite_fail_wait_upgrade(self):
        """
        Tests the retrieve_failed_adu_information function caters for when ADU failed to wait for
        the upgrade to start
        :return: None
        """
        test_case_json = """{
            "failure": {
                "message": "Failed to wait for Upgrade to start"
            }
        }
        """
        test_case_output = {'UpgradeAvailability': ['UpgradeAvailability']}

        test_case_parser = TestCaseParser("DUMMY_URL")
        test_case_parser.parse_adu_suite_failures(json.loads(test_case_json))
        self.assertEqual(test_case_parser.failed_suites, test_case_output)

    def test_parse_adu_suite_enm_downtime(self):
        """
        Tests the retrieve_failed_adu_information function caters for when ADU encounters a failed
        upgrade
        :return: None
        """
        test_case_json = """{
            "failure": {
                "message": "AssertionError: ENM Downtime Assertion(Threshold) failed"
            }
        }
        """
        test_case_output = {'UpgradeAvailability': ['UpgradeAvailability']}
        test_case_parser = TestCaseParser("DUMMY_URL")
        test_case_parser.parse_adu_suite_failures(json.loads(test_case_json))
        self.assertEqual(test_case_parser.failed_suites, test_case_output)

    def test_parse_adu_suite_test_suite_prep_fail(self):
        """
        Tests the retrieve_failed_adu_information function caters for when an ADU fails in test
        suite preparation
        :return: None
        """
        test_case_json = """{
            "failure": {
                "message": "1 applications were activated and failed in preparation method"
            }
        }
        """
        test_case_parser = TestCaseParser("DUMMY_URL")
        suite_prep_fail_output = test_case_parser.parse_adu_suite_failures(json.loads(
          test_case_json))
        self.assertEqual(test_case_parser.failed_suites, {})
        self.assertEqual(suite_prep_fail_output, True)

    def test_parse_adu_suite_upgrade_failure(self):
        """
        Tests the retrieve_failed_adu_information function caters for when ADU encounters a failed
        upgrade
        :return: None
        """
        test_case_json = """{
            "failure": {
                "message": "Upgrade failed during SVC/EVT/SCP upgrade."
            }
        }
        """
        test_case_output = {'UpgradeAvailability': ['UpgradeAvailability']}
        test_case_parser = TestCaseParser("DUMMY_URL")
        test_case_parser.parse_adu_suite_failures(json.loads(test_case_json))
        self.assertEqual(test_case_parser.failed_suites, test_case_output)

    def test_parse_adu_suite_ha_01_disabled(self):
        """
        Tests the retrieve_failed_adu_information function caters for when the HA_01 profile is
        not configured correctly
        :return: None
        """
        test_case_json = """{
            "failure": {
                "message": "AssertionError: HA_01 is disabled or not configured"
            }
        }
        """
        test_case_parser = TestCaseParser("DUMMY_URL")
        ha_01_not_configured_output = test_case_parser.parse_adu_suite_failures(json.loads(
          test_case_json))
        self.assertEqual(test_case_parser.failed_suites, {})
        self.assertEqual(ha_01_not_configured_output, True)

    def test_parse_adu_suite_esmon_not_online(self):
        """
        Tests the retrieve_failed_adu_information function caters for failure thrown when ESMON is
        not online within 15 minutes post MS reboot
        :return: None
        """
        test_case_json = """{
            "failure": {
                "message": "ESMON Vm Not Online within 15 min post MS reboot"
            }
        }
        """
        test_case_output = {'UpgradeAvailability': ['UpgradeAvailability']}
        test_case_parser = TestCaseParser("DUMMY_URL")
        test_case_parser.parse_adu_suite_failures(json.loads(test_case_json))
        self.assertEqual(test_case_parser.failed_suites, test_case_output)

    def test_parse_adu_suite_cant_connect_netsim(self):
        """
        Tests the retrieve_failed_adu_information function caters for when a JSchCLIToolException
        exception is thrown
        :return: None
        """
        test_case_json = """{
            "failure": {
                "message": "JSchCLIToolException: Can't open session"
            }
        }
        """
        test_case_parser = TestCaseParser("DUMMY_URL")
        jsch_exception_output = test_case_parser.parse_adu_suite_failures(json.loads(
          test_case_json))
        self.assertEqual(test_case_parser.failed_suites, {})
        self.assertEqual(jsch_exception_output, True)

    def test_parse_adu_suite_test_suite_failed(self):
        """
        Tests the retrieve_failed_adu_information function caters for when a test suite failes
        :return: None
        """
        test_case_json = """{
            "failure": {
                "message": "AssertionError: FAIL: 2 out of 19 test steps failed"
            },
            "steps": [
                {
                    "name" : "@BeforeSuite: beforeSuiteSetup",
                    "title" : "@Before suite: before suite setup",
                    "status" : "PASSED"
                }, {
                    "name" : "executeNETEX",
                    "title" : "NETEX_VERIFY: executeNETEX",
                    "status" : "FAILED"
                }
            ]
        }
        """
        test_case_output = {'NETEX_VERIFY': ['executeNETEX']}
        test_case_parser = TestCaseParser("DUMMY_URL")
        test_case_parser.parse_adu_suite_failures(json.loads(test_case_json))
        self.assertEqual(test_case_parser.failed_suites, test_case_output)

    def test_parse_adu_suite_load_not_initialized(self):
        """
        Tests the retrieve_failed_adu_information function caters for when the @BeforeSuite fails
        :return: None
        """
        test_case_json = """{
            "failure" : {
                "message" : "AssertionError: FAIL: 2 out of 17 test steps failed"
            },
            "steps" : [
                {
                    "name" : "@BeforeSuite: beforeSuiteSetup",
                    "title" : "@Before suite: before suite setup",
                    "status" : "FAILED"
                }, {
                    "name" : "@AfterSuite: afterSuiteTeardown",
                    "title" : "@After suite: after suite teardown",
                    "status" : "SKIPPED"
                }
            ]
        }"""
        test_case_output = {'UpgradeAvailability': ['UpgradeAvailability']}
        test_case_parser = TestCaseParser("DUMMY_URL")
        test_case_parser.parse_adu_suite_failures(json.loads(test_case_json))
        self.assertEqual(test_case_parser.failed_suites, test_case_output)

    def test_parse_adu_suite_non_catered_for_failure(self):
        """
        Tests the retrieve_failed_adu_information function returns False when the current failure
        is not catered for
        :return: None
        """
        test_case_json = """{
            "failure": {
                "message": "I'm not catered for"
            }
        }
        """
        test_case_parser = TestCaseParser("DUMMY_URL")
        non_catered_for_failure = test_case_parser.parse_adu_suite_failures(json.loads(
          test_case_json))
        self.assertEqual(non_catered_for_failure, False)

    def test_add_test_suite_should_add_suite_if_suite_doesnt_exist(self):
        """
        Tests that the add_test_suite function should add a same test suite
        to the test_case_parsers failed_suites property
        :return: None
        """
        test_case_parser = TestCaseParser("DUMMY_URL")
        mock_suite_name = "MOCK_SUITE_NAME"
        test_case_parser.add_test_suite(mock_suite_name)
        self.assertEqual(test_case_parser.failed_suites, {mock_suite_name: []})

    def test_add_test_suite_should_not_add_suite_if_suite_already_exist(self):
        """
        Tests that the add_test_suite function should not add the same test suite
        to the test_case_parsers failed_suites property multiple times
        :return: None
        """
        test_case_parser = TestCaseParser("DUMMY_URL")
        mock_suite_name = "MOCK_SUITE_NAME"
        test_case_parser.add_test_suite(mock_suite_name)
        test_case_parser.add_test_suite(mock_suite_name)
        self.assertEqual(test_case_parser.failed_suites, {mock_suite_name: []})

    def test_add_failed_test_cases_one_test_case(self):
        """
        Tests the add_failed_test_cases function using one test case
        :return: None
        """
        test_case_parser = TestCaseParser("DUMMY_URL")
        mock_suite_name = "SYSTEM"
        mock_test_case = "No Dump files generated?"
        test_case_parser.add_failed_test_cases(mock_suite_name, mock_test_case)
        self.assertEqual({mock_suite_name: [mock_test_case]}, test_case_parser.failed_suites)

    def test_add_failed_test_cases_multiple_test_case(self):
        """
        Tests the add_failed_test_cases function using multiple test case
        :return: None
        """
        test_case_parser = TestCaseParser("DUMMY_URL")
        mock_suite_name = "SYSTEM"
        mock_test_case = "No Dump files generated?"
        test_case_parser.add_failed_test_cases(mock_suite_name, mock_test_case)
        test_case_parser.add_failed_test_cases(mock_suite_name, mock_test_case)
        self.assertEqual({mock_suite_name: [mock_test_case, mock_test_case]},
                         test_case_parser.failed_suites)
