function makeFunctionalUserIsAvailableOrTesting() {
  return function functionalUserIsAvailableOrTesting() {
    const functionalUserAvailable = process.env.BB_FUNCTIONAL_USER && process.env.BB_FUNCTIONAL_USER_PASSWORD;
    const currentlyTesting = process.env.NODE_ENV === 'TEST_LOCAL_MONGO' || process.env.NODE_ENV === 'TEST';
    return functionalUserAvailable || currentlyTesting;
  };
}

module.exports = { makeFunctionalUserIsAvailableOrTesting };
