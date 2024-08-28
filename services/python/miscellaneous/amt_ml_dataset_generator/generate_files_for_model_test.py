"""
This script provides a CLI which moves and creates necessary files for testing a new ML model.
It will create a folder on the users Desktop which contains all necessary files
This script is only needed for ease in testing
"""
import argparse
import os
import shutil
import sys
import pandas as pd

MODEL_LOCATION = 'machine_learning/model.pickle'
TRAINING_DATASET_LOCATION = 'miscellaneous/amt_ml_dataset_generator/training_dataset.csv'
JUPYTER_NOTEBOOK_LOCATION = 'jupyter_notebooks/predict_new_drop.ipynb'


def parse_args():
    """
    :return parser.parse_args():
    This function parses the passed in system arguments.
    """
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description='''
    Description:
    This script is used to move and create necessary file for testing a new ML models accuracy.
    ''',
        epilog='''
    Examples:
      -> ''' + sys.argv[0] + ''' -d '21.03'
    '''
    )
    parser.add_argument("-d", "--drop_for_assertion_dataset",
                        help="Drop to generate assertion dataset for", required=True)

    if not sys.argv[1:]:
        print("No arguments passed in")
        parser.print_help()
        sys.exit(1)
    return parser.parse_args()


def fail_script_if_folder_already_exists(path_of_folder_to_check):
    """
    This will exit the script if the folder being checked already exists
    :param path_of_folder_to_check
    :return: None
    """
    if os.path.isdir(path_of_folder_to_check):
        print('ERROR: Folder already exists at {0}. Please delete and rerun.'.format(
            path_of_folder_to_check))
        sys.exit(1)


def add_necessary_rows_to_headered_dataframe(dataframe_to_loop_for_drops,
                                             dataframe_with_just_headers, required_drop):
    """
    This will loop through the specified dataframe and add all rows of said dataframe which
    correspond to the specified drop to a dataframe with just the required headers
    :param dataframe_to_loop_for_drops
    :param dataframe_with_just_headers
    :param required_drop
    :return: pandas dataframe with required drops
    """
    for loop_index in range(len(dataframe_to_loop_for_drops)):
        if '.'.join(dataframe_to_loop_for_drops
                    .iloc[loop_index]["PS"].split('.')[:2]) == required_drop:
            dataframe_with_just_headers = dataframe_with_just_headers.append(
                dataframe_to_loop_for_drops.iloc[[loop_index]])
    return dataframe_with_just_headers


def execute_functions(args):
    """
    This will move and create necessary files for testing a new ML model.
    It will create a folder on the users Desktop which contains all necessary files for testing
    """
    drop_for_assertion_dataset = args.drop_for_assertion_dataset
    path_to_desktop = os.path.expanduser('~/Desktop/')
    path_to_folder_on_desktop = path_to_desktop + drop_for_assertion_dataset + '_helper/'

    fail_script_if_folder_already_exists(path_to_folder_on_desktop)
    os.mkdir(path_to_folder_on_desktop)
    training_dataset_dataframe = pd.read_csv(TRAINING_DATASET_LOCATION)
    training_dataset_headers = list(training_dataset_dataframe.columns)
    assertion_dataframe_with_only_headers = pd.DataFrame(columns=training_dataset_headers)
    assertion_dataframe = add_necessary_rows_to_headered_dataframe(
        training_dataset_dataframe, assertion_dataframe_with_only_headers,
        drop_for_assertion_dataset)
    assertion_dataframe.to_csv(path_to_folder_on_desktop + '/assertion_dataset.csv', index=False)

    shutil.copy(TRAINING_DATASET_LOCATION, path_to_folder_on_desktop)
    shutil.copy(MODEL_LOCATION, path_to_folder_on_desktop)
    shutil.copy(JUPYTER_NOTEBOOK_LOCATION, path_to_folder_on_desktop)


if __name__ == "__main__":
    execute_functions(parse_args())
