const expect = require('expect');
const { makeCheckIfDeliveryGroupContainsBugOrTR } = require('../../use-cases/check-delivery-group-contains-bug-or-tr');

let checkIfDeliveryGroupContainsBugOrTR;

const BUG_OR_TR_DELIVERY_GROUP = {
  bugOrTR: 'True',
  artifacts: [
    {
      category: 'service',
      artifact: 'ERICncmagent_CXP9038315',
      version: '1.19.4',
    },
  ],
  missingDependencies: 'False',
  deliveryGroup: '51788',
  ccbApproved: 'False',
};

const NON_BUG_OR_TR_DELIVERY_GROUP = {
  bugOrTR: 'False',
  artifacts: [
    {
      category: 'model',
      artifact: 'ERICeniqtopologyservicemodel_CXP9031298',
      version: '1.85.3',
    },
  ],
  missingDependencies: 'False',
  deliveryGroup: '51784',
  ccbApproved: 'False',
};

const BUG_OR_TR_UNDEFINED_DELIVERY_GROUP = {
  bugOrTR: undefined,
  artifacts: [
    {
      category: 'service',
      artifact: 'ERICncmagent_CXP9038315',
      version: '1.19.4',
    },
  ],
  missingDependencies: 'False',
  deliveryGroup: '51788',
  ccbApproved: 'False',
};

const BUG_OR_TR_INVALID_DELIVERY_GROUP = {
  bugOrTR: 'any_string',
  artifacts: [
    {
      category: 'model',
      artifact: 'ERICeniqtopologyservicemodel_CXP9031298',
      version: '1.85.3',
    },
  ],
  missingDependencies: 'False',
  deliveryGroup: '51784',
  ccbApproved: 'False',
};

describe('Unit test: check DG contains bug or TR.', () => {
  before(() => {
    checkIfDeliveryGroupContainsBugOrTR = makeCheckIfDeliveryGroupContainsBugOrTR();
  });
  it('should return true if delivery group bugOrTR flag is True', () => {
    const containsBugOrTR = checkIfDeliveryGroupContainsBugOrTR(BUG_OR_TR_DELIVERY_GROUP);
    expect(containsBugOrTR).toBe(true);
  });
  it('should return false if delivery group bugOrTR flag is False', () => {
    const containsBugOrTR = checkIfDeliveryGroupContainsBugOrTR(NON_BUG_OR_TR_DELIVERY_GROUP);
    expect(containsBugOrTR).toBe(false);
  });
  it('should return false if delivery group bugOrTR flag is undefined', () => {
    const containsBugOrTR = checkIfDeliveryGroupContainsBugOrTR(BUG_OR_TR_UNDEFINED_DELIVERY_GROUP);
    expect(containsBugOrTR).toBe(false);
  });
  it('should return false if delivery group bugOrTR flag is invalid string (not "on" or "off")', () => {
    const containsBugsOrTR = checkIfDeliveryGroupContainsBugOrTR(BUG_OR_TR_INVALID_DELIVERY_GROUP);
    expect(containsBugsOrTR).toBe(false);
  });
});
