import os
import pandas as pd


class AssertionTemplate(object):
    """
    This class will read in the assertion dataset template, and set variables with the necessary headers and rows of said template
    The assertion template is a CSV file where the first row contains a list of all ENM RPMs and Test suites our model caters for
    In the CSV, the second row contains 0's underneath all RPMs and 1's underneath all test suites
    """
    def __init__(self, path_to_assertion_template):
        """
        Initialize AssertionTemplate
        It will set a variable "csv_headers" to correspond to the first row of the CSV
        It will set a variable "csv_first_row" to correspond to the 0's and 1's mentioned above
        :param: path_to_assertion_template
        """
        assertion_template_data = self.get_template_data(path_to_assertion_template)
        self.csv_headers = assertion_template_data.columns.values.tolist()
        self.csv_first_row = assertion_template_data.iloc[0].values.tolist()

    @staticmethod
    def get_template_data(path_to_assertion_template):
        """
        Reads in an assertion dataset template CSV file based on the path passed in
        :param: path_to_assertion_template
        :return: Pandas data frame object containing information from template CSV file
        """
        template_csv_location = path_to_assertion_template
        try:
            return pd.read_csv(template_csv_location)
        except FileNotFoundError:
            raise Exception('Unable to read assertion template from csv file')
