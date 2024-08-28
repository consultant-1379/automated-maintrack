"""
This script will create a CSV file with PS information on the specified drops
The CSV file will sit at the root directory of utils
"""
import time
import requests

# pylint: disable=import-error
from miscellaneous.amt_ml_dataset_generator.pickle_actions import \
    retrieve_product_sets_info_from_pickle, generate_new_pickle_for_drop_if_none_exists

from miscellaneous.amt_ml_dataset_generator.pickle_actions import \
    get_product_set_max_range, get_list_of_previous_drops_from_pickles

DG_LIST = []
FEATURES_SECTIONS_IN_ORDER = ['rpm_names', 'rpm_teams', 'rpm_categories', 'rpm_services',
                              'test_cases']
FEATURES = {
    'rpm_names': {},
    'rpm_teams': {},
    'rpm_categories': {},
    'rpm_services': {},
    'test_cases': {}
}
LATEST_DROP_URL = \
    'https://ci-portal.seli.wh.rnd.internal.ericsson.com/dropsInProduct/.json/?products=ENM'
PRODUCT_SET_RANGE_MIN_VALUE = 1
TEST_REPORTS = ['rfa_250', 'aptu', 'adu']
TRAINING_DATASET_CSV_PATH = 'miscellaneous/amt_ml_dataset_generator/training_dataset.csv'


def generate_csv_file_header():
    """
    This function will generate the training dataset csv header
    :return: csv_header
    """
    csv_header = 'PS,DG Number'
    for feature_section in FEATURES_SECTIONS_IN_ORDER:
        for feature_name in FEATURES[feature_section]:
            if FEATURES[feature_section][feature_name]:
                csv_header += ',' + feature_name
    csv_header += ',obsoleted\n'
    return csv_header


def generate_csv_file(dataset_file=None):
    """
    This function will generate the training dataset csv file
    :param dataset_file:
    """
    dataset_file.write(generate_csv_file_header())
    for delivery_group in DG_LIST:
        dg_id = delivery_group[1]
        csv_line = delivery_group[0] + ',' + dg_id
        for feature_section in FEATURES_SECTIONS_IN_ORDER:
            for feature in FEATURES[feature_section]:
                if not FEATURES[feature_section][feature]:
                    continue
                if delivery_group[0] + "," + dg_id in FEATURES[feature_section][feature]:
                    csv_line += ',0' if feature_section == 'test_cases' else ',1'
                else:
                    csv_line += ',1' if feature_section == 'test_cases' else ',0'
        csv_line += ',' + delivery_group[2] + '\n'
        dataset_file.write(csv_line)


def add_test_case_to_features(feature_name, dg_id):
    """
    This function will add failed test cases to the appropriate feature
    :param feature_name:
    :param dg_id:
    """
    if feature_name not in FEATURES['test_cases']:
        FEATURES['test_cases'][feature_name] = [dg_id]
    elif FEATURES['test_cases'][feature_name] is not None:
        # Set to None if more than 1 test case has the same name
        if dg_id in FEATURES['test_cases'][feature_name]:
            FEATURES['test_cases'][feature_name] = None
        else:
            FEATURES['test_cases'][feature_name].append(dg_id)


def add_to_features(product_set, feature_name, feature_section, dg_id):
    """
    This function will add rpm features tp product set information
    :param product_set:
    :param feature_name:
    :param feature_section:
    :param dg_id:
    """
    product_set_and_dg = product_set + "," + dg_id
    if not feature_name:
        print('INVALID FEATURE: ' + str(feature_name))
    else:
        if feature_name not in FEATURES[feature_section]:
            FEATURES[feature_section][feature_name] = [product_set_and_dg]
        elif FEATURES[feature_section][feature_name] is not None and product_set_and_dg not in \
                FEATURES[feature_section][feature_name]:
            FEATURES[feature_section][feature_name].append(product_set_and_dg)


def retrieve_previous_drops():
    """
    This function will get the previous drop
    It will then add that drop to a list of all drops previously generated
    :return: previous_drops
    """
    drop_list = requests.get(LATEST_DROP_URL).json()
    latest_drop = drop_list['Drops'][1].split(':')[1]
    previous_drops = get_list_of_previous_drops_from_pickles()
    if latest_drop not in previous_drops:
        previous_drops.append(latest_drop)
    return previous_drops


