function makeSearchForKnownIssues(knownIssueDb) {
  return function searchKnownIssue(searchQuery) {
    if (Object.keys(searchQuery).length === 0) {
      throw new Error('You must specify a search query.');
    }
    // Example of searchQuery object
    //  {
    //    testSuiteName: 'FM'
    //  }
    // We want to group all ORs into one array and all ANDs into another array

    let firstPartOfQuery = '';
    let secondPartOfQuery = '';
    for (const knownIssueProperty in searchQuery) {
      if (searchQuery[knownIssueProperty] instanceof Array) {
        secondPartOfQuery = `${secondPartOfQuery}"$or": [`;
        const knownIssuePropertyValues = searchQuery[knownIssueProperty];
        for (const knownIssuePropertyValue in knownIssuePropertyValues) {
          if (knownIssuePropertyValue !== null) {
            secondPartOfQuery = `${secondPartOfQuery}{ "${knownIssueProperty}": "${knownIssuePropertyValues[knownIssuePropertyValue]}" },`;
          }
        }
        secondPartOfQuery = secondPartOfQuery.slice(0, -1);
        secondPartOfQuery = `${secondPartOfQuery}],`;
      } else {
        firstPartOfQuery = `${firstPartOfQuery}{ "${knownIssueProperty}": "${searchQuery[knownIssueProperty]}" },`;
      }
    }
    firstPartOfQuery = firstPartOfQuery.slice(0, -1);
    secondPartOfQuery = secondPartOfQuery.slice(0, -1);

    if (firstPartOfQuery !== '') {
      firstPartOfQuery = `"$and": [${firstPartOfQuery}]`;
    }
    if (firstPartOfQuery !== '' && secondPartOfQuery !== '') {
      secondPartOfQuery = `, ${secondPartOfQuery}`;
    }

    const finalQuery = `{${firstPartOfQuery}${secondPartOfQuery}}`;
    return knownIssueDb.findBySearchQuery(JSON.parse(finalQuery), 'knownIssues');
  };
}

module.exports = { makeSearchForKnownIssues };
