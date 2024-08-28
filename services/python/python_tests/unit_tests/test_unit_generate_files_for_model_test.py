"""
    Unit testing generate_files_for_model_test.py
"""

import unittest
import unittest.mock
import pandas as pd

# pylint: disable=import-error
import miscellaneous.amt_ml_dataset_generator.generate_files_for_model_test \
  as GenerateFilesForModelTest

MOCK_TRAINING_DATASET_HEADERS = ["PS", "DG Number",
                                 "ERICmlindoorplatformnodemodelcommon_CXP9037795",
                                 "ERICminilinkindoorunifiednrmtransplug_CXP9037589",
                                 "SoftwareHardwareManager_MINI-LINK - Scorpions",
                                 "SoftwareHardwareManager_InstantaneousLicensing_RFA250 - Ameya"]

MOCK_DATASET_ROW_ONE = ["21.03", "12345", 1, 1, 0, 1]
MOCK_DATASET_ROW_TWO = ["21.04", "12346", 0, 1, 1, 0]
MOCK_DATASET_ROW_THREE = ["21.04", "12347", 1, 0, 1, 1]
MOCK_DATASET_ROW_FOUR = ["21.05", "12348", 1, 1, 1, 1]


class TestGenerateFilesForModelTest(unittest.TestCase):
    """
    This tests functions in generate_files_for_model_test.py
    """
    def test_add_necessary_rows_to_headered_dataframe_valid_drop(self):
        """
        Tests that passing a drop into the add_necessary_rows_to_headered_dataframe that exists
        in dataframe_to_loop_for_drops, will return all expected rows
        """
        dataframe_to_loop_for_drops = pd.DataFrame(
          [MOCK_DATASET_ROW_ONE, MOCK_DATASET_ROW_TWO, MOCK_DATASET_ROW_THREE,
           MOCK_DATASET_ROW_FOUR], columns=MOCK_TRAINING_DATASET_HEADERS)
        dataframe_with_just_headers = pd.DataFrame(columns=MOCK_TRAINING_DATASET_HEADERS)
        output_dataframe = GenerateFilesForModelTest.add_necessary_rows_to_headered_dataframe(
          dataframe_to_loop_for_drops, dataframe_with_just_headers, "21.04")
        number_of_row_in_output_dataframe = output_dataframe.shape[0]
        self.assertEqual(number_of_row_in_output_dataframe, 2)

    def test_add_necessary_rows_to_headered_dataframe_non_valid_drop(self):
        """
        Tests that passing a drop into the add_necessary_rows_to_headered_dataframe that does not
        exist in dataframe_to_loop_for_drops, will return a dataframe without any rows
        """
        dataframe_to_loop_for_drops = pd.DataFrame(
          [MOCK_DATASET_ROW_ONE, MOCK_DATASET_ROW_TWO, MOCK_DATASET_ROW_THREE,
           MOCK_DATASET_ROW_FOUR], columns=MOCK_TRAINING_DATASET_HEADERS)
        dataframe_with_just_headers = pd.DataFrame(columns=MOCK_TRAINING_DATASET_HEADERS)
        output_dataframe = GenerateFilesForModelTest.add_necessary_rows_to_headered_dataframe(
          dataframe_to_loop_for_drops, dataframe_with_just_headers, "FAKE_DROP")
        number_of_row_in_output_dataframe = output_dataframe.shape[0]
        self.assertEqual(number_of_row_in_output_dataframe, 0)

    @unittest.mock.patch('os.path.isdir')
    def test_fail_script_if_folder_already_exists(self, os_mock):
        """
        Tests fail_script_if_folder_already_exists does nothing if folder specified does not
        already exist
        """
        os_mock.return_value = False
        self.assertIsNone(
          GenerateFilesForModelTest.fail_script_if_folder_already_exists('/path/to/folder'))

    @unittest.mock.patch('os.path.isdir')
    def test_fail_script_if_folder_already_exists_raises_exception(self, os_mock):
        """
        Tests fail_script_if_folder_already_exists exits if folder specified does
        already exists
        """
        os_mock.return_value = True
        self.assertRaises(SystemExit,
                          GenerateFilesForModelTest.fail_script_if_folder_already_exists,
                          '/path/to/folder')