def fill_in_dataset_with_content_information(drop):
    """
    This function will fill the training dataset with content information of drop
    Content that is to be added in CSV must be set to True
    All content set to False will not be added
    :param drop:
    """
    add_team = True
    # Set to True for services
    add_service = False
    # Set to True for category
    add_category = False
    add_suite = True
    # Set to True for test cases
    add_test_case = False
    for product_set_range in range(PRODUCT_SET_RANGE_MIN_VALUE, int(get_product_set_max_range(
            drop))):
        product_set = drop + '.' + str(product_set_range)
        product_sets_info = retrieve_product_sets_info_from_pickle(drop, product_set)
        if product_sets_info is None:
            continue
        for delivered_dg in product_sets_info.delivered_dgs:
            obsoleted = '1' if delivered_dg in product_sets_info.obsoleted_dgs else '0'
            DG_LIST.append([product_set, str(delivered_dg.dg_id), obsoleted])
            for rpm in delivered_dg.dg_rpms:
                add_to_features(product_set, rpm['rpm_name'], 'rpm_names',
                                str(delivered_dg.dg_id))
                if add_team:
                    fill_in_dataset_with_teams_information(rpm, product_set, delivered_dg.dg_id)
                if add_service:
                    fill_in_dataset_with_services_information(rpm, product_set, delivered_dg.dg_id)
                if add_category:
                    fill_in_dataset_with_category_information(rpm, product_set, delivered_dg.dg_id)
            if add_suite:
                fill_in_dataset_with_suites_information(product_sets_info, product_set,
                                                        delivered_dg.dg_id)
            if add_test_case:
                fill_in_dataset_with_test_cases_information(product_sets_info, delivered_dg.dg_id)


def fill_in_dataset_with_teams_information(rpm, product_set, dg_id):
    """
    This function will fill the training dataset with teams information
    :param rpm:
    :param product_set:
    :param dg_id:
    """
    for team in rpm['rpm_team']:
        add_to_features(product_set, team, 'rpm_teams', str(dg_id))


def fill_in_dataset_with_services_information(rpm, product_set, dg_id):
    """
    This function will fill the training dataset with services information
    :param rpm:
    :param product_set:
    :param dg_id:
    """
    for service in rpm['services'].split(';'):
        add_to_features(product_set, service, 'rpm_services', str(dg_id))


def fill_in_dataset_with_category_information(rpm, product_set, dg_id):
    """
    This function will fill the training dataset with category information
    :param rpm:
    :param product_set:
    :param dg_id:
    """
    for category in rpm['categories'].split(';'):
        add_to_features(product_set, category, 'rpm_categories', str(dg_id))


def fill_in_dataset_with_suites_information(product_sets_info, product_set, dg_id):
    """
    This function will fill the training dataset with suites information
    :param product_sets_info:
    :param product_set:
    :param dg_id:
    """
    for test_report in TEST_REPORTS:
        test_suite_results = getattr(product_sets_info, test_report + '_results')
        if test_suite_results:
            for suite_name in test_suite_results:
                add_to_features(product_set, suite_name, 'test_cases',
                                str(dg_id))


def fill_in_dataset_with_test_cases_information(product_sets_info, dg_id):
    """
    This function will fill the training dataset with test case information
    :param product_sets_info:
    :param dg_id:
    """
    for test_report in TEST_REPORTS:
        results = getattr(product_sets_info, test_report + '_results')
        for suite_name in results:
            for test_case in results[suite_name]:
                add_test_case_to_features(test_case, str(dg_id))


def generate_dataset():
    """
    This function will generate a dataset for a given drop
    """
    drops = retrieve_previous_drops()
    dataset_file = open(TRAINING_DATASET_CSV_PATH, "w")
    for drop in drops:
        print(drop)
        start = time.time()
        generate_new_pickle_for_drop_if_none_exists(drop)
        fill_in_dataset_with_content_information(drop)
        end = time.time()
        duration = (end - start) / 60
        print('Drop ' + drop + ' took ' + str(duration) + ' minutes to generate dataset')
    generate_csv_file(dataset_file)
    dataset_file.close()


if __name__ == "__main__":
    generate_dataset()
