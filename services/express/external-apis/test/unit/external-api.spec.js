require('../../../config/config');

const nock = require('nock');
const expect = require('expect');
const request = require('superagent');
const { makeExternalApi } = require('../../external-api');

const url = process.env.CIFWK_API;

const useExternalApi = makeExternalApi({ request, url });

const latestDropMockData = {
  Drops: ['ENM:20.04', 'ENM:20.03', 'ENM:20.02', 'ENM:20.01',
    'ENM:19.17', 'ENM:19.16', 'ENM:19.15', 'ENM:19.14',
    'ENM:19.13', 'ENM:19.12', 'ENM:19.11', 'ENM:19.10',
    'ENM:19.09', 'ENM:19.08', 'ENM:19.07', 'ENM:19.06'],
};

const latestGreenProductSetMockData = '20.14.12';

const enmIsoVersionMockData = '1.98.27';

const productSetContentMockData = [{
  artifact: 'ERICenm_CXP9027091', group: 'com.ericsson.oss', version: '1.98.12', isMasterArtifact: 'True',
}, {
  artifact: 'ERICvnflcm_CXP9034858', group: 'com.ericsson.oss.vnflaf.media', version: '5.25.7', isMasterArtifact: 'False',
}, {
  artifact: 'ERIClitp_CXP9024296', group: 'com.ericsson.nms.litp', version: '2.119.9', isMasterArtifact: 'False',
}, {
  artifact: 'ERICautodeploy_CXP9038326', group: 'com.ericsson.oss.itpf.autodeploy', version: '1.6.4', isMasterArtifact: 'False',
}, {
  artifact: 'ERICenmagat_CXP9036311', group: 'com.ericsson.oss.agat_iso', version: '1.95.2', isMasterArtifact: 'False',
}, {
  artifact: 'ERICvms_CXP9035350', group: 'com.ericsson.oss.images', version: '2.2.4', isMasterArtifact: 'False',
}, {
  artifact: 'ERICnorthstar_CXP9037696', group: 'com.ericsson.oss.itpf.northstar', version: '2.0.1', isMasterArtifact: 'False',
}, {
  artifact: 'ERICfwupgrade_CXP9036881', group: 'com.ericsson.oss.itpf.deployment', version: '1.10.1', isMasterArtifact: 'False',
}, {
  artifact: 'ERICnasconfig_CXP9033343', group: 'com.ericsson.oss.itpf.nas', version: '1.37.2', isMasterArtifact: 'False',
}, {
  artifact: 'ERICsanmigration_CXP9037763', group: 'com.ericsson.oss.itpf.deployment', version: '1.3.3', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL76_OS_Patch_Set_CXP9037739', group: 'com.ericsson.nms.litp', version: '1.9.1', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL_OS_Patch_Set_CXP9034997', group: 'com.ericsson.nms.litp', version: '2.12.1', isMasterArtifact: 'False',
}, {
  artifact: 'ERICtafte_CXP9033012', group: 'com.ericsson.cifwk.taf', version: '2.41.2', isMasterArtifact: 'False',
}, {
  artifact: 'nas-rhel7-os-patch-set_CXP9036738', group: 'com.ericsson.oss.itpf.nas', version: '2.0.1', isMasterArtifact: 'False',
}, {
  artifact: 'EXTRvmwareguesttools_CXP9035510', group: 'com.ericsson.oss.itpf.senm', version: '2.0.2', isMasterArtifact: 'False',
}, {
  artifact: 'ERICsmallenmconfig_CXP9035391', group: 'com.ericsson.oss.itpf.senm', version: '1.38.17', isMasterArtifact: 'False',
}, {
  artifact: 'EXTRvmwareesxi_CXP9035974', group: 'com.ericsson.oss.itpf.3pp', version: '3.0.1', isMasterArtifact: 'False',
}, {
  artifact: 'ERICvmwarepatches_CXP9035795', group: 'com.ericsson.oss.itpf.senm', version: '1.17.5', isMasterArtifact: 'False',
}, {
  artifact: 'EXTRvmwarevcenter_CXP9035456', group: 'com.ericsson.oss.itpf.3pp', version: '3.0.1', isMasterArtifact: 'False',
}, {
  artifact: 'NAS7.4-Media_CXP9036773', group: 'com.ericsson.oss.itpf.nas', version: '1.1.1', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL7_OS_Patch_Set_CXP9035024', group: 'com.ericsson.nms.litp', version: '1.10.1', isMasterArtifact: 'False',
}, {
  artifact: 'EXTRvmwarevio_CXP9035975', group: 'com.ericsson.oss.itpf.3pp', version: '2.0.1', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL76-MEDIA_CXP9037123', group: 'com.ericsson.nms.litp', version: '1.0.1', isMasterArtifact: 'False',
}, {
  artifact: 'nas-rhel-os-patch-set_CXP9033713', group: 'com.ericsson.oss.itpf.nas', version: '1.3.4', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL74-Media_CXP9035111', group: 'com.ericsson.nms.litp', version: '1.0.2', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL6.10_Media_CXP9036772', group: 'com.ericsson.nms.litp', version: '1.0.1', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL7_OS_Patch_Set_CXP9029082', group: 'com.ericsson.nms.litp', version: '1.2.2', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL_OS_Patch_Set_CXP9026826', group: 'com.ericsson.nms.litp', version: '1.28.1', isMasterArtifact: 'False',
}, {
  artifact: 'ERICsfsconfig_CXP9025837', group: 'com.ericsson.oss.itpf.nas', version: '5.6.1', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL7-Media-CXP9029081', group: 'com.ericsson.nms.litp', version: '1.0.2', isMasterArtifact: 'False',
}, {
  artifact: 'NAS_Media_CXP9033682', group: 'com.ericsson.oss.itpf.nas', version: '1.3.1', isMasterArtifact: 'False',
}, {
  artifact: 'SFShf1Patch_CXP9018118', group: 'com.ericsson.oss.itpf.nas', version: '1.0.1', isMasterArtifact: 'False',
}, {
  artifact: 'SFS_Media_CXP9025244', group: 'com.ericsson.oss.itpf.nas', version: '1.3.1', isMasterArtifact: 'False',
}, {
  artifact: 'RHEL_Media_CXP9026759', group: 'com.ericsson.nms.litp', version: '1.3.1', isMasterArtifact: 'False',
}];

