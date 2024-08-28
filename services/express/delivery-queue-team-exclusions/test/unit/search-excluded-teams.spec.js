const expect = require('expect');

const { makeSearchForExcludedTeams } = require('../../use-cases/search-excluded-teams');

describe('Unit Test: search excluded teams use case', () => {
  it('tests the searching of a excluded teams from the database using multiple values', () => {
    const searchForExcludedTeams = makeSearchForExcludedTeams({
      findBySearchQuery: finalQuery => finalQuery,
    });

    const actualMongoQuery = searchForExcludedTeams(
      {
        testName: ['team1', 'team2'],
      },
    );

    const expectedMongoQuery = {
      $or: [
        { testName: 'team1' },
        { testName: 'team2' },
      ],
    };

    expect(actualMongoQuery).toEqual(expectedMongoQuery);
  });
  it('tests the searching of a excluded team using one property', () => {
    const searchForExcludedTeams = makeSearchForExcludedTeams({
      findBySearchQuery: finalQuery => finalQuery,
    });

    const actualMongoQuery = searchForExcludedTeams(
      {
        testName: 'team1',
      },
    );

    const expectedMongoQuery = {
      $and: [
        { testName: 'team1' },
      ],
    };

    expect(actualMongoQuery).toEqual(expectedMongoQuery);
  });
  it('tests that we dont find any slots', () => {
    const searchForExcludedTeams = makeSearchForExcludedTeams({
      findBySearchQuery: finalQuery => finalQuery,
    });
    expect(() => searchForExcludedTeams({})).toThrow('You must specify a search query.');
  });
});
