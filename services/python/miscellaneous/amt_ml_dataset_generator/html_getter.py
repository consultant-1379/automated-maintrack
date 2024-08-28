"""
This script will use selenium to go to the portal queue and build log to retrieve its HTML
"""

from time import sleep

from bs4 import BeautifulSoup
from selenium import webdriver


def get_browser(url):
    """
    this function opens up firefox browser to a specified url
    :param url:
    :return: browser
    """
    browser = webdriver.Firefox()
    browser.get(url)
    return browser


def get_portal_queue_html(url):
    """
    This will get html of the CI portal queue
    :param url:
    :return: portal_queue_html
    """
    browser = get_browser(url)
    html = browser.page_source.encode('ascii', 'ignore').decode('ascii')
    portal_queue_html = BeautifulSoup(html, 'html.parser')
    loading_body_tag = portal_queue_html.find_all('body', 'loading')
    while len(loading_body_tag) == 1:
        sleep(1)
        html = browser.page_source.encode('ascii', 'ignore').decode('ascii')
        portal_queue_html = BeautifulSoup(html, 'html.parser')
        loading_body_tag = portal_queue_html.find_all('body', 'loading')
    browser.quit()
    return portal_queue_html


def get_build_log_html(url):
    """
    This will get html of the build log
    :param url:
    :return: build_log_html
    """
    browser = get_browser(url)
    browser.find_element_by_id("id_username").send_keys("bbfuncuser")
    browser.find_element_by_id("id_password").send_keys("")
    browser.find_element_by_id("login-submit").click()
    sleep(5)
    html = browser.page_source.encode('ascii', 'ignore').decode('ascii')
    browser.quit()
    build_log_html = BeautifulSoup(html, 'html.parser')
    return build_log_html
