"""
This module exists only to retrain the machine learning model
"""

import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV

# pylint: disable=import-error
from miscellaneous.amt_ml_dataset_generator.pickle_actions import dump_model_into_pickle

TRAINING_DATASET_LOCATION = 'miscellaneous/amt_ml_dataset_generator/training_dataset.csv'

SVC_PARAMETERS = {
    'kernel': ('linear', 'rbf'),
    'C': (1, 0.25, 0.5, 0.75),
    'gamma': (1, 2, 3, 'auto'),
    'decision_function_shape': ('ovo', 'ovr'),
    'shrinking': (True, False)
}


def read_in_training_data():
    """
    This function reads in training data and dumps it into dataframes
    :return: features, labels
    """
    dataframe = pd.read_csv(TRAINING_DATASET_LOCATION)
    dataframe = dataframe.drop(columns=['PS', 'DG Number'])
    data_frame_features = dataframe.drop('obsoleted', axis=1)
    data_frame_labels = dataframe['obsoleted']

    return data_frame_features, data_frame_labels


def perform_hyperparameter_tuning(data_frame_features, data_frame_labels):
    """
    This function performs hyperparameter tuning on the input data to determine
    the best variation of the SVC algorithm to use
    :param data_frame_features: A feature is an input variable
    :param data_frame_labels: A label is the thing we're predicting
    """
    grid = GridSearchCV(SVC(probability=True), SVC_PARAMETERS, refit=True, verbose=3)

    grid.fit(data_frame_features, data_frame_labels)

    print('SVC best score: ' + str(grid.best_score_))

    estimator = grid.best_estimator_

    estimator.fit(data_frame_features, data_frame_labels)
    dump_model_into_pickle(estimator)


if __name__ == "__main__":
    features, labels = read_in_training_data()
    perform_hyperparameter_tuning(features, labels)
