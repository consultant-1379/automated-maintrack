"""
This script provides a CLI into modifing the assertion_dataset_template.csv file
"""
import argparse
import os
import pandas as pd

TRAINING_DATASET_LOCATION = "miscellaneous/amt_ml_dataset_generator/training_dataset.csv"
ASSERTION_DATASET_TEMPLATE_LOCATION = "machine_learning/assertion_dataset_template.csv"
FIRST_INSTANCE_OF_TESTWARE = "AutoProvisioning - GreatWall"


def parse_args():
    """
    :return parser.parse_args():
    This function parses the passed in system arguments.
    """
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description='''
    Description:
    This script is used to modify the assertion_dataset_template.csv file to be used by
    AMT's ML model.
    '''
    )
    return parser.parse_args()


def generate_first_row_of_new_csv_file(
  first_instance_of_testware_from_headers, number_of_headers):
    """
    This will return a list of data which corresponds to what our ML model will expect in terms of
    the assertion_dataset_template.csv file
    :param first_instance_of_testware_from_headers
    :param number_of_headers
    :return: modified list of data to write to csv file
    """
    zeros_which_represent_dgs_and_teams = [0] * first_instance_of_testware_from_headers
    ones_which_represet_failed_suites = [1] * (
        number_of_headers - first_instance_of_testware_from_headers)
    zeros_which_represent_dgs_and_teams[0] = "TEMPLATE_PS"
    zeros_which_represent_dgs_and_teams[1] = "TEMPLATE_DG"
    first_row_of_new_csv_file = zeros_which_represent_dgs_and_teams \
        + ones_which_represet_failed_suites
    return first_row_of_new_csv_file


def execute_functions():
    """
    This will modify the assertion_dataset_template.csv file stored in the AMT repo and have it
    ready to be pushed for review to Gerrit
    """
    training_dataset_dataframe = pd.read_csv(TRAINING_DATASET_LOCATION)
    column_headers_from_csv = list(training_dataset_dataframe.columns)
    length_of_column_headers_list = len(column_headers_from_csv)
    index_of_first_testware_from_headers = column_headers_from_csv.index(FIRST_INSTANCE_OF_TESTWARE)
    testware_and_dgs_for_output_csv = generate_first_row_of_new_csv_file(
        index_of_first_testware_from_headers, length_of_column_headers_list)
    output_dataframe = pd.DataFrame([testware_and_dgs_for_output_csv],
                                    columns=column_headers_from_csv)
    output_dataframe = output_dataframe.drop(columns=['obsoleted'])
    os.remove(ASSERTION_DATASET_TEMPLATE_LOCATION)
    output_dataframe.to_csv(ASSERTION_DATASET_TEMPLATE_LOCATION, index=False)


if __name__ == "__main__":
    parse_args()
    execute_functions()
