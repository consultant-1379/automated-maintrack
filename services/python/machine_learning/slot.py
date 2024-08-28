import json
import logging

logging.getLogger().setLevel(logging.INFO)


class Slot(object):
    """
    This class is used to validate the information of the slot passed in
    """

    def __init__(self, slot_data_from_amt):
        """
        Initialize Slot
        :param: slot_data_from_amt
        """
        self.slot_data_from_amt_as_string = slot_data_from_amt
        self.slot_data_as_json = self.convert_slot_data_to_json()
        self.determine_if_slot_contains_pending_data()
        self.determine_if_slot_contains_an_rfa250_url()

    def __getitem__(self, slot_key):
        """
        Overrides the default __getitem__ method to return the necessary slot_data key
        :param: slot_key
        :return: slot_data
        """
        return self.slot_data_as_json[slot_key]

    def convert_slot_data_to_json(self):
        """
        This converts the slot_data string passed in to a JSON object
        This must be done, as you can not pass an object into a python script
        :return: slot_data
        """
        try:
            return json.loads(self.slot_data_from_amt_as_string)
        except json.decoder.JSONDecodeError:
            raise Exception('Data passed into Slot class not valid JSON and so unable to load')

    def determine_if_slot_contains_pending_data(self):
        """
        This verifies the slot passed in does not contain pending data
        """
        if self.slot_data_as_json["deliveredDGs"] == "pending" or self.slot_data_as_json["productSetVersion"] == "pending":
            raise Exception('Slot contains pending information and so is considered invalid')

    def determine_if_slot_contains_an_rfa250_url(self):
        """
        This verifies the slot passed in contains an rfa250Url
        """
        if not self.slot_data_as_json["rfa250Url"]:
            raise Exception('Slot does not contain an rfa250Url and so is considered invalid')
