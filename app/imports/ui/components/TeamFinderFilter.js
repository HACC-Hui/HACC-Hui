class TeamFinderFilter {

   filterBySearch(data, searchQuery) {
    // console.log(searchQuery);
    if (searchQuery.length === 0) {
      return data;
    }
    const list = [];
    for (let i = 0; i < data.length; i++) {
      const teamName = data[i].name;
      const lowercase = teamName.toString().toLowerCase();
      if (lowercase.includes(searchQuery.toString().toLowerCase())) {
        list.push(data[i]);
      }
    }
    return list;
  }
}

export default TeamFinderFilter;
