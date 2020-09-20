import { _ } from 'lodash';

class TeamFinderFilter {

  /**
   * Filters through the inputted data based on user input. If the search query is empty, it returns
   * the entire dataset.
   * @param data The data
   * @param searchQuery The search query
   * @returns {[]|*} Returns the filtered data
   */
  filterBySearch(data, searchQuery) {
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

  dropdownSkills(data) {
    let skills = _.map(data, 'name');
    let skillsID = _.map(data, '_id');
    const categories = _.flattenDeep(skills);
    const skillCategory = _.flattenDeep(skillsID);
    skills = _.uniq(categories);
    skillsID = _.uniq(skillCategory);

    let info = [];

    for (let i = 0; i < skills.length; i++) {
      info.push({
        key: skills[i],
        text: skills[i],
        value: skills[i],
        _id: skillsID[i],
      });
    }

    info = _.orderBy(info, ['text'],['asc']);

    // Adding any parameter to front of array
    info.unshift({
      key: 'any',
      text: 'Any',
      value: 'any',
    });
    console.log(info);
    return info;
  }

  getTeamSkillNames(teamID, teamSkills, universalSkills) {
    const data = [];
    const skills = _.filter(teamSkills, { teamID: teamID });
    for (let i = 0; i < skills.length; i++) {
      for (let j = 0; j < universalSkills.length; j++) {
        if (skills[i].skillID === universalSkills[j]._id) {
          data.push(universalSkills[j].name);
        }
      }
    }
    return data;
  }

}

export default TeamFinderFilter;
