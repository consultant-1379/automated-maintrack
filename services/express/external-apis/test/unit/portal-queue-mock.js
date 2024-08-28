const MOCK_PORTAL_QUEUE = [{
  autoCreated: 'False',
  parentElement: 'AssuranceAndOptimisation',
  creator: 'manju1.n@tcs.com',
  artifacts: [{
    category: 'streaming',
    artifact: 'ERICenmsgeventstreambusdef_CXP9034577',
    dateCreated: '2021-02-23 13:08:25',
    version: '999999.24.1',
    vmServices: ['kafka1'],
    groupId: 'com.ericsson.oss.servicegroupcontainers',
  },
  {
    category: 'streaming,asrstream,ebsstream',
    artifact: 'ERICeventstreambus_CXP9034561',
    dateCreated: '2021-02-23 13:11:51',
    version: '999999.26.1',
    vmServices: ['kafka1', 'asrkafka', 'ebskafka1'],
    groupId: 'com.ericsson.oss.itpf.datalayer',
  }],
  bugOrTR: 'True',
  component: '336',
  missingDependencies: 'False',
  createdByTeam: 'Convex',
  deliveryGroup: '54385',
  modifiedDate: '2021-02-23 13:47:29',
  createdDate: '2021-02-23 13:47:29',
  ccbApproved: 'True',
},
{
  autoCreated: 'False',
  parentElement: 'AssuranceAndOptimisation',
  creator: 'silvia.pedemonte@ericsson.com',
  artifacts: [{
    category: 'service',
    artifact: 'ERICpmiccommonmoduleimpl_CXP9032400',
    dateCreated: '2021-02-15 15:22:32',
    version: '999999.59.1',
    vmServices: ['mspm', 'mspmip', 'pmserv', 'saserv'],
    groupId: 'com.ericsson.oss.mediation.pmic.modules',
  },
  {
    category: 'service',
    artifact: 'ERICesapmhandlerscode_CXP9035032',
    dateCreated: '2021-02-16 08:23:39',
    version: '999999.20.1',
    vmServices: ['mspmip'],
    groupId: 'com.ericsson.oss.mediation.pm.handlers',
  },
  {
    category: 'service',
    artifact: 'ERICeoipmhandlerscode_CXP9036548',
    dateCreated: '2021-02-16 08:25:37',
    version: '999999.25.1',
    vmServices: [],
    groupId: 'com.ericsson.oss.mediation.pm.handlers',
  },
  {
    category: 'service',
    artifact: 'ERICcpppmhandlerscode_CXP9033645',
    dateCreated: '2021-02-16 08:33:42',
    version: '999999.40.3',
    vmServices: ['mspm'],
    groupId: 'com.ericsson.oss.mediation.pm.handlers',
  },
  {
    category: 'service',
    artifact: 'ERICminilinkindoorpmhandlers_CXP9033753',
    dateCreated: '2021-02-16 08:33:48',
    version: '999999.81.1',
    vmServices: ['mspmip'],
    groupId: 'com.ericsson.oss.mediation.pm.flow',
  },
  {
    category: 'service',
    artifact: 'ERICecimpmhandlercode_CXP9037764',
    dateCreated: '2021-02-17 12:04:33',
    version: '999999.30.1',
    vmServices: [],
    groupId: 'com.ericsson.oss.mediation.pm.handlers',
  }],
  bugOrTR: 'False',
  component: '98',
  missingDependencies: 'False',
  createdByTeam: 'Sunrise',
  deliveryGroup: '54378',
  modifiedDate: '2021-02-23 13:41:39',
  createdDate: '2021-02-23 13:41:39',
  ccbApproved: 'False',
},
];

module.exports = {
  MOCK_PORTAL_QUEUE,
};
