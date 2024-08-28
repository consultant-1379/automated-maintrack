function makeSearchForSlots(slotsDb) {
  return function searchSlot(searchQuery) {
    if (Object.keys(searchQuery).length === 0) {
      throw new Error('You must specify a search query.');
    }
    // Example of searchQuery object
    //  {
    //    physicalEnvironment: [ '297', '306' ],
    //    slotStatus: 'ongoing'
    //  }
    // We want to group all ORs into one array and all ANDs into another array
    // From above: Give me all physicalEnvironment 297 OR 306 AND slotStatus ongoing

    let firstPartOfQuery = '';
    let secondPartOfQuery = '';
    // Go through each property e.g. physicalEnvironment
    for (const slotProperty in searchQuery) {
      // If its an Array we're talking multiple ORs if not its a single AND
      // E.g. 297 or 306 vs ongoing AND 1.2.3
      if (searchQuery[slotProperty] instanceof Array) {
        secondPartOfQuery = `${secondPartOfQuery}"$or": [`;
        // Go through the array e.g. [ '297', '306' ]
        const slotPropertyValues = searchQuery[slotProperty];
        for (const slotPropertyValue in slotPropertyValues) {
          if (slotPropertyValue !== null) {
            // Example  "$or": [{ "physicalEnvironment": "297" },
            secondPartOfQuery = `${secondPartOfQuery}{ "${slotProperty}": "${slotPropertyValues[slotPropertyValue]}" },`;
          }
        }
        // Get rid of last comma
        secondPartOfQuery = secondPartOfQuery.slice(0, -1);
        // Close off the OR
        secondPartOfQuery = `${secondPartOfQuery}],`;
      } else {
        // Add to the AND part - e.g { "slotStatus": "ongoing" },
        firstPartOfQuery = `${firstPartOfQuery}{ "${slotProperty}": "${searchQuery[slotProperty]}" },`;
      }
    }
    firstPartOfQuery = firstPartOfQuery.slice(0, -1);
    secondPartOfQuery = secondPartOfQuery.slice(0, -1);

    // If there is both an 'AND' and 'OR' part then a comma will be put between them
    if (firstPartOfQuery !== '') {
      firstPartOfQuery = `"$and": [${firstPartOfQuery}]`;
    }
    if (firstPartOfQuery !== '' && secondPartOfQuery !== '') {
      secondPartOfQuery = `, ${secondPartOfQuery}`;
    }

    // Example of a finalQuery: {"$and": [{ "slotStatus": "ongoing" }], "$or": [{ "physicalEnvironment": "297" },{ "physicalEnvironment": "306" }]}
    const finalQuery = `{${firstPartOfQuery}${secondPartOfQuery}}`;
    return slotsDb.findBySearchQuery(JSON.parse(finalQuery), 'slots');
  };
}

module.exports = { makeSearchForSlots };
