"""
This script provides a CLI into generating ML results.
"""
import argparse
import sys
import logging
import json

# pylint: disable=import-error
from machine_learning.assertion_template import AssertionTemplate
from machine_learning.obsoletion_predictor import ObsoletionPredictor
from machine_learning.slot import Slot
from machine_learning.test_case_parser import TestCaseParser
from machine_learning.etc.request_retry import request_retry

logging.getLogger().setLevel(logging.INFO)

LOCATION_OF_ASSERTION_DATASET = "/usr/src/app/machine_learning/assertion_dataset_template.csv"
LOCATION_OF_MODEL_PICKLE = "/usr/src/app/machine_learning/model.pickle"
NON_OBSOLETION_CONFIDENCE_THRESHOLD = 0.973
ELASTIC_SEARCH_PYTHON_LOGS_URL = "http://atvts2665.athtem.eei.ericsson.se:9200/pythonlogs/1"


def parse_args():
    """
    :return parser.parse_args():
    This function parses the passed in system arguments.
    """
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description='''
    Description:
    This script is used to return ML results for the specified slot.
    ''',
        epilog='''
    Examples:
      -> ''' + sys.argv[0] + ''' -s '[{"id":"ckftq49sq000j0hthebis7wu0","physicalEnvironment":
      "699","cloudEnvironment":"ieatenmc3b09","deliveredDGs":[{"createdByTeam":"Dakka",
      "deliveredRpms":[{"category":"service","version":"1.38.5","name":
      "ERICflowautomationui_CXP9036274"}],"deliveryGroupId":"49643","includedCategories":"service",
      "typeOfDelivery":"manual"},{"createdByTeam":"Fargo","deliveredRpms":[{"category":"db",
      "version":"1.67.3","name":"ERICneo4jutilities_CXP9034750"}],"deliveryGroupId":"49645",
      "includedCategories":"db","typeOfDelivery":"manual"},{"createdByTeam":"AetosDios",
      "deliveredRpms":[{"category":"image","version":"2.80.2","name":
      "ERICrhel6baseimage_CXP9031559"},{"category":"image","version":"1.23.2","name":
      "ERICrhel76lsbimage_CXP9037749"},{"category":"image","version":"2.89.4","name":
      "ERICrhel6jbossimage_CXP9031560"},{"category":"image","version":"1.8.6","name":
      "ERICrhel76jbossimage_CXP9037448"}],"deliveryGroupId":"49640","includedCategories":"image",
      "typeOfDelivery":"manual"},{"createdByTeam":"Ajeya","deliveredRpms":[{"category":"service",
      "version":"1.85.4","name":"ERICcellprovservice_CXP9033022"},{"category":"service","version":
      "1.90.2","name":"ERICcellmanagementgui_CXP9034319"}],"deliveryGroupId":"49626",
      "includedCategories":"service","typeOfDelivery":"manual"}],"obsoletedDGs":"","slotStatus":
      "failure","physicalStatus":"success","cloudStatus":"failure","productSetVersion":"20.15.73",
      "slotType":"manual","rfa250Url":
      "https://oss-taf-logs.seli.wh.rnd.internal.ericsson.com/56c75c2f-4450-49d5-9eb3-16e
      f0cce50c2/","createdOn":1601732405402,"modifiedOn":1601747727114}]'
      -ki '["FM", "CMSYNC"]' -env 'PROD'
    '''
    )
    parser.add_argument("-v", "--verbose",
                        help="increase output verbosity", action="store_true")
    parser.add_argument("-s", "--slot_data",
                        help="Data of slot to perform ML operations on", required=True)
    parser.add_argument("-ki", "--known_issues",
                        help="List of known issues used to perform ML operations", required=True)
    parser.add_argument("-e", "--environment",
                        help="Environment field is used for posting AMT logs to Elastic Search",
                        required=True)
    if not sys.argv[1:]:
        logging.error("No arguments passed in")
        parser.print_help()
        sys.exit(1)
    return parser.parse_args()


def retrieve_indices_of_delivered_rpms(slot_data, headers):
    """
    This retrieves the indices of the template data at which the delivered RPMs are present
    on a per DG basis. It will return a list of indices per DG
    The data returned will look something like [[342, 532, 1123], [122], [64,789]]
    :param slot_data:
    :param headers:
    :return: list_of_indices_of_delivered_rpms
    """
    list_of_indices_of_delivered_rpms = []
    for delivered_dg in slot_data["deliveredDGs"]:
        indices_of_delivered_rpms = []
        for delivered_rpm in delivered_dg["deliveredRpms"]:
            try:
                indices_of_delivered_rpms.append(headers.index(delivered_rpm["name"]))
            except ValueError:
                print('{0} is not currently in ML template. Please add to'
                      'improve obsoletion predictions'.format(delivered_rpm["name"]))
        list_of_indices_of_delivered_rpms.append(indices_of_delivered_rpms)
    return list_of_indices_of_delivered_rpms


def return_data_frame_list_based_on_delivered_rpms(indices_of_delivered_rpms,
                                                   first_row_of_assertion_template, slot):
    """
    This returns the data_frame_list_containing changes based on the indicies of delivered RPMs
    Based the first row of the dataset template, it will update the default "0's" for delivered
    RPM's to "1's" where applicable
    :param indices_of_delivered_rpms:
    :param first_row_of_assertion_template:
    :param slot:
    :return: data_frame_list
    """
    data_frame_list = []
    for loop_index, index_of_delivered_rpm in enumerate(indices_of_delivered_rpms):
        modified_first_row_of_template = first_row_of_assertion_template[:]
        modified_first_row_of_template[0] = slot["productSetVersion"]
        modified_first_row_of_template[1] = slot['deliveredDGs'][loop_index]['deliveryGroupId']

        for delivered_rpm in index_of_delivered_rpm:
            modified_first_row_of_template[delivered_rpm] = 1
        data_frame_list.append(modified_first_row_of_template)

    return data_frame_list


