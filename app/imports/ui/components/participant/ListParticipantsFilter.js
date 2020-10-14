import { _ } from 'lodash';

class ListParticipantsFilter {

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
      const devFirstName = data[i].firstName;
      const devLastName = data[i].lastName;
      const firstLowercase = devFirstName.toString().toLowerCase();
      const lastLowercase = devLastName.toString().toLowerCase();
      if (firstLowercase.includes(searchQuery.toString().toLowerCase())) {
        list.push(data[i]);
      } else if (lastLowercase.includes(searchQuery.toString().toLowerCase())) {
        list.push(data[i]);
      } else if (searchQuery.toString().toLowerCase() === `${firstLowercase} ${lastLowercase}`) {
        list.push(data[i]);
      } else if (data[i].username.includes(searchQuery.toString().toLowerCase())) {
        list.push(data[i]);
      }
    }

    return list;
  }

  /**
   *
   * @param data The data we want to sort
   * @param value The value we want to sort by
   * @returns {Array|*} Returns the sorted array
   */
  sortBy(data, value) {
    if (value === 'devs') {
      return _.orderBy(data, ['name'], ['asc']);
    }
    return data;
  }

  /**
   * Filters through the data based on the user selection. By default, if no option is selected it
   * returns the original data
   * @param value The inputs given
   * @param allSkills All the available skills
   * @param devSkill Each devs' skills
   * @param dev The devs
   * @returns {[]|*} Returns the filtered array
   */
  filterBySkills(value, allSkills, devSkill, dev) {

    // if there are no skills selected
    if (value.length === 0) {
      return dev;
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

    // get devIDs for those that have the skills
    let devsWithSkill = [];
    for (let i = 0; i < skillID.length; i++) {
      for (let j = 0; j < devSkill.length; j++) {
        if (skillID[i] === devSkill[j].skillID) {
          devsWithSkill.push(devSkill[j].participantID);
        }
      }
    }

    // Ensure there's no duplicate devIDs
    devsWithSkill = _.uniq(devsWithSkill);

    // Get the filtered devs
    const devs = [];
    for (let i = 0; i < devsWithSkill.length; i++) {
      for (let j = 0; j < dev.length; j++) {
        if (devsWithSkill[i] === dev[j]._id) {
          devs.push(dev[j]);
        }
      }
    }

    return devs;
  }

  /**
   * Filters through the data based on the user selection. By default, if no option is selected it
   * returns the original data
   * @param value The inputs given
   * @param allTools All the available tools
   * @param devTools Each teams' tools
   * @param dev The teams
   * @returns {[]|*} Returns the filtered array
   */
  filterByTools(value, allTools, devTools, dev) {

    // if there are no tools selected
    if (value.length === 0) {
      return dev;
    }

    // convert from toolName --> toolID
    const toolID = [];
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < allTools.length; j++) {
        if (value[i] === allTools[j].name) {
          toolID.push(allTools[j]._id);
        }
      }
    }

    // get devIDs for those that have the tools
    let devsWithTool = [];
    for (let i = 0; i < toolID.length; i++) {
      for (let j = 0; j < devTools.length; j++) {
        if (toolID[i] === devTools[j].toolID) {
          devsWithTool.push(devTools[j].participantID);
        }
      }
    }

    // Ensure there's no duplicate devIDs
    devsWithTool = _.uniq(devsWithTool);

    // Get the filtered devs
    const devs = [];
    for (let i = 0; i < devsWithTool.length; i++) {
      for (let j = 0; j < dev.length; j++) {
        if (devsWithTool[i] === dev[j]._id) {
          devs.push(dev[j]);
        }
      }
    }
    return devs;
  }

  /**
   * Filters through the data based on the user selection. By default, if no option is selected it
   * returns the original data
   * @param value The inputs given
   * @param allChallenges All the available challenges
   * @param devChallenge Each devs' challenge(s)
   * @param dev The devs
   * @returns {[]|*} Returns the filtered array
   */
  filterByChallenge(value, allChallenges, devChallenge, dev) {

    // if there are no tools selected
    if (value.length === 0) {
      return dev;
    }

    // convert from challengeName --> challengeID
    const challengeID = [];
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < allChallenges.length; j++) {
        if (value[i] === allChallenges[j].title) {
          challengeID.push(allChallenges[j]._id);
        }
      }
    }

    // get devIDs for those that have the challenges
    let devsWithChallenge = [];
    for (let i = 0; i < challengeID.length; i++) {
      for (let j = 0; j < devChallenge.length; j++) {
        if (challengeID[i] === devChallenge[j].challengeID) {
          devsWithChallenge.push(devChallenge[j].participantID);
        }
      }
    }

    // Ensure there's no duplicate teamIDs
    devsWithChallenge = _.uniq(devsWithChallenge);

    // Get the filtered devs
    const devs = [];
    for (let i = 0; i < devsWithChallenge.length; i++) {
      for (let j = 0; j < dev.length; j++) {
        if (devsWithChallenge[i] === dev[j]._id) {
          devs.push(dev[j]);
        }
      }
    }
    return devs;
  }

  /**
   * Supplies all the possible values to make it work with semantic UI's dropdown
   * @param data The values
   * @returns {Array} Returns an array that can be used by semantic UI's dropdown
   */
  dropdownValues(data, mapValue) {
    let values = _.map(data, mapValue);
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
    return info;
  }
}

export default ListParticipantsFilter;