const enmContentMockData = {
  TestwareISOVersion: '',
  TestwareISOName: '',
  ISOName: 'ERICenm_CXP9027091',
  ISOGroupID: 'com.ericsson.oss',
  ISOVersion: '1.98.12',
  TestwareGroupID: '',
  PackagesInISO: [{
    'size (MB)': 92644, mediaPath: 'None', number: 'postgresql-plpython', kgb: 'not_started', testReport: '', mediaCategory: 'db', group: 'com.redhat.rhel6.postgresql92', name: 'postgresql-plpython', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-plpython/9.2.7-1.1/postgresql-plpython-9.2.7-1.1.rpm', platform: 'none', version: '9.2.7-1.1', kgbSnapshotReport: false, deliveryDrop: '15.4', type: 'rpm',
  }, {
    'size (MB)': 81924, mediaPath: 'None', number: 'postgresql-plperl', kgb: 'not_started', testReport: '', mediaCategory: 'db', group: 'com.redhat.rhel6.postgresql92', name: 'postgresql-plperl', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-plperl/9.2.7-1.1/postgresql-plperl-9.2.7-1.1.rpm', platform: 'none', version: '9.2.7-1.1', kgbSnapshotReport: false, deliveryDrop: '15.4', type: 'rpm',
  }, {
    'size (MB)': 9052136, mediaPath: 'None', number: 'postgresql-docs', kgb: 'not_started', testReport: '', mediaCategory: 'db', group: 'com.redhat.rhel6.postgresql92', name: 'postgresql-docs', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-docs/9.2.7-1.1/postgresql-docs-9.2.7-1.1.rpm', platform: 'none', version: '9.2.7-1.1', kgbSnapshotReport: false, deliveryDrop: '15.4', type: 'rpm',
  }, {
    'size (MB)': 962200, mediaPath: 'None', number: 'postgresql-devel', kgb: 'not_started', testReport: '', mediaCategory: 'db', group: 'com.redhat.rhel6.postgresql92', name: 'postgresql-devel', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-devel/9.2.7-1.1/postgresql-devel-9.2.7-1.1.rpm', platform: 'none', version: '9.2.7-1.1', kgbSnapshotReport: false, deliveryDrop: '15.4', type: 'rpm',
  }, {
    'size (MB)': 462704, mediaPath: 'None', number: 'postgresql-contrib', kgb: 'not_started', testReport: '', mediaCategory: 'db', group: 'com.redhat.rhel6.postgresql92', name: 'postgresql-contrib', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-contrib/9.2.7-1.1/postgresql-contrib-9.2.7-1.1.rpm', platform: 'none', version: '9.2.7-1.1', kgbSnapshotReport: false, deliveryDrop: '15.4', type: 'rpm',
  }, {
    'size (MB)': 6572, mediaPath: 'None', number: 'CXP9031007', kgb: 'not_started', testReport: '', mediaCategory: 'sw', group: 'com.ericsson.oss.itpf.security.sso', name: 'ERICssologger_CXP9031007', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/ericsson/oss/itpf/security/sso/ERICssologger_CXP9031007/1.1.2/ERICssologger_CXP9031007-1.1.2.rpm', platform: 'None', version: '1.1.2', kgbSnapshotReport: false, deliveryDrop: '15.4', type: 'rpm',
  }, {
    'size (MB)': 4947396, mediaPath: 'None', number: 'CXP9023099', kgb: 'not_started', testReport: '', mediaCategory: 'sw', group: 'com.ericsson.nms.services', name: 'ERICsecuritysvc_CXP9023099', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/ericsson/nms/services/ERICsecuritysvc_CXP9023099/1.8.56/ERICsecuritysvc_CXP9023099-1.8.56.rpm', platform: 'None', version: '1.8.56', kgbSnapshotReport: false, deliveryDrop: '15.4', type: 'rpm',
  }],
};

