import os
import pickle
import pandas as pd
import numpy


class ObsoletionPredictor(object):
    """
    This class is used to perform ML predictions based on the data passed in
    """
    def __init__(self, location_of_ml_model, data_frame_list, assertion_template, threshold):
        """
        Initialize Predictor
        :param: location_of_ml_model
        :param: data_frame_list
        :param: assertion_template
        :param: threshold
        """
        self.location_of_ml_model = location_of_ml_model
        self.data_frame_list = data_frame_list
        self.assertion_template = assertion_template
        self.threshold = threshold

        self.trained_model = self.load_ml_model()
        self.obsoletion_object = self.generate_obsoletion_object()

    def generate_obsoletion_object(self):
        """
        This will orchestrate calling the necessary functions needed to return a ml prediction
        :return: formatted_obsoletion_object
        """
        data_frame_with_all_prediction_data = pd.DataFrame(self.data_frame_list, columns=self.assertion_template.csv_headers)
        dg_numbers = data_frame_with_all_prediction_data['DG Number']
        data_frame_to_predict_on = data_frame_with_all_prediction_data.drop(columns=['PS', 'DG Number'])
        probability_predictions = self.trained_model.predict_proba(data_frame_to_predict_on)

        predictions_with_threshold = self.perform_predictions_based_on_threshold(probability_predictions)
        return self.create_formatted_obsoletion_object(predictions_with_threshold, dg_numbers, probability_predictions)

    def load_ml_model(self):
        """
        This will load in the necessary ml model from the repo
        :return: trained_model
        """
        try:
            with open(self.location_of_ml_model, 'rb') as model_pickle:
                trained_model = pickle.load(model_pickle)
            return trained_model
        except IOError:
            raise Exception('Unable to load ml model pickle')

    def perform_predictions_based_on_threshold(self, prob_predictions):
        """
        This will set the obsoletion recommendations based on the threshold passed in
        The prob_predictions seen as a parameter in this function is list of tuples generated from our model which is of the form ["probability_we_should_not_obsolete", "probability_we_should_obsolete"]
        So the full list for 3 DGs, might look like [[0.99, 0.01], [0.90, 0.10], [0.20, 0.80]]
        So in the above example, the first tuple means theres a 99% chance the DG is good, and a 1% chance the dg is bad
        Using this data, we then use the "probability_we_should_not_obsolete" data and our threshold, to see what we should reccomend for obsoletion
        :param: prob_predictions
        :return: predictions_with_threshold
        """
        predictions_with_threshold = []
        dgs_to_obsolete = []
        dgs_to_not_obsolete = []
        for probability_percentages in prob_predictions:
            if probability_percentages[0] >= self.threshold:
                predictions_with_threshold.append(0)
                dgs_to_not_obsolete.append(0)
            else:
                predictions_with_threshold.append(1)
                dgs_to_obsolete.append(1)
        return predictions_with_threshold

    def create_formatted_obsoletion_object(self, predictions_with_threshold, dg_numbers, prob_predictions):
        """
        This will create a human readable formatted object which contains obsoletion information
        It will let the user on a per DG basis, the recommendation that the ML has made with regard to obsolete or don't obsolete
        It will return something in the form
        {
            '123': {'action': 'Obsolete', 'confidence_in_keeping_dg': 96.064801},
            '456': {'action': 'Do not obsolete', 'confidence_in_keeping_dg': 98.06241}
        }
        :param: predictions_with_threshold
        :param: dg_numbers
        :param: prob_predictions
        :return: obsoletion_object
        """
        obsoletion_object = {}
        for index_of_loop, prediction_with_threshold in enumerate(predictions_with_threshold):
            if prediction_with_threshold == 0:
                action = "Do not obsolete"
            else:
                action = "Obsolete"

            obsoletion_object[str(dg_numbers[index_of_loop])] = {
                "action": action,
                "confidence_in_keeping_dg": numpy.round(prob_predictions[index_of_loop][0], 8) * 100
            }
        return obsoletion_object
