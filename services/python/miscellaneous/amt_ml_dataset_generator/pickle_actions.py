"""
This module exists only to simplify working with pickles
"""

# pylint: disable=import-error
import os
import pickle
import requests

from miscellaneous.amt_ml_dataset_generator.build_log_scraper import BuildLogParser
from miscellaneous.amt_ml_dataset_generator.test_case_parser import TestCaseParser

PRODUCT_SET_VERSIONS_URL = \
    'https://ci-portal.seli.wh.rnd.internal.ericsson.com/api/productSet/ENM/drop/'
PRODUCT_SET_RANGE_MIN_VALUE = 1
PICKLES_LOCATION = 'miscellaneous/amt_ml_dataset_generator/ml_pickles/'
TEST_REPORTS = ['rfa_250', 'aptu', 'adu']


def retrieve_product_sets_info_from_pickle(drop, product_set):
    """
    This function will retreive product set information from a pickle for a given product set
    :param drop:
    :param product_set:
    :return: product_sets_info
    """
    ps_pickle_path = PICKLES_LOCATION + drop + '/' + product_set + '.p'
    if os.path.exists(ps_pickle_path):
        pickle_file = open(ps_pickle_path, 'rb')
        product_sets_info = pickle.load(pickle_file)
        pickle_file.close()
        return product_sets_info
    return None


def add_test_results_information_to_product_sets_information(product_sets_info, drop):
    """
    This function will gather all the product set information for a given product set and store it
    in a pickle
    :param product_sets_info:
    :param drop:
    """
    for product_set_range in range(PRODUCT_SET_RANGE_MIN_VALUE, int(get_product_set_max_range(
            drop))):
        missing_test_results = True
        product_set = drop + '.' + str(product_set_range)
        if product_set in product_sets_info:
            if product_sets_info[product_set].rfa_250_results_urls and \
                    product_sets_info[product_set].aptu_results_urls and \
                    product_sets_info[product_set].adu_results_urls:
                for test_report in TEST_REPORTS:
                    test_report_urls = getattr(product_sets_info[product_set],
                                               test_report + '_results_urls')
                    test_case_parser = TestCaseParser(test_report_urls[0])
                    if test_report == 'aptu':
                        setattr(product_sets_info[product_set], test_report + '_results',
                                test_case_parser.retrieve_failed_aptu_suites_information())
                    elif test_report == 'adu':
                        setattr(product_sets_info[product_set], test_report + '_results',
                                test_case_parser.retrieve_failed_adu_information())
                    else:
                        setattr(product_sets_info[product_set], test_report + '_results',
                                test_case_parser.retrieve_failed_allure_suites_information())
                    if getattr(product_sets_info[product_set], test_report + '_results'):
                        missing_test_results = False
            if not missing_test_results:
                store_product_set_information_into_pickle(product_sets_info[product_set],
                                                          product_set, drop)


def store_product_set_information_into_pickle(product_set_info, product_set, drop):
    """
    This function will store product set information into a pickle
    :param product_set_info:
    :param product_set:
    :param drop:
    """
    pickle_file = open(PICKLES_LOCATION + drop + '/' + product_set + '.p', 'wb')
    pickle.dump(product_set_info, pickle_file)
    pickle_file.close()


def get_product_set_max_range(drop):
    """
    This function returns the max product set range for a given drop
    :param drop:
    :return: product_set_version_max_range
    """

    product_set_versions_list = requests.get(PRODUCT_SET_VERSIONS_URL + drop +
                                             '/versions/?format=json').json()
    return product_set_versions_list[0]['version'].split('.')[2]


def dump_model_into_pickle(estimator):
    """
    This function dumps the model into a pickle to be used later
    :param estimator: the model to be dumped
    """
    with open('miscellaneous/amt_ml_dataset_generator/model.pickle', 'wb') as pickle_file:
        pickle.dump(estimator, pickle_file, pickle.HIGHEST_PROTOCOL)


def get_list_of_previous_drops_from_pickles():
    """
    This function will return a list of all previous drops that were generated
    :return: previous_drops
    """
    previous_drops = os.listdir(PICKLES_LOCATION)
    return previous_drops


def generate_new_pickle_for_drop_if_none_exists(drop):
    """
    This function will check if a pickle file exists and if it doesn't will create one.
    It will then generate all the needed product_set information
    Then store the data in the newly created pickle
    :param drop:
    """
    if not os.path.exists(PICKLES_LOCATION + drop):
        os.mkdir(PICKLES_LOCATION + drop)
        build_log_scraper = BuildLogParser()
        product_sets_information = build_log_scraper.iterate_over_table_rows(drop)
        add_test_results_information_to_product_sets_information(product_sets_information, drop)
