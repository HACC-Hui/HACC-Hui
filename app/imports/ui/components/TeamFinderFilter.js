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

  /**
   * Filters through the data based on the user selection. By default, if no option is selected it
   * returns the original data
   * @param value The inputs given
   * @param allSkills All the available skills
   * @param teamSkill Each teams' skills
   * @param team The teams
   * @returns {[]|*} Returns the filtered array
   */
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

  /**
   * Filters through the data based on the user selection. By default, if no option is selected it
   * returns the original data
   * @param value The inputs given
   * @param allTools All the available tools
   * @param teamSkill Each teams' skills
   * @param team The teams
   * @returns {[]|*} Returns the filtered array
   */
  filterByTools(value, allTools, teamTools, team) {

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
    const toolID = [];
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < allTools.length; j++) {
        if (value[i] === allTools[j].name) {
          toolID.push(allTools[j]._id);
        }
      }
    }

    // get teamIDs for those that have the skills
    let teamsWithTool = [];
    for (let i = 0; i < toolID.length; i++) {
      for (let j = 0; j < teamTools.length; j++) {
        if (toolID[i] === teamTools[j].toolID) {
          teamsWithTool.push(teamTools[j].teamID);
        }
      }
    }

    // Ensure there's no duplicate teamIDs
    teamsWithTool = _.uniq(teamsWithTool);

    // Get the filtered teams
    const teams = [];
    for (let i = 0; i < teamsWithTool.length; i++) {
      for (let j = 0; j < team.length; j++) {
        if (teamsWithTool[i] === team[j]._id) {
          teams.push(team[j]);
        }
      }
    }

    return teams;
  }

  /**
   * Supplies all the possible values to make it work with semantic UI's dropdown
   * @param data The values
   * @returns {Array} Returns an array that can be used by semantic UI's dropdown
   */
  dropdownValues(data) {
    let values = _.map(data, 'name');
    const categories = _.flattenDeep(values);
    values = _.uniq(categories);

    let info = [];

    for (let i = 0; i < values.length; i++) {
      info.push({
        key: values[i],
        text: values[i],
        value: values[i],
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

}

export default TeamFinderFilter;
