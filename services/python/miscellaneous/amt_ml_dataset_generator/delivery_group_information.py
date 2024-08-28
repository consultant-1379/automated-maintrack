"""
This module exists only to simplify the delivery group information
"""


class DeliveryGroupInformation:
    """
    This class represent one delivery group and all its information
    """

    def __init__(self, dg_id, dg_rpms):
        """
       Initialize DeliveryGroupInformation
       It will set a variable "dg_id" to the dg id value passed in
       It will set a variable "dg_rpms" to the dg rpms passed in
       :param: dg_id, dg_rpms
       """
        self.dg_id = dg_id
        self.dg_rpms = dg_rpms

    def __str__(self):
        """
        Overrides the default __str__ method to return the delivery group
        information of a delivery group
        :return: dg information strings
        """
        return '''
        {
            'dg_id': ''' + str(self.dg_id) + ''',
            'dg_rpms': ''' + str(self.dg_rpms) + '''
        }'''

    def __eq__(self, other):
        """
        Overrides the default __eq__ method to return true when both dg_id and dg_rpms are equal.
        :param other:
        :return: true or false
        """
        if not isinstance(other, DeliveryGroupInformation):
            return NotImplemented

        return self.dg_id == other.dg_id and self.dg_rpms == other.dg_rpms
