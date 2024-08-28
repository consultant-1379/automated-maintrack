const expect = require('expect');

const { makeSearchForKnownIssues } = require('./../../use-cases/search-known-issues');

describe('Unit Test: search known issues use case', () => {
  it('tests the searching of a known issue from the database using multiple values', () => {
    const searchForKnownIssues = makeSearchForKnownIssues({
      findBySearchQuery: finalQuery => finalQuery,
    });

    const actualMongoQuery = searchForKnownIssues(
      {
        testSuiteName: ['testSuite1', 'testSuite2'],
      },
    );

    const expectedMongoQuery = {
      $or: [
        { testSuiteName: 'testSuite1' },
        { testSuiteName: 'testSuite2' },
      ],
    };

    expect(actualMongoQuery).toEqual(expectedMongoQuery);
  });
  it('tests the searching of a known issue using one property', () => {
    const searchForKnownIssues = makeSearchForKnownIssues({
      findBySearchQuery: finalQuery => finalQuery,
    });

    const actualMongoQuery = searchForKnownIssues(
      {
        testSuiteName: 'testSuite1',
      },
    );

    const expectedMongoQuery = {
      $and: [
        { testSuiteName: 'testSuite1' },
      ],
    };

    expect(actualMongoQuery).toEqual(expectedMongoQuery);
  });
  it('tests that we dont find any slots', () => {
    const searchForKnownIssues = makeSearchForKnownIssues({
      findBySearchQuery: finalQuery => finalQuery,
    });
    expect(() => searchForKnownIssues({})).toThrow('You must specify a search query.');
  });
});
