const expect = require('expect');

const { makePredictSlotObsoletions } = require('../../use-cases/predict-slot-obsoletions');
const { makeFakeSlot } = require('../../../__test__/fixtures/slot');

const VALID_DELIVERED_DGS = {
  deliveredDGs: [
    {
      createdByTeam: 'D3',
      deliveredRpms: [
        {
          category: 'service,events,ebsstream,asrstream,automation,eba',
          version: '1.81.1',
          name: 'ERICdpsruntimeapi_CXP9030469',
        },
      ],
      deliveryGroupId: '49941',
      includedCategories: 'service,events,ebsstream,asrstream,automation,eba',
      typeOfDelivery: 'auto',
    },
    {
      createdByTeam: 'Raisers',
      deliveredRpms: [{
        category: 'model',
        version: '1.54.2',
        name: 'ERICbscnodemodel_CXP9034746',
      }],
      deliveryGroupId: '49959',
      includedCategories: 'model',
      typeOfDelivery: 'auto',
    },
    {
      createdByTeam: 'Venus',
      deliveredRpms: [{
        category: 'service',
        version: '1.58.3',
        name: 'ERICenmsgmssnmpfm_CXP9031734',
      }],
      deliveryGroupId: '49960',
      includedCategories: 'service',
      typeOfDelivery: 'auto',
    },
    {
      createdByTeam: 'Titans',
      deliveredRpms: [{
        category: 'service',
        version: '1.47.1',
        name: 'ERICnhcjobsgui_CXP9036019',
      }],
      deliveryGroupId: '49961',
      includedCategories: 'service',
      typeOfDelivery: 'auto',
    },
  ],
};

const VALID_PREDICTION_OUTPUT = `AMT_PREDICTIONS_DELIMITER{
  '49941': {"action": "Obsolete", "confidence_in_keeping_dg": 94.90363},
  "49959": {"action": "Do not obsolete", "confidence_in_keeping_dg": 98.83245600000001},
  "49960": {"action": "Do not obsolete", "confidence_in_keeping_dg": 99.794325},
  "49961": {"action": "Do not obsolete", "confidence_in_keeping_dg": 98.73769300000001}
}AMT_PREDICTIONS_DELIMITER`;

const INVALID_PREDICTION_OUTPUT = `AMT_PREDICTIONS_DELIMITER{
  '49941': {"action": "Obsolete", "confidence_in_keeping_dg": 94.90363},
  "49959": {"action": "Do not obsolete", "confidence_in_keeping_dg": 98.83245600000001},
  "49960": {"action": "Do not obsolete", "confidence_in_keeping_dg": 99.794325},
  "49961": {"action": "Do not obsolete", "confidence_in_keeping_dg": 98.73769300000001}
}`;

const VALID_EXPECTED_PREDICTIONS = {
  49941: { action: 'Obsolete', confidence_in_keeping_dg: 94.90363 },
  49959: { action: 'Do not obsolete', confidence_in_keeping_dg: 98.83245600000001 },
  49960: { action: 'Do not obsolete', confidence_in_keeping_dg: 99.794325 },
  49961: { action: 'Do not obsolete', confidence_in_keeping_dg: 98.73769300000001 },
};

describe('Unit Test: Predict slot obsoletions use case', () => {
  it('Tests that we parse the output of the machine learning command correctly', () => {
    const newSlot = makeFakeSlot({
      deliveredDGs: [VALID_DELIVERED_DGS],
    });
    const fakeListOfKnownIssue = ['testSuiteName1', 'testSuiteName2'];
    const predictSlotObsoletions = makePredictSlotObsoletions(() => VALID_PREDICTION_OUTPUT);

    const predictions = predictSlotObsoletions(newSlot, fakeListOfKnownIssue);
    expect(predictions).toMatchObject(VALID_EXPECTED_PREDICTIONS);
  });
  it('Tests that throw an error when the output of the machine learning command is not in expected format', () => {
    const newSlot = makeFakeSlot({
      deliveredDGs: [VALID_DELIVERED_DGS],
    });
    const fakeListOfKnownIssue = ['testSuiteName1', 'testSuiteName2'];
    const predictSlotObsoletions = makePredictSlotObsoletions(() => INVALID_PREDICTION_OUTPUT);
    expect(() => predictSlotObsoletions(newSlot, fakeListOfKnownIssue)).toThrow('Output from python container is not in expected format');
  });
});
