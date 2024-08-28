"""
    Unit testing obsoletion_predictor.py
"""

import unittest
import pandas as pd

# pylint: disable=import-error
from machine_learning.obsoletion_predictor import ObsoletionPredictor


class TestObsoletionPredictor(unittest.TestCase):
    """
    This tests the ObsoletionPredictor class in obsoletion_predictor.py
    """

    def test_perform_predictions_based_on_threshold(self):
        """
        Tests we are able to successfully determine whether or not a dg should be obsoleted based
        on the predictions from the model and the threshold
        """
        self.threshold = 0.971
        prob_predictions_from_model = [[.99, .01], [.89, .11], [.98, .02], [.76, .24]]
        predictions_based_on_threshold = ObsoletionPredictor.perform_predictions_based_on_threshold(
            self, prob_predictions_from_model)
        self.assertListEqual(predictions_based_on_threshold, [0, 1, 0, 1])

    def test_create_formatted_obsoletion_object(self):
        """
        Tests that we are able to successfully generate an obsoletion object when the necessary
        parameters are populated
        """
        obsoletion_predictions = [1, 0, 0, 1]
        dg_numbers = pd.DataFrame([123, 234, 345, 456], columns=['DG Number'])['DG Number']
        prob_predictions_from_model = [[.99, .01], [.89, .11], [.98, .02], [.76, .24]]
        formatted_obsoletion_object = \
            ObsoletionPredictor.create_formatted_obsoletion_object(self, obsoletion_predictions,
                                                                   dg_numbers,
                                                                   prob_predictions_from_model)
        self.assertIsInstance(formatted_obsoletion_object, object)
        self.assertEqual(formatted_obsoletion_object["123"]["action"], "Obsolete")
        self.assertEqual(formatted_obsoletion_object["123"]["confidence_in_keeping_dg"], 99.0)
        self.assertEqual(formatted_obsoletion_object["234"]["action"], "Do not obsolete")
        self.assertEqual(formatted_obsoletion_object["234"]["confidence_in_keeping_dg"], 89.0)
