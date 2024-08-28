const expect = require('expect');

const { makeSearchForSlots } = require('./../../use-cases/search-slots');

describe('Unit Test: search slots use case', () => {
  it('tests the searching of a slot from the database using multiple properties', () => {
    const searchForSlots = makeSearchForSlots({
      findBySearchQuery: finalQuery => finalQuery,
    });

    const actualMongoQuery = searchForSlots(
      {
        physicalEnvironment: ['297', '306'],
        productSetVersion: '1.1.1',
        slotStatus: 'ongoing',
      },
    );

    const expectedMongoQuery = {
      $and: [
        { productSetVersion: '1.1.1' },
        { slotStatus: 'ongoing' },
      ],
      $or: [
        { physicalEnvironment: '297' },
        { physicalEnvironment: '306' },
      ],
    };

    expect(actualMongoQuery).toEqual(expectedMongoQuery);
  });
  it('tests the searching of a slot using one property', () => {
    const searchForSlots = makeSearchForSlots({
      findBySearchQuery: finalQuery => finalQuery,
    });

    const actualMongoQuery = searchForSlots(
      {
        slotStatus: 'ongoing',
      },
    );

    const expectedMongoQuery = {
      $and: [
        { slotStatus: 'ongoing' },
      ],
    };

    expect(actualMongoQuery).toEqual(expectedMongoQuery);
  });
  it('tests the searching of a slot using two properties', () => {
    const searchForSlots = makeSearchForSlots({
      findBySearchQuery: finalQuery => finalQuery,
    });

    const actualMongoQuery = searchForSlots(
      {
        productSetVersion: '1.1.1',
        slotStatus: 'ongoing',
      },
    );

    const expectedMongoQuery = {
      $and: [
        { productSetVersion: '1.1.1' },
        { slotStatus: 'ongoing' },
      ],
    };

    expect(actualMongoQuery).toEqual(expectedMongoQuery);
  });
  it('tests that we dont find any slots', () => {
    const searchForSlots = makeSearchForSlots({
      findBySearchQuery: finalQuery => finalQuery,
    });
    expect(() => searchForSlots({})).toThrow('You must specify a search query.');
  });
});
