const expect = require('expect');

const { filterDuplicateTeams } = require('../../use-cases');

const ALL_DELIVERY_GROUPS_21_04 = [
  {
    autoCreated: 'False',
    parentElement: 'Transport',
    creator: 'sai.spallekonda@tcs.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICminilinkoutdoorpmhandlerscode_CXP9035613',
        dateCreated: '2021-03-04 10:41:13',
        version: '1.38.1',
        vmServices: [
          'mspmip',
        ],
        groupId: 'com.ericsson.oss.mediation.pm.handlers',
      },
      {
        category: 'model',
        artifact: 'ERICminilinkindoorpmflows_CXP9033752',
        dateCreated: '2021-03-04 14:32:01',
        version: '1.80.2',
        vmServices: [],
        groupId: 'com.ericsson.oss.mediation.pm.flow',
      },
      {
        category: 'service',
        artifact: 'ERICminilinkindoorpmhandlers_CXP9033753',
        dateCreated: '2021-03-04 14:32:13',
        version: '1.80.2',
        vmServices: [
          'mspmip',
        ],
        groupId: 'com.ericsson.oss.mediation.pm.flow',
      },
    ],
    bugOrTR: 'True',
    component: '328',
    missingDependencies: 'False',
    createdByTeam: 'Raptors',
    deliveryGroup: '55967',
    modifiedDate: '2021-03-05 05:05:48',
    createdDate: '2021-03-05 05:05:48',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'CloudNative',
    creator: 'cian.prendergast@ericsson.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICkpiservice_CXP9032442',
        dateCreated: '2021-03-03 23:37:43',
        version: '1.55.1',
        vmServices: [
          'kpiserv',
        ],
        groupId: 'com.ericsson.oss.services.kpi',
      },
    ],
    bugOrTR: 'True',
    component: '597',
    missingDependencies: 'False',
    createdByTeam: 'Burgundy',
    deliveryGroup: '55925',
    modifiedDate: '2021-03-04 16:09:34',
    createdDate: '2021-03-04 16:09:34',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'NetworkEvolutionAndOSS',
    creator: 'mahesh.kumar.laghumarapu@ericsson.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICneconnmep_CXP9031217',
        dateCreated: '2021-02-22 13:54:34',
        version: '2.1.1',
        vmServices: [
          'mscm',
          'mspm',
          'mspmip',
        ],
        groupId: 'com.ericsson.oss.mediation',
      },
    ],
    bugOrTR: 'True',
    component: '344',
    missingDependencies: 'False',
    createdByTeam: 'Aurora',
    deliveryGroup: '55155',
    modifiedDate: '2021-03-01 13:53:06',
    createdDate: '2021-03-01 13:53:06',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'NetworkEvolutionAndOSS',
    creator: 'puneet.raj.srivastava@ericsson.com',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFenmdeploymentworkflowsbur_CXP9035671',
        dateCreated: '2021-01-19 11:47:45',
        version: '1.12.1',
        vmServices: [],
        groupId: 'com.ericsson.oss.itpf.deployment',
      },
    ],
    bugOrTR: 'False',
    component: '221',
    missingDependencies: 'False',
    createdByTeam: 'Vandals',
    deliveryGroup: '53020',
    modifiedDate: '2021-02-11 14:41:26',
    createdDate: '2021-02-11 14:41:26',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'PlanningAndConfiguration',
    creator: 'srujan.m@tcs.com',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFcmgattestware_CXP9034593',
        dateCreated: '2021-02-11 11:10:42',
        version: '1.59.6',
        vmServices: [],
        groupId: 'com.ericsson.oss.testware.cm',
      },
    ],
    bugOrTR: 'False',
    component: '364',
    missingDependencies: 'False',
    createdByTeam: 'Vasista',
    deliveryGroup: '52936',
    modifiedDate: '2021-02-11 11:32:23',
    createdDate: '2021-02-11 11:32:23',
    ccbApproved: 'True',
  },
  {
    autoCreated: 'False',
    parentElement: 'NSS',
    creator: 'susmitha.1@tcs.com',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTWnssutils_CXP9036352',
        dateCreated: '2021-02-10 15:23:16',
        version: '1.14.4',
        vmServices: [],
        groupId: 'com.ericsson.oss.services.nss.nssutils',
      },
    ],
    bugOrTR: 'False',
    component: '369',
    missingDependencies: 'True',
    createdByTeam: 'NSS_Node_Populator',
    deliveryGroup: '52908',
    modifiedDate: '2021-02-11 09:30:46',
    createdDate: '2021-02-11 09:30:46',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'PlanningAndConfiguration',
    creator: 'znlxvnk',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICautosoftwareupgradeflow_CXP9037043',
        dateCreated: '2021-02-11 04:56:16',
        version: '1.45.2',
        vmServices: [],
        groupId: 'com.ericsson.oss.services.shm',
      },
      {
        category: 'service',
        artifact: 'ERICshminventory_CXP9031631',
        dateCreated: '2021-02-11 06:06:47',
        version: '1.107.1',
        vmServices: [
          'shmserv',
        ],
        groupId: 'com.ericsson.oss.services.shm',
      },
    ],
    bugOrTR: 'False',
    component: '339',
    missingDependencies: 'False',
    createdByTeam: 'Sharks',
    deliveryGroup: '52880',
    modifiedDate: '2021-02-11 08:47:28',
    createdDate: '2021-02-11 08:47:28',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'PlanningAndConfiguration',
    creator: 'samuel.gyimah@ericsson.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICreparentflow_CXP9038952',
        dateCreated: '2021-02-10 16:42:42',
        version: '1.8.5',
        vmServices: [],
        groupId: 'com.ericsson.oss.services.cm.reparent',
      },
    ],
    bugOrTR: 'False',
    component: '110',
    missingDependencies: 'True',
    createdByTeam: 'Thalaiva',
    deliveryGroup: '52838',
    modifiedDate: '2021-02-10 19:50:02',
    createdDate: '2021-02-10 19:50:02',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'Release',
    creator: 'avinash.horahatti1@wipro.com',
    artifacts: [
      {
        category: 'ms',
        artifact: 'ERICtorutilities_CXP9030570',
        dateCreated: '2021-02-09 19:59:38',
        version: '5.12.28',
        vmServices: [],
        groupId: 'com.ericsson.dms.torutility',
      },
    ],
    bugOrTR: 'False',
    component: '170',
    missingDependencies: 'True',
    createdByTeam: 'BladeRunners',
    deliveryGroup: '52775',
    modifiedDate: '2021-02-10 15:29:43',
    createdDate: '2021-02-10 15:29:43',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'Release',
    creator: 'avinash.horahatti1@wipro.com',
    artifacts: [
      {
        category: 'ms',
        artifact: 'ERICtorutilities_CXP9030570',
        dateCreated: '2021-02-10 20:00:10',
        version: '5.12.29',
        vmServices: [],
        groupId: 'com.ericsson.dms.torutility',
      },
    ],
    bugOrTR: 'False',
    component: '170',
    missingDependencies: 'False',
    createdByTeam: 'BladeRunners',
    deliveryGroup: '52950',
    modifiedDate: '2021-02-11 11:46:18',
    createdDate: '2021-02-11 11:46:18',
    ccbApproved: 'False',
  },
];

