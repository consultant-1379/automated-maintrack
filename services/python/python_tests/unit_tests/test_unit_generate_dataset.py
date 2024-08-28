"""
    Unit testing generate_dataset.py
"""

# pylint: disable=import-error
import unittest
import unittest.mock
import pandas as pd

from miscellaneous.amt_ml_dataset_generator.generate_dataset import \
    generate_csv_file_header, generate_csv_file, add_test_case_to_features, add_to_features

MOCK_DG_LIST = [['21.03.1', '51390', '1']]
MOCK_FEATURES_POPULATED = {
    'rpm_names': {'ERICasrn_CXP9039136': ['21.03.1,51390', '21.03.11,51420', '21.03.50,51582']},
    'rpm_teams': {'Anveshan': ['21.03.1,51390', '21.03.11,51420', '21.03.50,51582']},
    'rpm_categories': {},
    'rpm_services': {},
    'test_cases': {'SYSTEM': ['21.03.1,51390', '21.03.1,51389', '21.03.2,51394', '21.03.2,51393',
                              '21.03.2,51392', '21.03.3,51399', '21.03.3,51398', '21.03.3,51397',
                              '21.03.3,51395', '21.03.4,51400', '21.03.5,51404', '21.03.5,51403']}
}
MOCK_FEATURES = {
    'rpm_names': {},
    'rpm_teams': {},
    'rpm_categories': {},
    'rpm_services': {},
    'test_cases': {}
}
MOCK_TEST_TRAINING_DATASET_COLUMNS_WITHOUT_FEATURES_POPULATED = ['PS', 'DG Number', 'obsoleted']
MOCK_TEST_TRAINING_DATASET_COLUMNS_WITH_FEATURES_POPULATED = \
    ['PS', 'DG Number', 'ERICasrn_CXP9039136', 'Anveshan', 'SYSTEM', 'obsoleted']
MOCK_TEST_TRAINING_DATASET_VALUES_WITHOUT_FEATURES_POPULATED = []
MOCK_TEST_TRAINING_DATASET_VALUES_WITH_FEATURES_POPULATED = ['21.03.1', 51390, 1, 1, 0, 1]
TEST_TRAINING_DATASET_CSV_PATH = 'python_tests/test_training_dataset.csv'


class TestGenerateDataset(unittest.TestCase):

    def test_generate_csv_file_header_without_features_populated(self):
        """
        Tests that the csv file header is created correctly
        Without features populated
        """
        self.assertEqual('PS,DG Number,obsoleted\n', generate_csv_file_header())

    @unittest.mock.patch('miscellaneous.amt_ml_dataset_generator.generate_dataset.FEATURES',
                         MOCK_FEATURES_POPULATED)
    def test_generate_csv_file_header_with_features_populated(self):
        """
        Tests that the csv file header is created correctly
        With features populated
        """
        self.assertEqual('PS,DG Number,ERICasrn_CXP9039136,Anveshan,SYSTEM,obsoleted\n',
                         generate_csv_file_header())

    def test_generate_csv_file_without_features_populated(self):
        """
        Tests that the csv file is created correctly
        Without features populated
        """
        test_dataset_file = open(TEST_TRAINING_DATASET_CSV_PATH, "w")
        generate_csv_file(test_dataset_file)
        test_dataset_file.close()
        test_training_dataset = pd.read_csv(TEST_TRAINING_DATASET_CSV_PATH)
        self.assertEqual(MOCK_TEST_TRAINING_DATASET_COLUMNS_WITHOUT_FEATURES_POPULATED,
                         list(test_training_dataset.columns))
        self.assertEqual(MOCK_TEST_TRAINING_DATASET_VALUES_WITHOUT_FEATURES_POPULATED,
                         list(test_training_dataset.values))

    @unittest.mock.patch('miscellaneous.amt_ml_dataset_generator.generate_dataset.FEATURES',
                         MOCK_FEATURES_POPULATED)
    @unittest.mock.patch('miscellaneous.amt_ml_dataset_generator.generate_dataset.DG_LIST',
                         MOCK_DG_LIST)
    def test_generate_csv_file_with_features_populated(self):
        """
        Tests that the csv file is created correctly
        With features populated
        """
        test_dataset_file = open(TEST_TRAINING_DATASET_CSV_PATH, "w")
        generate_csv_file(test_dataset_file)
        test_dataset_file.close()
        test_training_dataset = pd.read_csv(TEST_TRAINING_DATASET_CSV_PATH)
        self.assertEqual(MOCK_TEST_TRAINING_DATASET_COLUMNS_WITH_FEATURES_POPULATED,
                         list(test_training_dataset.columns))
        self.assertEqual(MOCK_TEST_TRAINING_DATASET_VALUES_WITH_FEATURES_POPULATED,
                         list(test_training_dataset.values[0]))

    @unittest.mock.patch('miscellaneous.amt_ml_dataset_generator.generate_dataset.FEATURES',
                         MOCK_FEATURES)
    def test_adding_dg_to_test_case_feature(self):
        """
        Tests adding a dg to a test case
        """
        add_test_case_to_features('SYSTEM', '51390')
        self.assertIn('SYSTEM', MOCK_FEATURES['test_cases'])
        self.assertIn('51390', MOCK_FEATURES['test_cases']['SYSTEM'])

    @unittest.mock.patch('miscellaneous.amt_ml_dataset_generator.generate_dataset.FEATURES',
                         MOCK_FEATURES)
    def test_appending_dg_to_test_case_feature(self):
        """
        Tests appending a dg to a test case
        """
        add_test_case_to_features('SYSTEM', '51391')
        self.assertIn('51390', MOCK_FEATURES['test_cases']['SYSTEM'])
        self.assertIn('51391', MOCK_FEATURES['test_cases']['SYSTEM'])

    @unittest.mock.patch('miscellaneous.amt_ml_dataset_generator.generate_dataset.FEATURES',
                         MOCK_FEATURES)
    def test_add_to_features(self):
        """
        Tests adding dg information to a feature
        :return:
        """
        add_to_features('21.03.1', 'Dynamo', 'rpm_teams', str(51390))
        self.assertIn('Dynamo', MOCK_FEATURES['rpm_teams'])
        self.assertIn('21.03.1,51390', MOCK_FEATURES['rpm_teams']['Dynamo'])

    @unittest.mock.patch('miscellaneous.amt_ml_dataset_generator.generate_dataset.FEATURES',
                         MOCK_FEATURES)
    def test_append_to_features(self):
        """
        Tests appending dg information to a feature
        :return:
        """
        add_to_features('21.03.2', 'Warriors', 'rpm_teams', str(51391))
        self.assertIn('Dynamo', MOCK_FEATURES['rpm_teams'])
        self.assertIn('21.03.1,51390', MOCK_FEATURES['rpm_teams']['Dynamo'])
        self.assertIn('Warriors', MOCK_FEATURES['rpm_teams'])
        self.assertIn('21.03.2,51391', MOCK_FEATURES['rpm_teams']['Warriors'])


if __name__ == '__main__':
    unittest.main()
