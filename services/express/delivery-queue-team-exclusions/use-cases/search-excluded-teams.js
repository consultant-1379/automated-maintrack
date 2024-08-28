function makeSearchForExcludedTeams(ExcludedTeamDb) {
  return function searchExcludedTeam(searchQuery) {
    if (Object.keys(searchQuery).length === 0) {
      throw new Error('You must specify a search query.');
    }
    // Example of searchQuery object
    //  {
    //    teamName: 'Fargo'
    //  }
    // We want to group all ORs into one array and all ANDs into another array

    let firstPartOfQuery = '';
    let secondPartOfQuery = '';
    for (const excludedTeamProperty in searchQuery) {
      if (searchQuery[excludedTeamProperty] instanceof Array) {
        secondPartOfQuery = `${secondPartOfQuery}"$or": [`;
        const excludedTeamPropertyValues = searchQuery[excludedTeamProperty];
        for (const excludedTeamPropertyValue in excludedTeamPropertyValues) {
          if (excludedTeamPropertyValue !== null) {
            secondPartOfQuery = `${secondPartOfQuery}{ "${excludedTeamProperty}": "${excludedTeamPropertyValues[excludedTeamPropertyValue]}" },`;
          }
        }
        secondPartOfQuery = secondPartOfQuery.slice(0, -1);
        secondPartOfQuery = `${secondPartOfQuery}],`;
      } else {
        firstPartOfQuery = `${firstPartOfQuery}{ "${excludedTeamProperty}": "${searchQuery[excludedTeamProperty]}" },`;
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
    return ExcludedTeamDb.findBySearchQuery(JSON.parse(finalQuery), 'excludedTeams');
  };
}

module.exports = { makeSearchForExcludedTeams };
