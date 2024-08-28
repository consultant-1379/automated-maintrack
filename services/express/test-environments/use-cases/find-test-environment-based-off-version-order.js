function makeFindTestEnvironmentBasedOffVersionOrder() {
  return function findTestEnvironmentBasedOffVersionOrder(environments, versioningOrder) {
    let candidateEnvironmentName;
    let candidateProductSet;

    environments.forEach((environment) => {
      let productSetVersionArray = [];

      if (environment.productSet) {
        productSetVersionArray = environment.productSet.split('.');
        if (productSetVersionArray[2].length === 1) {
          productSetVersionArray[2] = `00${productSetVersionArray[2]}`;
        } else if (productSetVersionArray[2].length === 2) {
          productSetVersionArray[2] = `0${productSetVersionArray[2]}`;
        }
        const manipulatedProductSetVersion = parseInt(productSetVersionArray.join(''), 10);

        if (candidateEnvironmentName) {
          if (versioningOrder === 'latest') {
            if (manipulatedProductSetVersion > candidateProductSet) {
              candidateEnvironmentName = environment.name;
              candidateProductSet = manipulatedProductSetVersion;
            }
          } else if (versioningOrder === 'oldest') {
            if (manipulatedProductSetVersion < candidateProductSet) {
              candidateEnvironmentName = environment.name;
              candidateProductSet = manipulatedProductSetVersion;
            }
          }
        } else {
          candidateEnvironmentName = environment.name;
          candidateProductSet = manipulatedProductSetVersion;
        }
      }
    });
    return candidateEnvironmentName;
  };
}
module.exports = { makeFindTestEnvironmentBasedOffVersionOrder };
