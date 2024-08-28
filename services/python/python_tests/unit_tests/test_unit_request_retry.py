"""
Unit Tests for request_retry.py
"""
import json
import unittest
import requests
from unittest.mock import patch

# pylint: disable=import-error
from machine_learning.etc.request_retry import request_retry

MOCK_POST_REQUEST_RESPONSE = 'requests.post'


class MockResponse(object):
    """
    A mock of the object response from a request
    """
    # pylint: disable=too-few-public-methods
    def __init__(self, json_data, status_code, reason='', text=''):
        self.json_data = json_data
        self.status_code = status_code
        self.reason = reason
        self.text = text

    def json(self):
        """
        Coverts the data into json format
        """
        return json.loads(self.json_data)


class TestRequestRetry(unittest.TestCase):
    """
    Unit tests for request retry
    """

    @patch(MOCK_POST_REQUEST_RESPONSE)
    def test_request_retry(self, mock_post_request_response):
        """
        Tests that we get the expected response to a request and that we raise exceptions when
        trying to make an invalid request
        :param mock_post_request_response:
        """
        mock_post_request_response.return_value = MockResponse('', 201)
        post_response = request_retry('POST', 'my_imaginary_url', 1, '{}')
        self.assertEqual(post_response, mock_post_request_response.return_value)
        mock_post_request_response.return_value = MockResponse('', 500)
        self.assertRaises(requests.exceptions.RequestException, request_retry,
                          'POST', 'my_imaginary_url', 1)
        self.assertRaises(SystemExit, request_retry,
                          'INVALID_METHOD', 'my_imaginary_url', 1)
