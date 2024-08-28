"""
This script will select the correct format of the url and get the JSON
response depending on the url of the allure report
"""

import requests


class AllureUrlParser:  # pylint: disable=too-few-public-methods
    """
    This object will take an allure url and return json response
    """
    def __init__(self, url):
        self.url = url

    def get_allure_api_response(self):
        """
        This function will get allure api response depending on url
        :return allure_api_response: json reponse of the allure report
        """
        if 'gerrit' in self.url:
            allure_api_response = requests.get(self.url)
        else:
            allure_api_response = requests.get(self.url).json()
        return allure_api_response
