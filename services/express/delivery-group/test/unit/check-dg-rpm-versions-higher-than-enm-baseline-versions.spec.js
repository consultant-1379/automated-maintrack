const expect = require('expect');
const compareVersions = require('compare-versions');

const { makeCheckDgRpmVersionsHigherThanEnmBaselineVersions } = require('../../use-cases/check-dg-rpm-versions-higher-than-enm-baseline-versions');

const NON_TESTWARE_DELIVERY_GROUP = {
  artifacts:
    [{
      category: 'service',
      artifact: 'ERICncmagent_CXP9038315',
      version: '1.9.5',
    }],
  deliveryGroup: '49106',
  missingDependencies: 'False',
  ccbApproved: 'False',
};

const TESTWARE_DELIVERY_GROUP = {
  artifacts:
    [{
      category: 'testware',
      artifact: 'ERICTAFpmsubstatistical_CXP9033208',
      version: '1.69.4',
    }],
  deliveryGroup: '49084',
  missingDependencies: 'False',
  ccbApproved: 'True',
};

const LOWER_VERSION_ENM_PACKAGES = [{
  name: 'ERICncmagent_CXP9038315',
  version: '1.9.4',
}];

const LOWER_VERSION_ENM_TESTWARE_PACKAGES = [{
  name: 'ERICTAFpmsubstatistical_CXP9033208',
  version: '1.69.3',
}];

const SAME_VERSION_ENM_PACKAGES = [{
  name: 'ERICncmagent_CXP9038315',
  version: '1.9.5',
}];

const SAME_VERSION_ENM_TESTWARE_PACKAGES = [{
  name: 'ERICTAFpmsubstatistical_CXP9033208',
  version: '1.69.4',
}];

const HIGHER_VERSION_ENM_PACKAGES = [{
  name: 'ERICncmagent_CXP9038315',
  version: '1.9.6',
}];

const HIGHER_VERSION_ENM_TESTWARE_PACKAGES = [{
  name: 'ERICTAFpmsubstatistical_CXP9033208',
  version: '1.69.5',
}];


describe('Unit Test: check DG RPM Versions Higher Than ENM Baseline Versions', () => {
  it('should return true for a non testware delivery group that contains a version lower than what is in ENM', async () => {
    const checkDgRpmVersionsHigherThanEnmBaselineVersions = makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions);
    const isDgRpmVersionsHigherThanEnmBaselineVersions = await checkDgRpmVersionsHigherThanEnmBaselineVersions(
      NON_TESTWARE_DELIVERY_GROUP, LOWER_VERSION_ENM_PACKAGES, LOWER_VERSION_ENM_TESTWARE_PACKAGES, false,
    );
    expect(isDgRpmVersionsHigherThanEnmBaselineVersions).toBe(true);
  });
  it('should return false for a non testware delivery group that contains the same version as what is in ENM', async () => {
    const checkDgRpmVersionsHigherThanEnmBaselineVersions = makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions);
    const isDgRpmVersionsHigherThanEnmBaselineVersions = await checkDgRpmVersionsHigherThanEnmBaselineVersions(
      NON_TESTWARE_DELIVERY_GROUP, SAME_VERSION_ENM_PACKAGES, SAME_VERSION_ENM_TESTWARE_PACKAGES, false,
    );
    expect(isDgRpmVersionsHigherThanEnmBaselineVersions).toBe(false);
  });
  it('should return false for a non testware delivery group that contains a version higher than what is in ENM', async () => {
    const checkDgRpmVersionsHigherThanEnmBaselineVersions = makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions);
    const isDgRpmVersionsHigherThanEnmBaselineVersions = await checkDgRpmVersionsHigherThanEnmBaselineVersions(
      NON_TESTWARE_DELIVERY_GROUP, HIGHER_VERSION_ENM_PACKAGES, HIGHER_VERSION_ENM_TESTWARE_PACKAGES, false,
    );
    expect(isDgRpmVersionsHigherThanEnmBaselineVersions).toBe(false);
  });
  it('should return true for a testware delivery group that contains a version lower than what is in ENM', async () => {
    const checkDgRpmVersionsHigherThanEnmBaselineVersions = makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions);
    const isDgRpmVersionsHigherThanEnmBaselineVersions = await checkDgRpmVersionsHigherThanEnmBaselineVersions(
      TESTWARE_DELIVERY_GROUP, LOWER_VERSION_ENM_PACKAGES, LOWER_VERSION_ENM_TESTWARE_PACKAGES, true,
    );
    expect(isDgRpmVersionsHigherThanEnmBaselineVersions).toBe(true);
  });
  it('should return false for a testware delivery group that contains the same version as what is in ENM', async () => {
    const checkDgRpmVersionsHigherThanEnmBaselineVersions = makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions);
    const isDgRpmVersionsHigherThanEnmBaselineVersions = await checkDgRpmVersionsHigherThanEnmBaselineVersions(
      TESTWARE_DELIVERY_GROUP, SAME_VERSION_ENM_PACKAGES, SAME_VERSION_ENM_TESTWARE_PACKAGES, true,
    );
    expect(isDgRpmVersionsHigherThanEnmBaselineVersions).toBe(false);
  });
  it('should return false for a testware delivery group that contains a version higher than what is in ENM', async () => {
    const checkDgRpmVersionsHigherThanEnmBaselineVersions = makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions);
    const isDgRpmVersionsHigherThanEnmBaselineVersions = await checkDgRpmVersionsHigherThanEnmBaselineVersions(
      TESTWARE_DELIVERY_GROUP, HIGHER_VERSION_ENM_PACKAGES, HIGHER_VERSION_ENM_TESTWARE_PACKAGES, true,
    );
    expect(isDgRpmVersionsHigherThanEnmBaselineVersions).toBe(false);
  });
  it('should return true for a non testware delivery group that is not yet in ENM', async () => {
    const checkDgRpmVersionsHigherThanEnmBaselineVersions = makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions);
    const isDgRpmVersionsHigherThanEnmBaselineVersions = await checkDgRpmVersionsHigherThanEnmBaselineVersions(
      NON_TESTWARE_DELIVERY_GROUP, [], [], false,
    );
    expect(isDgRpmVersionsHigherThanEnmBaselineVersions).toBe(true);
  });
  it('should return true for a testware delivery group that is not yet in ENM', async () => {
    const checkDgRpmVersionsHigherThanEnmBaselineVersions = makeCheckDgRpmVersionsHigherThanEnmBaselineVersions(compareVersions);
    const isDgRpmVersionsHigherThanEnmBaselineVersions = await checkDgRpmVersionsHigherThanEnmBaselineVersions(
      TESTWARE_DELIVERY_GROUP, [], [], true,
    );
    expect(isDgRpmVersionsHigherThanEnmBaselineVersions).toBe(true);
  });
});
