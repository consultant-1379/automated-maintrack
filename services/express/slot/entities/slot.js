function buildMakeSlot({ Id }) {
  return function makeSlot({
    id = Id.makeId(),
    physicalEnvironment,
    cloudEnvironment,
    deliveredDGs,
    obsoletedDGs,
    dgObsoletionPredictions,
    bugsAndTRsOnlyStatus,
    slotUgFailureBehaviour,
    slotStatus,
    physicalStatus,
    cloudStatus,
    physicalUpgradeStatus = '',
    cloudUpgradeStatus = '',
    physicalFailedJobUrl = '',
    cloudFailedJobUrl = '',
    productSetVersion,
    slotType,
    rfa250Url = '',
    aptuUrl = '',
    aduUrl = '',
    createdOn = Date.now(),
    modifiedOn = Date.now(),
    slotNumber = '',
  } = {}) {
    if (!Id.isValidId(id)) {
      throw new Error('Slot must have a valid id.');
    }

    if (!slotStatus) {
      throw new Error('You must provide a slotStatus value.');
    }
    if (!['ongoing', 'failure', 'success'].includes(slotStatus)) {
      throw new Error('You must use either ongoing, failure or success for the slotStatus value');
    }
    if (!['manual', 'automatic'].includes(slotType)) {
      throw new Error('You must use either manual or automatic for the slotType value');
    }

    if (!physicalEnvironment || !physicalStatus) {
      physicalEnvironment = 'pending';
      physicalStatus = 'pending';
    }
    if (!cloudEnvironment || !cloudStatus) {
      cloudEnvironment = 'pending';
      cloudStatus = 'pending';
    }

    if (!deliveredDGs) {
      throw new Error('A slot must have delivered DGs associated with it');
    }

    if (!obsoletedDGs) {
      obsoletedDGs = '';
    }

    if (!['on', 'off'].includes(bugsAndTRsOnlyStatus)) {
      throw new Error('A slot must contain a bugsAndTRsOnlyStatus of either on or off');
    }

    if (!['shutdown', 'obsolete'].includes(slotUgFailureBehaviour)) {
      throw new Error('A slot must contain a slotUgFailureBehaviour of either shutdown or obsolete');
    }

    if (!dgObsoletionPredictions) {
      dgObsoletionPredictions = [];
    }

    const productSetVersionRegularExpression = new RegExp('^([0-9]{1,2})[.]([0-9]{1,2})[.]([0-9]{1,3})$');
    if (!productSetVersion) {
      throw new Error('A slot must have a product set version associated with it');
    }
    if (!productSetVersionRegularExpression.test(productSetVersion) && productSetVersion !== 'pending' && productSetVersion !== 'failure') {
      throw new Error('A slot must have a valid product set version or be pending a product set version or be set to failure on product set creation failure');
    }

    if (!slotNumber) {
      slotNumber = '';
    }

    return Object.freeze({
      getSlotStatus: () => slotStatus,
      getCloudEnvironment: () => cloudEnvironment,
      getPhysicalEnvironment: () => physicalEnvironment,
      getDeliveredDGs: () => deliveredDGs,
      getObsoletedDGs: () => obsoletedDGs,
      getDgObsoletionPredictions: () => dgObsoletionPredictions,
      getBugsAndTRsOnlyStatus: () => bugsAndTRsOnlyStatus,
      getSlotUgFailureBehaviour: () => slotUgFailureBehaviour,
      getPhysicalStatus: () => physicalStatus,
      getCloudStatus: () => cloudStatus,
      getPhysicalUpgradeStatus: () => physicalUpgradeStatus,
      getCloudUpgradeStatus: () => cloudUpgradeStatus,
      getPhysicalFailedJobUrl: () => physicalFailedJobUrl,
      getCloudFailedJobUrl: () => cloudFailedJobUrl,
      getProductSetVersion: () => productSetVersion,
      getId: () => id,
      getSlotType: () => slotType,
      getRfa250Url: () => rfa250Url,
      getAptuUrl: () => aptuUrl,
      getAduUrl: () => aduUrl,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
      getSlotNumber: () => slotNumber,
    });
  };
}

module.exports = { buildMakeSlot };