const ALL_DELIVERY_GROUPS_21_07 = [
  {
    autoCreated: 'False',
    parentElement: 'Security',
    creator: 'zbxxmdh',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICtlstransportlibrary_CXP9031764',
        dateCreated: '2021-04-17 07:53:32',
        version: '1.36.1',
        vmServices: [
          'mscmce',
          'mscmip',
          'mspm',
          'mssnmpfm',
          'msnetlog',
          'mspmip',
        ],
        groupId: 'com.ericsson.oss.mediation',
      },
    ],
    bugOrTR: 'True',
    component: '185',
    missingDependencies: 'False',
    createdByTeam: 'Sentinels',
    deliveryGroup: '62722',
    modifiedDate: '2021-04-20 09:55:39',
    createdDate: '2021-04-20 09:55:39',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'Transport',
    creator: 'nilima.pathak@tcs.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICsmrsservice_CXP9030755',
        dateCreated: '2021-04-18 11:34:55',
        version: '1.106.1',
        vmServices: [
          'secserv',
          'smrsserv',
        ],
        groupId: 'com.ericsson.nms.security',
      },
    ],
    bugOrTR: 'True',
    component: '328',
    missingDependencies: 'False',
    createdByTeam: 'Raptors',
    deliveryGroup: '62708',
    modifiedDate: '2021-04-20 09:25:57',
    createdDate: '2021-04-20 09:25:57',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'Transport',
    creator: 'sailaja.praharaju@tcs.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICncmapp_CXP9038085',
        dateCreated: '2021-04-15 14:58:17',
        version: '1.12.1',
        vmServices: [],
        groupId: 'com.ericsson.oss.presentation.client.connectivity',
      },
    ],
    bugOrTR: 'False',
    component: '327',
    missingDependencies: 'False',
    createdByTeam: 'Starks',
    deliveryGroup: '62687',
    modifiedDate: '2021-04-20 09:06:33',
    createdDate: '2021-04-20 09:06:33',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'Transport',
    creator: 'madipally.chaitanya@tcs.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICipnediscoveryui_CXP9032137',
        dateCreated: '2021-04-14 11:13:07',
        version: '1.69.1',
        vmServices: [
          'httpd',
        ],
        groupId: 'com.ericsson.oss.presentation.client.ipcm.discovery',
      },
      {
        category: 'service',
        artifact: 'ERICcppinventorysynchservice_CXP9030700',
        dateCreated: '2021-04-15 14:49:37',
        version: '1.154.1',
        vmServices: [
          'shmcoreserv',
        ],
        groupId: 'com.ericsson.oss.services.shm',
      },
      {
        category: 'service',
        artifact: 'ERICaddnodeapp_CXP9034867',
        dateCreated: '2021-04-15 15:53:34',
        version: '1.33.1',
        vmServices: [
          'httpd',
        ],
        groupId: 'com.ericsson.oss.presentation.client.addnode',
      },
      {
        category: 'service',
        artifact: 'ERICcli_CXP9030319',
        dateCreated: '2021-04-16 07:54:04',
        version: '1.130.1',
        vmServices: [
          'httpd',
        ],
        groupId: 'com.ericsson.oss.pres.cm',
      },
    ],
    bugOrTR: 'False',
    component: '398',
    missingDependencies: 'False',
    createdByTeam: 'Aztec',
    deliveryGroup: '62561',
    modifiedDate: '2021-04-19 12:14:14',
    createdDate: '2021-04-19 12:14:14',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'Support',
    creator: 'avinash.horahatti1@wipro.com',
    artifacts: [
      {
        category: 'ms',
        artifact: 'ERICtorutilities_CXP9030570',
        dateCreated: '2021-04-14 19:57:25',
        version: '5.15.21',
        vmServices: [],
        groupId: 'com.ericsson.dms.torutility',
      },
    ],
    bugOrTR: 'True',
    component: '660',
    missingDependencies: 'False',
    createdByTeam: 'BladeRunners',
    deliveryGroup: '62253',
    modifiedDate: '2021-04-15 15:48:13',
    createdDate: '2021-04-15 15:48:13',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'Transport',
    creator: 'n.nagaraj1@tcs.com',
    artifacts: [
      {
        category: 'scripting',
        artifact: 'ERICelementmanagerservices_CXP9031849',
        dateCreated: '2021-04-15 08:54:31',
        version: '1.71.1',
        vmServices: [
          'elementmanager',
        ],
        groupId: 'com.ericsson.oss.services.elementmanager',
      },
      {
        category: 'model',
        artifact: 'ERICelementmanagerservicesmodel_CXP9037424',
        dateCreated: '2021-04-15 08:54:43',
        version: '1.71.1',
        vmServices: [],
        groupId: 'com.ericsson.oss.services.elementmanager',
      },
    ],
    bugOrTR: 'True',
    component: '329',
    missingDependencies: 'False',
    createdByTeam: 'Scorpions',
    deliveryGroup: '62246',
    modifiedDate: '2021-04-15 13:14:46',
    createdDate: '2021-04-15 13:14:46',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'Transport',
    creator: 'alessandro.macelloni@ericsson.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICautosoftwareupgradeflow_CXP9037043',
        dateCreated: '2021-04-14 16:34:59',
        version: '1.47.16',
        vmServices: [],
        groupId: 'com.ericsson.oss.services.shm',
      },
    ],
    bugOrTR: 'True',
    component: '353',
    missingDependencies: 'False',
    createdByTeam: 'Quasar',
    deliveryGroup: '62239',
    modifiedDate: '2021-04-15 12:11:01',
    createdDate: '2021-04-15 12:11:01',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'NetworkServices',
    creator: 'prasad.ghagare@tcs.com',
    artifacts: [
      {
        category: 'streaming',
        artifact: 'ERICeventstreamterminator_CXP9034559',
        dateCreated: '2021-04-14 17:00:46',
        version: '1.41.2',
        vmServices: [
          'msstr1',
        ],
        groupId: 'com.ericsson.oss.mediation.streaming',
      },
      {
        category: 'events',
        artifact: 'ERICebsmflow_CXP9031856',
        dateCreated: '2021-04-15 11:38:15',
        version: '1.101.2',
        vmServices: [
          'ebsm1',
          'ebsm2',
          'ebsm3',
          'ebsm4',
          'ebsm5',
        ],
        groupId: 'com.ericsson.oss.mediation.pm.ebs.models.flows',
      },
      {
        category: 'ebsstream',
        artifact: 'ERICebsstreamflow_CXP9034334',
        dateCreated: '2021-04-15 11:45:29',
        version: '1.101.2',
        vmServices: [
          'ebsstream1',
          'ebsstream2',
          'ebsstream3',
          'ebsstream4',
          'ebsstream5',
          'ebsstream6',
          'ebsstream7',
          'ebsstream8',
        ],
        groupId: 'com.ericsson.oss.mediation.pm.ebs.models.flows',
      },
    ],
    bugOrTR: 'False',
    component: '1017',
    missingDependencies: 'False',
    createdByTeam: 'Tardis',
    deliveryGroup: '62183',
    modifiedDate: '2021-04-14 21:19:51',
    createdDate: '2021-04-14 21:19:51',
    ccbApproved: 'False',
  },
];

