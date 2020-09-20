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

  filterBySkills(value, allSkills, teamSkill, team) {

    // if there are no skills selected
    if (value.length === 0) {
      return team;
    }

    // if the 'any' option was selected
    for (let i = 0; i < value.length; i++) {
      if (value[i] === 'Any') {
        return team;
      }
    }

    // convert from skillName --> skillID
    const skillID = [];
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < allSkills.length; j++) {
        if (value[i] === allSkills[j].name) {
          skillID.push(allSkills[j]._id);
        }
      }
    }

    // get teamIDs for those that have the skills
    let teamsWithSkill = [];
    for (let i = 0; i < skillID.length; i++) {
      for (let j = 0; j < teamSkill.length; j++) {
        if (skillID[i] === teamSkill[j].skillID) {
          teamsWithSkill.push(teamSkill[j].teamID);
        }
      }
    }

    // Ensure there's no duplicate teamIDs
    teamsWithSkill = _.uniq(teamsWithSkill);

    // Get the filtered teams
    const teams = [];
    for (let i = 0; i < teamsWithSkill.length; i++) {
      for (let j = 0; j < team.length; j++) {
        if (teamsWithSkill[i] === team[j]._id) {
          teams.push(team[j]);
        }
      }
    }

    return teams;
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

    info = _.orderBy(info, ['text'], ['asc']);

    // Adding any parameter to front of array
    info.unshift({
      key: 'any',
      text: 'Any',
      value: 'any',
    });
   // console.log(info);
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
