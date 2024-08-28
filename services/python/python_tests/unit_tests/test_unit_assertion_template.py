"""
    Unit testing assertion_template.py
"""

import unittest
from unittest.mock import patch

import pandas as pd

# pylint: disable=import-error
from machine_learning.assertion_template import AssertionTemplate


class TestAssertionTemplate(unittest.TestCase):
    """
    This tests the AssertionTemplate class in assertion_template.py
    """

    test_data_frame_location = "test_data_frame.csv"
    template_columns = ['PS', 'DG Number', 'ERICfronthaul6000fmhandlersmodel_CXP9035807',
                        'ERICTAFpki-manager-ui_CXP9032048',
                        'UserManagement_RFALoop250 - DespicableUs',
                        'SoftwareHardwareManager_MINI-LINK - Scorpions']
    template_first_row = ['TEMPLATE_PS', 'TEMPLATE_DG', 0, 0, 1, 1]

    @patch('machine_learning.assertion_template.pd.read_csv')
    def test_assertion_template_generates_successfully(self, mock_read_csv):
        """
        Tests we are able to successfully generate an AssertionTemplate object
        """
        mock_read_csv.return_value = pd.DataFrame([self.template_first_row],
                                                  columns=self.template_columns)
        assertion_template = AssertionTemplate(self.test_data_frame_location)
        self.assertTrue(assertion_template)

    @patch('machine_learning.assertion_template.pd.read_csv')
    def test_we_can_get_headers_from_assertion_template(self, mock_read_csv):
        """
        Tests we are able to successfully generate an AssertionTemplate with the correct columns
        """
        mock_read_csv.return_value = pd.DataFrame([self.template_first_row],
                                                  columns=self.template_columns)
        assertion_template = AssertionTemplate(self.test_data_frame_location)
        self.assertEqual(assertion_template.csv_headers, self.template_columns)

    @patch('machine_learning.assertion_template.pd.read_csv')
    def test_we_can_get_columns_from_assertion_template(self, mock_read_csv):
        """
        Tests we are able to successfully generate an AssertionTemplate with the correct first row
        """
        mock_read_csv.return_value = pd.DataFrame([self.template_first_row],
                                                  columns=self.template_columns)
        assertion_template = AssertionTemplate(self.test_data_frame_location)
        self.assertEqual(assertion_template.csv_first_row, self.template_first_row)

    def test_exception_raises_if_can_not_find_assertion_template(self):
        """
        Tests we are able to successfully generate an AssertionTemplate with the correct first row
        """
        with self.assertRaises(Exception) as thrown_exception:
            AssertionTemplate("/ThisPathIsInvalid.csv")
        self.assertTrue(
            "Unable to read assertion template from csv file" in str(thrown_exception.exception))