def return_indices_of_failed_suites(list_of_failed_suites, column_headers,
                                    known_issues):
    """
    This retrieves the indices of the template data at which the failed suites are present
    It will return a list of indices
    The data returned will look something like [[1127, 1133, 1146]]
    :param list_of_failed_suites:
    :param column_headers:
    :param known_issues:
    :return: indices_of_failed_suites
    :return: failed_suites_in_known_issues
    """
    indices_of_failed_suites = []
    failed_suites_in_known_issues = []
    for failed_suite in list_of_failed_suites:
        if failed_suite in column_headers and failed_suite not in known_issues:
            index_of_failed_suite = column_headers.index(failed_suite)
            indices_of_failed_suites.append(index_of_failed_suite)
        elif failed_suite in known_issues:
            failed_suites_in_known_issues.append(failed_suite)
    return indices_of_failed_suites, failed_suites_in_known_issues


def return_data_frame_list_based_on_failed_suites(delivery_group_data_frame_list,
                                                  indices_of_failed_suites):
    """
    This returns the data_frame_list_containing changes based on the indicies of
    delivered RPMs and failed suites. Along with the previous manipulation made based
    on delivered RPM's this function will also modify the data_frame_list
    This will update the default "1's" of failed suites to "0's" where applicable
    :param delivery_group_data_frame_list:
    :param indices_of_failed_suites:
    :return: data_frame_list
    """
    data_frame_list = []
    for delivery_group_data_frame in delivery_group_data_frame_list:
        for index_of_failed_suites in indices_of_failed_suites:
            delivery_group_data_frame[index_of_failed_suites] = 0
        data_frame_list.append(delivery_group_data_frame)
    return data_frame_list


def convert_data_to_json(data):
    """
    This converts the data string passed in to a JSON object
    :param data:
    :return: json.loads(data)
    """
    try:
        return json.loads(data)
    except json.decoder.JSONDecodeError:
        raise Exception('Data passed is not valid JSON and so unable to load')


def post_known_issues_to_elastic_search(all_failed_suites_in_known_issues, product_set_version,
                                        environment):
    """
    This posts known issues logs to elastic search
    :param all_failed_suites_in_known_issues:
    :param product_set_version:
    :param environment:
    """
    data_to_log = {
        "failed_suites_in_known_issues": all_failed_suites_in_known_issues,
        "product_set_version": product_set_version,
        "environment": environment
    }
    response = request_retry("POST", ELASTIC_SEARCH_PYTHON_LOGS_URL, 5, data_to_log)
    logging.debug(response.status_code)


def execute_functions(args):
    """
    Executes the functions in the script.
    :param args:
    """
    slot = Slot(args.slot_data)
    known_issues = convert_data_to_json(args.known_issues)
    environment = args.environment
    assertion_template_data = AssertionTemplate(LOCATION_OF_ASSERTION_DATASET)
    indices_of_delivered_rpms = retrieve_indices_of_delivered_rpms(
        slot, assertion_template_data.csv_headers)
    data_frame_list_based_on_delivered_rpms = return_data_frame_list_based_on_delivered_rpms(
        indices_of_delivered_rpms, assertion_template_data.csv_first_row, slot)

    failed_rfa_250_test_cases = TestCaseParser(slot["rfa250Url"]
                                               ).retrieve_failed_allure_suites_information()
    failed_adu_test_cases = TestCaseParser(slot["aduUrl"]
                                           ).retrieve_failed_adu_information()
    failed_aptu_test_cases = TestCaseParser(slot["aptuUrl"]
                                            ).retrieve_failed_aptu_suites_information()

    failed_test_cases_types = [failed_adu_test_cases, failed_aptu_test_cases,
                               failed_rfa_250_test_cases]

    all_failed_suites_in_known_issues = []
    for failed_test_case_type in failed_test_cases_types:
        indices_of_failed_suites, failed_suites_in_known_issues = return_indices_of_failed_suites(
            failed_test_case_type, assertion_template_data.csv_headers, known_issues)
        all_failed_suites_in_known_issues += failed_suites_in_known_issues
        data_frame_list_based_on_delivered_rpms_and_failed_suites = \
            return_data_frame_list_based_on_failed_suites(data_frame_list_based_on_delivered_rpms,
                                                          indices_of_failed_suites)
    if environment in ["PROD", "STAG"] and len(all_failed_suites_in_known_issues) > 0:
        post_known_issues_to_elastic_search(all_failed_suites_in_known_issues,
                                            slot["productSetVersion"], environment)
    ml_predictions = ObsoletionPredictor(LOCATION_OF_MODEL_PICKLE,
                                         data_frame_list_based_on_delivered_rpms_and_failed_suites,
                                         assertion_template_data,
                                         NON_OBSOLETION_CONFIDENCE_THRESHOLD)
    print("AMT_PREDICTIONS_DELIMITER", ml_predictions.obsoletion_object,
          "AMT_PREDICTIONS_DELIMITER")


if __name__ == "__main__":
    execute_functions(parse_args())