const expectedEnmContentdata = [{
  deliveryDrop: '15.4', group: 'com.redhat.rhel6.postgresql92', kgb: 'not_started', kgbSnapshotReport: false, mediaCategory: 'db', mediaPath: 'None', name: 'postgresql-plpython', number: 'postgresql-plpython', platform: 'none', 'size (MB)': 92644, testReport: '', type: 'rpm', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-plpython/9.2.7-1.1/postgresql-plpython-9.2.7-1.1.rpm', version: '9.2.7-1.1',
}, {
  deliveryDrop: '15.4', group: 'com.redhat.rhel6.postgresql92', kgb: 'not_started', kgbSnapshotReport: false, mediaCategory: 'db', mediaPath: 'None', name: 'postgresql-plperl', number: 'postgresql-plperl', platform: 'none', 'size (MB)': 81924, testReport: '', type: 'rpm', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-plperl/9.2.7-1.1/postgresql-plperl-9.2.7-1.1.rpm', version: '9.2.7-1.1',
}, {
  deliveryDrop: '15.4', group: 'com.redhat.rhel6.postgresql92', kgb: 'not_started', kgbSnapshotReport: false, mediaCategory: 'db', mediaPath: 'None', name: 'postgresql-docs', number: 'postgresql-docs', platform: 'none', 'size (MB)': 9052136, testReport: '', type: 'rpm', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-docs/9.2.7-1.1/postgresql-docs-9.2.7-1.1.rpm', version: '9.2.7-1.1',
}, {
  deliveryDrop: '15.4', group: 'com.redhat.rhel6.postgresql92', kgb: 'not_started', kgbSnapshotReport: false, mediaCategory: 'db', mediaPath: 'None', name: 'postgresql-devel', number: 'postgresql-devel', platform: 'none', 'size (MB)': 962200, testReport: '', type: 'rpm', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-devel/9.2.7-1.1/postgresql-devel-9.2.7-1.1.rpm', version: '9.2.7-1.1',
}, {
  deliveryDrop: '15.4', group: 'com.redhat.rhel6.postgresql92', kgb: 'not_started', kgbSnapshotReport: false, mediaCategory: 'db', mediaPath: 'None', name: 'postgresql-contrib', number: 'postgresql-contrib', platform: 'none', 'size (MB)': 462704, testReport: '', type: 'rpm', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/redhat/rhel6/postgresql92/postgresql-contrib/9.2.7-1.1/postgresql-contrib-9.2.7-1.1.rpm', version: '9.2.7-1.1',
}, {
  deliveryDrop: '15.4', group: 'com.ericsson.oss.itpf.security.sso', kgb: 'not_started', kgbSnapshotReport: false, mediaCategory: 'sw', mediaPath: 'None', name: 'ERICssologger_CXP9031007', number: 'CXP9031007', platform: 'None', 'size (MB)': 6572, testReport: '', type: 'rpm', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/ericsson/oss/itpf/security/sso/ERICssologger_CXP9031007/1.1.2/ERICssologger_CXP9031007-1.1.2.rpm', version: '1.1.2',
}, {
  deliveryDrop: '15.4', group: 'com.ericsson.nms.services', kgb: 'not_started', kgbSnapshotReport: false, mediaCategory: 'sw', mediaPath: 'None', name: 'ERICsecuritysvc_CXP9023099', number: 'CXP9023099', platform: 'None', 'size (MB)': 4947396, testReport: '', type: 'rpm', url: 'https://arm901-eiffel004.athtem.eei.ericsson.se:8443/nexus/content/groups/enm_deploy_proxy/com/ericsson/nms/services/ERICsecuritysvc_CXP9023099/1.8.56/ERICsecuritysvc_CXP9023099-1.8.56.rpm', version: '1.8.56',
}];

