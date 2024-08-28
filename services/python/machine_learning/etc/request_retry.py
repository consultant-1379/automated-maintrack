"""
This script allows a user to attempt to make a request multiple times if the target host is
temporarily down
"""

import logging
import sys
import time
import requests


# pylint: disable=E1101
# pylint: disable=invalid-name


def request_retry(type_of_request, url, max_retry, body=None, auth_value=None):
    """
    Function to retry requests if the target host is not found. Geometric retry is used here.
    :param type_of_request: Which REST request is being conducted
    :param url: URL you want to run your request against
    :param max_retry: Amount of times to retry the request
    :param body: The payload which will be sent in the request body
    :param auth_value: Authentication values for the specified request
    :return: Request response
    """
    count = 0
    response = None
    valid_response_codes = [requests.codes.ok, requests.codes.created]
    logging.debug('type_of_request: %s', str(type_of_request))
    logging.debug('url: %s', str(url))
    while count < max_retry:
        logging.debug('Trying request')
        try:
            if type_of_request == "POST":
                logging.debug('Doing a POST request')
                response = requests.post(url, json=body, timeout=20)
            else:
                logging.error('Unsupported type of request %s', type_of_request)
                sys.exit(1)
            if response is not None:
                if response.status_code in valid_response_codes:
                    break
            raise requests.exceptions.RequestException
        except requests.exceptions.RequestException as RequestException:
            if response is None:
                logging.error('Got no response object back! Failed to make request.')
            else:
                logging.debug('Response status code: %s', response.status_code)
                logging.debug('Response reason: %s', response.reason)
                logging.debug('Response output: %s', response.text)
                if response.status_code != requests.codes.not_found:
                    logging.error('Request failed. Received response code: %s',
                                  response.status_code)
            count += 1
            if count == max_retry:
                logging.error("Failed to reach target host to execute request after %s tries. "
                              "Failing...", max_retry)
                raise RequestException
            logging.warn("Failed to reach target host to execute request. "
                         "Sleeping and then trying again...")
            time.sleep(2 ** count)
    return response
