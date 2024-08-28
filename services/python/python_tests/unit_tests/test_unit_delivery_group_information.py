"""
    Unit testing delivery_group_information.py
"""

# pylint: disable=import-error
# pylint: disable=invalid-name
import unittest

from miscellaneous.amt_ml_dataset_generator.delivery_group_information import \
    DeliveryGroupInformation


class TestDeliveryGroupInformation(unittest.TestCase):
    """
    This tests the DeliveryGroupInformation class in delivery_group_information.py
    """

    def setUp(self):
        """
        Setup for testing
        """
        self.delivery_group_information = DeliveryGroupInformation("3322", [
            {'rpm_name': 'ERICpmic_CXP9030369',
             'rpm_version': '2.22.1',
             'categories': 'service',
             'services': 'pmserv',
             'rpm_team': ['Dynamo', 'Warriors',
                          'Striders']}])

        self.delivery_group_information_with_identical_data = DeliveryGroupInformation("3322", [
            {'rpm_name': 'ERICpmic_CXP9030369',
             'rpm_version': '2.22.1',
             'categories': 'service',
             'services': 'pmserv',
             'rpm_team': ['Dynamo', 'Warriors',
                          'Striders']}])

        self.delivery_group_information_with_different_rpms = DeliveryGroupInformation("3322", [
            {'rpm_name': 'ERICpmic_CXP9550369',
             'rpm_version': '4.32.6',
             'categories': 'service',
             'services': 'pmserv',
             'rpm_team': [
                 'Dynamo',
                 'Warriors',
                 'Striders']}])

        self.delivery_group_information_with_different_ids = DeliveryGroupInformation("2222", [
            {'rpm_name': 'ERICpmic_CXP9030369',
             'rpm_version': '2.22.1',
             'categories': 'service',
             'services': 'pmserv',
             'rpm_team': ['Dynamo', 'Warriors',
                          'Striders']}])

        self.other_delivery_group_information = DeliveryGroupInformation("4333", [
            {'rpm_name': 'ERICpmic_CXP9550369',
             'rpm_version': '4.32.6',
             'categories': 'service',
             'services': 'pmserv',
             'rpm_team': [
                 'Dynamo',
                 'Warriors',
                 'Striders']}])

    def test_delivery_group_information(self):
        """
        This tests all the overrided the default methods for DeliveryGroupInformation
        """
        self.maxDiff = None
        self.assertEqual(str(self.delivery_group_information), str(self.delivery_group_information))
        self.assertNotEqual(str(self.delivery_group_information),
                            str(self.other_delivery_group_information))
        self.assertTrue(self.delivery_group_information ==
                        self.delivery_group_information_with_identical_data)
        self.assertFalse(self.delivery_group_information == self.other_delivery_group_information)
        self.assertFalse(self.delivery_group_information ==
                         self.delivery_group_information_with_different_ids)
        self.assertFalse(self.delivery_group_information ==
                         self.delivery_group_information_with_different_rpms)


if __name__ == '__main__':
    unittest.main()