const CORRECTLY_FILTERED_DELIVERY_GROUPS = [
  {
    autoCreated: 'False',
    parentElement: 'Transport',
    creator: 'sai.spallekonda@tcs.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICminilinkoutdoorpmhandlerscode_CXP9035613',
        dateCreated: '2021-03-04 10:41:13',
        version: '1.38.1',
        vmServices: [
          'mspmip',
        ],
        groupId: 'com.ericsson.oss.mediation.pm.handlers',
      },
      {
        category: 'model',
        artifact: 'ERICminilinkindoorpmflows_CXP9033752',
        dateCreated: '2021-03-04 14:32:01',
        version: '1.80.2',
        vmServices: [],
        groupId: 'com.ericsson.oss.mediation.pm.flow',
      },
      {
        category: 'service',
        artifact: 'ERICminilinkindoorpmhandlers_CXP9033753',
        dateCreated: '2021-03-04 14:32:13',
        version: '1.80.2',
        vmServices: [
          'mspmip',
        ],
        groupId: 'com.ericsson.oss.mediation.pm.flow',
      },
    ],
    bugOrTR: 'True',
    component: '328',
    missingDependencies: 'False',
    createdByTeam: 'Raptors',
    deliveryGroup: '55967',
    modifiedDate: '2021-03-05 05:05:48',
    createdDate: '2021-03-05 05:05:48',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'CloudNative',
    creator: 'cian.prendergast@ericsson.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICkpiservice_CXP9032442',
        dateCreated: '2021-03-03 23:37:43',
        version: '1.55.1',
        vmServices: [
          'kpiserv',
        ],
        groupId: 'com.ericsson.oss.services.kpi',
      },
    ],
    bugOrTR: 'True',
    component: '597',
    missingDependencies: 'False',
    createdByTeam: 'Burgundy',
    deliveryGroup: '55925',
    modifiedDate: '2021-03-04 16:09:34',
    createdDate: '2021-03-04 16:09:34',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'NetworkEvolutionAndOSS',
    creator: 'mahesh.kumar.laghumarapu@ericsson.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICneconnmep_CXP9031217',
        dateCreated: '2021-02-22 13:54:34',
        version: '2.1.1',
        vmServices: [
          'mscm',
          'mspm',
          'mspmip',
        ],
        groupId: 'com.ericsson.oss.mediation',
      },
    ],
    bugOrTR: 'True',
    component: '344',
    missingDependencies: 'False',
    createdByTeam: 'Aurora',
    deliveryGroup: '55155',
    modifiedDate: '2021-03-01 13:53:06',
    createdDate: '2021-03-01 13:53:06',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'NetworkEvolutionAndOSS',
    creator: 'puneet.raj.srivastava@ericsson.com',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFenmdeploymentworkflowsbur_CXP9035671',
        dateCreated: '2021-01-19 11:47:45',
        version: '1.12.1',
        vmServices: [],
        groupId: 'com.ericsson.oss.itpf.deployment',
      },
    ],
    bugOrTR: 'False',
    component: '221',
    missingDependencies: 'False',
    createdByTeam: 'Vandals',
    deliveryGroup: '53020',
    modifiedDate: '2021-02-11 14:41:26',
    createdDate: '2021-02-11 14:41:26',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'PlanningAndConfiguration',
    creator: 'srujan.m@tcs.com',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTAFcmgattestware_CXP9034593',
        dateCreated: '2021-02-11 11:10:42',
        version: '1.59.6',
        vmServices: [],
        groupId: 'com.ericsson.oss.testware.cm',
      },
    ],
    bugOrTR: 'False',
    component: '364',
    missingDependencies: 'False',
    createdByTeam: 'Vasista',
    deliveryGroup: '52936',
    modifiedDate: '2021-02-11 11:32:23',
    createdDate: '2021-02-11 11:32:23',
    ccbApproved: 'True',
  },
  {
    autoCreated: 'False',
    parentElement: 'NSS',
    creator: 'susmitha.1@tcs.com',
    artifacts: [
      {
        category: 'testware',
        artifact: 'ERICTWnssutils_CXP9036352',
        dateCreated: '2021-02-10 15:23:16',
        version: '1.14.4',
        vmServices: [],
        groupId: 'com.ericsson.oss.services.nss.nssutils',
      },
    ],
    bugOrTR: 'False',
    component: '369',
    missingDependencies: 'True',
    createdByTeam: 'NSS_Node_Populator',
    deliveryGroup: '52908',
    modifiedDate: '2021-02-11 09:30:46',
    createdDate: '2021-02-11 09:30:46',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'PlanningAndConfiguration',
    creator: 'znlxvnk',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICautosoftwareupgradeflow_CXP9037043',
        dateCreated: '2021-02-11 04:56:16',
        version: '1.45.2',
        vmServices: [],
        groupId: 'com.ericsson.oss.services.shm',
      },
      {
        category: 'service',
        artifact: 'ERICshminventory_CXP9031631',
        dateCreated: '2021-02-11 06:06:47',
        version: '1.107.1',
        vmServices: [
          'shmserv',
        ],
        groupId: 'com.ericsson.oss.services.shm',
      },
    ],
    bugOrTR: 'False',
    component: '339',
    missingDependencies: 'False',
    createdByTeam: 'Sharks',
    deliveryGroup: '52880',
    modifiedDate: '2021-02-11 08:47:28',
    createdDate: '2021-02-11 08:47:28',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'PlanningAndConfiguration',
    creator: 'samuel.gyimah@ericsson.com',
    artifacts: [
      {
        category: 'service',
        artifact: 'ERICreparentflow_CXP9038952',
        dateCreated: '2021-02-10 16:42:42',
        version: '1.8.5',
        vmServices: [],
        groupId: 'com.ericsson.oss.services.cm.reparent',
      },
    ],
    bugOrTR: 'False',
    component: '110',
    missingDependencies: 'True',
    createdByTeam: 'Thalaiva',
    deliveryGroup: '52838',
    modifiedDate: '2021-02-10 19:50:02',
    createdDate: '2021-02-10 19:50:02',
    ccbApproved: 'False',
  },
  {
    autoCreated: 'False',
    parentElement: 'Release',
    creator: 'avinash.horahatti1@wipro.com',
    artifacts: [
      {
        category: 'ms',
        artifact: 'ERICtorutilities_CXP9030570',
        dateCreated: '2021-02-09 19:59:38',
        version: '5.12.28',
        vmServices: [],
        groupId: 'com.ericsson.dms.torutility',
      },
    ],
    bugOrTR: 'False',
    component: '170',
    missingDependencies: 'True',
    createdByTeam: 'BladeRunners',
    deliveryGroup: '52775',
    modifiedDate: '2021-02-10 15:29:43',
    createdDate: '2021-02-10 15:29:43',
    ccbApproved: 'False',
  },
];

describe('Unit Test: Filter Duplicate Team Names use-case.', () => {
  it('should filter out DGs that have duplicate team names.', () => {
    const filteredDeliveryGroups = filterDuplicateTeams(ALL_DELIVERY_GROUPS_21_04);
    expect(filteredDeliveryGroups).toEqual(CORRECTLY_FILTERED_DELIVERY_GROUPS);
  });
  it('should not filter out any DGs if there are no duplicate team names', () => {
    const filteredDeliveryGroups = filterDuplicateTeams(ALL_DELIVERY_GROUPS_21_07);
    expect(filteredDeliveryGroups).toEqual(ALL_DELIVERY_GROUPS_21_07);
  });
});