const deploymentDescriptionMockData = {
  deployment_description_data: {
    ip_range_source: 'dns', version: '1.103.7', name: 'medium__production_dualStack__1aut', auto_update: 'True', sed_deployment: 'medium__production_dualStack_info.txt', auto_deployment: 'medium__production_dualStack_dd.xml', type: 'rpm', capacity_type: 'production', update_type: 'complete',
  },
};

const emptyNameDeploymentDescriptionMockData = {
  deployment_description_data: {
    ip_range_source: 'dns', version: '1.103.7', name: '', auto_update: 'True', sed_deployment: 'medium__production_dualStack_info.txt', auto_deployment: 'medium__production_dualStack_dd.xml', type: 'rpm', capacity_type: 'production', update_type: 'complete',
  },
};


describe('Unit Test: External APIs', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  it('should check if the drops in product ENM api is working', async () => {
    nock(url)
      .get('/dropsInProduct/.json/?products=ENM')
      .reply(200, latestDropMockData);
    const dropList = await useExternalApi.getLatestDrop();
    expect(dropList).toBeDefined();
    expect(dropList).toEqual('20.04');
  });

  it('should check if the latest green product set api is working', async () => {
    nock(url)
      .get('/getLastGoodProductSetVersion/?productSet=ENM')
      .reply(200, latestGreenProductSetMockData);
    const latestGreenProductSetVersion = await useExternalApi.getLatestGreenProductSetVersion();
    expect(latestGreenProductSetVersion).toBeDefined();
    expect(latestGreenProductSetVersion).toEqual('20.14.12');
  });

  it('should throw an error if the latest green product set api is not working', (done) => {
    nock(url)
      .get('/getLastGoodProductSetVersion/?productSet=ENM')
      .replyWithError('Issue getting Last Good Product Set Version: list index out of range');
    useExternalApi.getLatestGreenProductSetVersion().catch((error) => {
      expect(error.message).toBe('Unable to get latest green product set version, Error: Issue getting Last Good Product Set Version: list index out of range');
    })
      .then(done, done);
  });

  it('should check if the latest ENM ISO version api is working', async () => {
    nock(url)
      .get('/getlatestisover/?drop=20.14&product=ENM')
      .reply(200, enmIsoVersionMockData);
    const latestEnmIsoVersion = await useExternalApi.getLatestEnmIsoVersion('20.14');
    expect(latestEnmIsoVersion).toBeDefined();
    expect(latestEnmIsoVersion).toEqual('1.98.27');
  });

  it('should throw an error if the latest ENM ISO verison api is not working', (done) => {
    nock(url)
      .get('/getlatestisover/?drop=20.14&product=ENM')
      .replyWithError('Issue getting latest media artifact from drop: list index out of range');
    useExternalApi.getLatestEnmIsoVersion('20.14').catch((error) => {
      expect(error.message).toBe('Unable to get latest ENM ISO version, Error: Issue getting latest media artifact from drop: list index out of range');
    })
      .then(done, done);
  });

  it('should check if the get product set content api is working', async () => {
    nock(url)
      .get('/api/productSet/ENM/AOM901151/20.14.12/?format=json')
      .reply(200, productSetContentMockData);
    const enmIsoVersion = await useExternalApi.getProductSetContentVersion('ERICenm_CXP9027091', '20.14.12');
    expect(enmIsoVersion).toBeDefined();
    expect(enmIsoVersion).toEqual('1.98.12');

    nock(url)
      .get('/api/productSet/ENM/AOM901151/20.14.12/?format=json')
      .reply(200, productSetContentMockData);
    const vnfLcmVersion = await useExternalApi.getProductSetContentVersion('ERICvnflcm_CXP9034858', '20.14.12');
    expect(vnfLcmVersion).toBeDefined();
    expect(vnfLcmVersion).toEqual('5.25.7');

    nock(url)
      .get('/api/productSet/ENM/AOM901151/20.14.12/?format=json')
      .reply(200, productSetContentMockData);
    const litpVersion = await useExternalApi.getProductSetContentVersion('ERIClitp_CXP9024296', '20.14.12');
    expect(litpVersion).toBeDefined();
    expect(litpVersion).toEqual('2.119.9');
  });

  it('should throw an error if the artifact parameter is empty', (done) => {
    useExternalApi.getProductSetContentVersion('', '20.14.12').catch((error) => {
      expect(error.message).toBe('You must supply an artifact name');
    })
      .then(done, done);
  });

  it('should throw an error if the productSetVersion parameter is empty', (done) => {
    useExternalApi.getProductSetContentVersion('ERICenm_CXP9027091', '').catch((error) => {
      expect(error.message).toBe('You must supply a product set version');
    })
      .then(done, done);
  });

  it('should throw an error if the get product set content api is not working', (done) => {
    nock(url)
      .get('/api/productSet/ENM/AOM901151/20.14.12/?format=json')
      .replyWithError('{"detail":"Not found."}');
    useExternalApi.getProductSetContentVersion('ERIClitp_CXP9024296', '20.14.12').catch((error) => {
      expect(error.message).toBe('Unable to get artifact ERIClitp_CXP9024296 version, Error: {"detail":"Not found."}');
    })
      .then(done, done);
  });

  it('should throw an error if the get product set content api returns an empty list', (done) => {
    nock(url)
      .get('/api/productSet/ENM/AOM901151/20.14.12/?format=json')
      .reply(200, []);
    useExternalApi.getProductSetContentVersion('ERIClitp_CXP9024296', '20.14.12').catch((error) => {
      expect(error.message).toBe('Unable to get artifact ERIClitp_CXP9024296 version, Error: productSetContentversion is empty');
    })
      .then(done, done);
  });

  it('should check if the get artifacts associated with ENM ISO api is working', async () => {
    nock(url)
      .get('/getPackagesInISO/?isoName=ERICenm_CXP9027091&isoVersion=1.98.12&useLocalNexus=true')
      .reply(200, enmContentMockData);
    const enmPackages = await useExternalApi.getPackagesInEnmIso('1.98.12');
    expect(enmPackages).toBeDefined();
    expect(enmPackages).toEqual(expectedEnmContentdata);
  });

  it('should throw an error if the enmIsoVersion parameter is empty', (done) => {
    useExternalApi.getPackagesInEnmIso('').catch((error) => {
      expect(error.message).toBe('You must supply an ENM ISO version when getting packages in an ENM ISO');
    })
      .then(done, done);
  });

  it('should throw an error if the get ENM ISO content api is not working', (done) => {
    nock(url)
      .get('/getPackagesInISO/?isoName=ERICenm_CXP9027091&isoVersion=1.98.12&useLocalNexus=true')
      .replyWithError('{"ERROR": "ERROR: Specified ISO Name and Version do not exist"}');
    useExternalApi.getPackagesInEnmIso('1.98.12').catch((error) => {
      expect(error.message).toBe(
        'Unable to get ENM ISO packages for ENM ISO \'1.98.12\', Error: {"ERROR": "ERROR: Specified ISO Name and Version do not exist"}',
      );
    })
      .then(done, done);
  });

  it('should throw an error if the get ENM ISO content api returns an empty list', (done) => {
    nock(url)
      .get('/getPackagesInISO/?isoName=ERICenm_CXP9027091&isoVersion=1.98.12&useLocalNexus=true')
      .reply(200, []);
    useExternalApi.getPackagesInEnmIso('1.98.12').catch((error) => {
      expect(error.message).toBe('Unable to get ENM ISO packages for ENM ISO \'1.98.12\', Error: No ENM ISO packages found for ENM ISO \'1.98.12\'');
    })
      .then(done, done);
  });

  it('should check if the get artifacts associated with ENM testware ISO api is working', async () => {
    nock(url)
      .get('/api/getProductwareToTestwareMediaMapping/mediaArtifact/ERICenm_CXP9027091/version/1.98.13/?format=json&pretty=true')
      .reply(200, {
        testwareMediaArtifactVersions: ['1.98.11', '1.98.12'],
      });
    nock(url)
      .get('/getPackagesInISO/?isoName=ERICenmtestware_CXP9027746&isoVersion=1.98.12&useLocalNexus=true&showTestware=true')
      .reply(200, enmContentMockData);
    const enmTestwarePackages = await useExternalApi.getPackagesInEnmTestwareIso('1.98.13');
    expect(enmTestwarePackages).toBeDefined();
    expect(enmTestwarePackages).toEqual(expectedEnmContentdata);
  });

  it('should throw an error if the enmIsoVersion parameter is empty', (done) => {
    useExternalApi.getPackagesInEnmTestwareIso('').catch((error) => {
      expect(error.message).toBe('You must supply an ENM ISO version when getting packages in an ENM testware ISO');
    })
      .then(done, done);
  });

  it('should throw an error if the get ENM Testware ISO content api is not working', (done) => {
    nock(url)
      .get('/api/getProductwareToTestwareMediaMapping/mediaArtifact/ERICenm_CXP9027091/version/1.98.13/?format=json&pretty=true')
      .reply(200, {
        testwareMediaArtifactVersions: ['1.98.11', '1.98.12'],
      });
    nock(url)
      .get('/getPackagesInISO/?isoName=ERICenmtestware_CXP9027746&isoVersion=1.98.12&useLocalNexus=true&showTestware=true')
      .replyWithError('{"ERROR": "ERROR: Specified ISO Name and Version do not exist"}');
    useExternalApi.getPackagesInEnmTestwareIso('1.98.13').catch((error) => {
      expect(error.message).toBe(
        'Unable to get ENM Testware ISO packages for Testware ISO \'1.98.12\', Error: {"ERROR": "ERROR: Specified ISO Name and Version do not exist"}',
      );
    })
      .then(done, done);
  });

  it('should throw an error if the get ENM testware ISO content api returns an empty list', (done) => {
    nock(url)
      .get('/api/getProductwareToTestwareMediaMapping/mediaArtifact/ERICenm_CXP9027091/version/1.98.13/?format=json&pretty=true')
      .reply(200, {
        testwareMediaArtifactVersions: ['1.98.11', '1.98.12'],
      });
    nock(url)
      .get('/getPackagesInISO/?isoName=ERICenmtestware_CXP9027746&isoVersion=1.98.12&useLocalNexus=true&showTestware=true')
      .reply(200, []);
    useExternalApi.getPackagesInEnmTestwareIso('1.98.13').catch((error) => {
      expect(error.message).toBe('Unable to get ENM Testware ISO packages for Testware ISO \'1.98.12\', Error: No ENM Testware ISO packages found for Testware ISO \'1.98.12\'');
    })
      .then(done, done);
  });

  it('should check if the delivery groups in the queue api is working', async () => {
    const queuedDeliveryGroupsList = await useExternalApi.getQueuedDeliveryGroups('20.04');
    expect(queuedDeliveryGroupsList).toBeDefined();
    expect(queuedDeliveryGroupsList.length).toBeGreaterThan(0);
    expect(queuedDeliveryGroupsList[queuedDeliveryGroupsList.length - 1].deliveryGroup).toContain('54378');
  });

  it('should deliver a delivery group successfully', async () => {
    const deliveredDeliveryGroupResponse = await useExternalApi.deliverDeliveryGroup('42430');
    expect(deliveredDeliveryGroupResponse.statusCode).toBe(200);
    expect(deliveredDeliveryGroupResponse.body.response).toBe('DEV: Delivery Group 42430 has been delivered');
  });

  it('should retrieve a deployment description successfully', async () => {
    nock(url)
      .get('/api/deployment/deploymentDescription/339/')
      .reply(200, deploymentDescriptionMockData);
    const deploymentDescription = await useExternalApi.getDeploymentDescription('339');
    expect(deploymentDescription).toBe('medium__production_dualStack__1aut');
  });

  it('should retrieve a deployment description but with no name', (done) => {
    nock(url)
      .get('/api/deployment/deploymentDescription/295/')
      .reply(200, emptyNameDeploymentDescriptionMockData);
    useExternalApi.getDeploymentDescription('295').catch((error) => {
      expect(error.message).toBe('Unable to get deployment description, Error: No deployment description name found for 295');
    })
      .then(done, done);
  });

  it('should not retrieve a deployment description successfully', (done) => {
    nock(url)
      .get('/api/deployment/deploymentDescription/1234/')
      .replyWithError('Not Found');
    useExternalApi.getDeploymentDescription('1234').catch((error) => {
      expect(error.message).toBe('Unable to get deployment description, Error: Not Found');
    })
      .then(done, done);
  });
});
