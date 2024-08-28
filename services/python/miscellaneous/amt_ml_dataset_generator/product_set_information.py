"""
This module exists only to simplify retrieving the product set information
"""


class ProductSetInformation:
    """
    This object represent one Product Set Version and all its information
    """

    # pylint: disable=too-many-instance-attributes

    def __init__(self, product_set_version):
        """
        Initialize AssertionTemplate
        It will set a product set information variable to the values passed in
        :param product_set_version:
        """
        self.product_set_version = product_set_version
        self.obsoleted_dgs = []
        self.delivered_dgs = []

        self.rfa_250_results_urls = []
        self.rfa_250_results = {}

        self.aptu_results_urls = []
        self.aptu_results = {}

        self.adu_results_urls = []
        self.adu_results = {}

        self.contains_re_runner_results = False

    def __getitem__(self, key):
        """
        Overrides the default __getitem__ method to return the necessary slot_data key
        :param: slot_key
        :return: slot_data
        """
        return self[key]

    def get_list_of_all_delivered_dgs(self):
        """
        This function returns a list of all the delivered dgs
        :return: delivered_dgs
        """
        delivered_dgs = ','.join([str(delivered_dg) for delivered_dg in self.delivered_dgs])
        return delivered_dgs

    def get_list_of_all_obsoleted_dgs(self):
        """
        This function returns a list of all the obsoleted dgs
        :return: obsoleted_dgs
        """
        obsoleted_dgs = ','.join([str(obsoleted_dg) for obsoleted_dg in self.obsoleted_dgs])
        return obsoleted_dgs

    def __str__(self):
        """
        Overrides the default __str__ method to return the product set information for a given
        product set
        :return:
        """
        delivered_dgs = self.get_list_of_all_delivered_dgs()
        obsoleted_dgs = self.get_list_of_all_obsoleted_dgs()
        return '''{
    'delivered_dgs': [''' + str(delivered_dgs) + '''
    ],
    'obsoleted_dgs': [''' + str(obsoleted_dgs) + '''
    ],
    'rfa_250_results': ''' + str(self.rfa_250_results) + ''',
    'adu_results_urls': ''' + str(self.adu_results_urls) + ''',
    'adu_results': ''' + str(self.adu_results) + ''',
    'aptu_results_urls': ''' + str(self.aptu_results_urls) + ''',
    'aptu_results': ''' + str(self.aptu_results) + ''',
    'rfa_250_results_urls': ''' + str(self.rfa_250_results_urls) + '''
}'''

    def validate_product_sets_information(self):
        """
        This function will validate product sets information
        """
        if len(self.rfa_250_results_urls) == 0:
            print(self.product_set_version + ' has no RFA250 URLs')
        if len(self.aptu_results_urls) == 0:
            print(self.product_set_version + ' has no APTU URLs')
        if len(self.adu_results_urls) == 0:
            print(self.product_set_version + ' has no ADU URLs')
        for delivery_dg in self.delivered_dgs:
            if len(delivery_dg.dg_rpms) == 0:
                print(self.product_set_version + ' has a DG ' + delivery_dg.dg_id + ' without RPMs')
            for rpm in delivery_dg.dg_rpms:
                if 'rpm_name' not in rpm or len(rpm['rpm_name']) == 0:
                    print(self.product_set_version + ' has a DG ' + delivery_dg.dg_id +
                          ' without RPM name')
                elif 'categories' not in rpm or len(rpm['categories']) == 0:
                    print(self.product_set_version + ' has a DG ' + delivery_dg.dg_id +
                          ' without RPM categories')
                elif 'services' not in rpm or len(rpm['services']) == 0:
                    print(self.product_set_version + ' has a DG ' + delivery_dg.dg_id +
                          ' without RPM services')
                elif 'rpm_team' not in rpm or len(rpm['rpm_team']) == 0:
                    print(self.product_set_version + ' has a DG ' + delivery_dg.dg_id +
                          ' without RPM rpm_team')
