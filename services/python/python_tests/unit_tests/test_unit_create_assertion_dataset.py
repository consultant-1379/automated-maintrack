"""
    Unit testing create_assertion_dataset.py
"""

import unittest

# pylint: disable=import-error
import miscellaneous.amt_ml_dataset_generator.create_assertion_dataset as CreateDataset

ROW_WHERE_1s_START_AT_INDEX_6 = ["TEMPLATE_PS", "TEMPLATE_DG", 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]
ROW_WHERE_1s_START_AT_INDEX_10 = ["TEMPLATE_PS", "TEMPLATE_DG", 0, 0, 0, 0, 0, 0, 0,
                                  0, 1, 1, 1, 1]


class TestCreateAssertionDatasetTest(unittest.TestCase):
    """
    This tests functions in create_assertion_dataset.py
    """
    def test_generate_first_row_of_new_csv_file(self):
        """
        Tests we are able to successfully generate the first row of the new csv file
        """
        first_row_of_csv_file = CreateDataset.generate_first_row_of_new_csv_file(6, 14)
        self.assertListEqual(first_row_of_csv_file, ROW_WHERE_1s_START_AT_INDEX_6)

        first_row_of_csv_file = CreateDataset.generate_first_row_of_new_csv_file(10, 14)
        self.assertListEqual(first_row_of_csv_file, ROW_WHERE_1s_START_AT_INDEX_10)
