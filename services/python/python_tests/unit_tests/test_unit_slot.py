"""
    Unit testing slot.py
"""

import unittest

from machine_learning.slot import Slot

default_delivered_dgs = '''[
    {
        "createdByTeam":"Dakka",
        "deliveredRpms": [
            {
                "category":"service",
                "version":"1.38.5",
                "name":"ERICflowautomationui_CXP9036274"
            }
        ],
        "deliveryGroupId":"49643",
        "includedCategories":"service",
        "typeOfDelivery":"manual"
    }, {
        "createdByTeam":"Fargo",
        "deliveredRpms": [
            {
                "category":"db",
                "version":"1.67.3",
                "name":"ERICneo4jutilities_CXP9034750"
            }
        ],
        "deliveryGroupId":"49645",
        "includedCategories":"db",
        "typeOfDelivery":
        "manual"
    }, {
        "createdByTeam":"AetosDios",
        "deliveredRpms": [
            {
                "category":"image",
                "version":"2.80.2",
                "name":"ERICrhel6baseimage_CXP9031559"
            }, {
                "category":"image",
                "version":"1.23.2",
                "name":"ERICrhel76lsbimage_CXP9037749"
            }, {
                "category":"image",
                "version":"2.89.4",
                "name":"ERICrhel6jbossimage_CXP9031560"
            }
        ],
        "deliveryGroupId":"49640",
        "includedCategories":"image",
        "typeOfDelivery":"manual"
    }
]
'''

default_product_set_version = "20.16.145"

default_rfa250_url = "https://oss-taf-logs.seli.wh.rnd.internal.ericsson.com/56c75c2f-4450-49d5" \
                     "-9eb3-16ef0cce50c2/ "


def generate_single_slot_as_string(rfa250_url=default_rfa250_url,
                                   delivered_dgs=default_delivered_dgs,
                                   product_set_version=default_product_set_version):
    """
    This will generate a single slot as a string based on the data passed in
    If nothing is passed in for any parameters, defaults will be populated
    This is returning as a string in order to simulate the data passed into the class via the CLI
    :param rfa250_url:
    :param delivered_dgs:
    :param product_set_version:
    :return: default_slot as string
    """
    return '''
        {
            "id":"ckftq49sq000j0hthebis7wu0",
            "physicalEnvironment":"699",
            "cloudEnvironment":"ieatenmc3b09",
            "deliveredDGs": ''' + delivered_dgs + ''',
            "obsoletedDGs": "",
            "slotStatus":"failure",
            "physicalStatus":"success",
            "cloudStatus":"failure",
            "productSetVersion":"''' + product_set_version + '''",
            "slotType":"manual",
            "rfa250Url":"''' + rfa250_url + '''",
            "createdOn":1601732405402,
            "modifiedOn":1601747727114
        }
    '''


class TestSlot(unittest.TestCase):
    """
    This tests the Slot class in slot.py
    """

    def test_slot_generates_successfully(self):
        """
        Tests we are able to successfully generate a slot
        """
        single_valid_slot_as_string = generate_single_slot_as_string()
        valid_slot_as_string = single_valid_slot_as_string
        self.assertTrue(Slot(valid_slot_as_string))

    def test_can_use_getitem_on_generated_slot(self):
        """
        Tests we are able to successfully use __getitem__ on a generated slot
        """
        single_valid_slot_as_string = generate_single_slot_as_string()
        valid_slot_as_string = single_valid_slot_as_string
        succesfully_generated_slot = (Slot(valid_slot_as_string))
        self.assertTrue(succesfully_generated_slot["id"])

    def test_exception_raised_if_invalid_json(self):
        """
        Tests the correct exception is raised if string passed into Slot class in invalid JSON
        """
        single_slot_with_invalid_json_as_string = \
            generate_single_slot_as_string(delivered_dgs="INVALID_JSON: invalid")
        slot_with_invalid_json_as_string = single_slot_with_invalid_json_as_string
        with self.assertRaises(Exception) as thrown_exception:
            Slot(slot_with_invalid_json_as_string)
        self.assertTrue("Data passed into Slot class not valid JSON and so unable to load" in
                        str(thrown_exception.exception))

    def test_exception_raised_if_delivered_dgs_pending(self):
        """
        Tests that correct exception is raised if slot passed into Slot class has deliveredDGs as
        pending
        """
        single_slot_with_invalid_json_as_string = \
            generate_single_slot_as_string(delivered_dgs='"pending"')
        slot_with_pending_dgs_as_string = single_slot_with_invalid_json_as_string
        with self.assertRaises(Exception) as thrown_exception:
            Slot(slot_with_pending_dgs_as_string)
        self.assertTrue("Slot contains pending information and so is considered invalid" in str(
            thrown_exception.exception))

    def test_exception_raised_if_product_set_version_is_pending(self):
        """
        Tests that correct exception is raised if slot passed into Slot class has
        productSetVersion as pending
        """
        single_slot_with_invalid_json_as_string = generate_single_slot_as_string(
            product_set_version="pending")
        slot_with_pending_ps_as_string = single_slot_with_invalid_json_as_string
        with self.assertRaises(Exception) as thrown_exception:
            Slot(slot_with_pending_ps_as_string)
        self.assertTrue("Slot contains pending information and so is considered invalid" in str(
            thrown_exception.exception))

    def test_exception_raised_if_product_set_and_delivered_dgs_pending(self):
        """
        Tests that correct exception is raised if slot passed into Slot class has deliveredDGs
        and productSetVersion as pending
        """
        single_slot_with_invalid_json_as_string = generate_single_slot_as_string(
            product_set_version="pending", delivered_dgs='"pending"')
        slot_with_pending_ps_and_dgs_as_string = single_slot_with_invalid_json_as_string
        with self.assertRaises(Exception) as thrown_exception:
            Slot(slot_with_pending_ps_and_dgs_as_string)
        self.assertTrue("Slot contains pending information and so is considered invalid" in str(
            thrown_exception.exception))

    def test_exception_raised_if_rfa250_url_not_passed_in(self):
        """
        Tests that correct exception is raised if slot passed into Slot class has no rfa250 url
        """
        single_slot_with_invalid_json_as_string = generate_single_slot_as_string(rfa250_url='')
        slot_with_pending_ps_as_string = single_slot_with_invalid_json_as_string
        with self.assertRaises(Exception) as thrown_exception:
            Slot(slot_with_pending_ps_as_string)
        self.assertTrue("Slot does not contain an rfa250Url and so is considered invalid" in str(
            thrown_exception.exception))
