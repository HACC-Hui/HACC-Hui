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
      const participantFirstName = data[i].firstName;
      const participantLastName = data[i].lastName;
      const firstLowercase = participantFirstName.toString().toLowerCase();
      const lastLowercase = participantLastName.toString().toLowerCase();
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
    if (value === 'participants') {
      return _.orderBy(data, ['name'], ['asc']);
    }
    return data;
  }

  /**
   * Filters through the data based on the user selection. By default, if no option is selected it
   * returns the original data
   * @param value The inputs given
   * @param allSkills All the available skills
   * @param participantSkill Each participants' skills
   * @param participant The participants
   * @returns {[]|*} Returns the filtered array
   */
  filterBySkills(value, allSkills, participantSkill, participant) {

    // if there are no skills selected
    if (value.length === 0) {
      return participant;
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

    // get participantIDs for those that have the skills
    let participantsWithSkill = [];
    for (let i = 0; i < skillID.length; i++) {
      for (let j = 0; j < participantSkill.length; j++) {
        if (skillID[i] === participantSkill[j].skillID) {
          participantsWithSkill.push(participantSkill[j].participantID);
        }
      }
    }

    // Ensure there's no duplicate participantIDs
    participantsWithSkill = _.uniq(participantsWithSkill);

    // Get the filtered participants
    const participants = [];
    for (let i = 0; i < participantsWithSkill.length; i++) {
      for (let j = 0; j < participant.length; j++) {
        if (participantsWithSkill[i] === participant[j]._id) {
          participants.push(participant[j]);
        }
      }
    }

    return participants;
  }

  /**
   * Filters through the data based on the user selection. By default, if no option is selected it
   * returns the original data
   * @param value The inputs given
   * @param allTools All the available tools
   * @param participantTools Each teams' tools
   * @param participant The teams
   * @returns {[]|*} Returns the filtered array
   */
  filterByTools(value, allTools, participantTools, participant) {

    // if there are no tools selected
    if (value.length === 0) {
      return participant;
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

    // get participantIDs for those that have the tools
    let participantsWithTool = [];
    for (let i = 0; i < toolID.length; i++) {
      for (let j = 0; j < participantTools.length; j++) {
        if (toolID[i] === participantTools[j].toolID) {
          participantsWithTool.push(participantTools[j].participantID);
        }
      }
    }

    // Ensure there's no duplicate participantIDs
    participantsWithTool = _.uniq(participantsWithTool);

    // Get the filtered participants
    const participants = [];
    for (let i = 0; i < participantsWithTool.length; i++) {
      for (let j = 0; j < participant.length; j++) {
        if (participantsWithTool[i] === participant[j]._id) {
          participants.push(participant[j]);
        }
      }
    }
    return participants;
  }

  /**
   * Filters through the data based on the user selection. By default, if no option is selected it
   * returns the original data
   * @param value The inputs given
   * @param allChallenges All the available challenges
   * @param participantChallenge Each participants' challenge(s)
   * @param participant The participants
   * @returns {[]|*} Returns the filtered array
   */
  filterByChallenge(value, allChallenges, participantChallenge, participant) {

    // if there are no tools selected
    if (value.length === 0) {
      return participant;
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

    // get participantIDs for those that have the challenges
    let participantsWithChallenge = [];
    for (let i = 0; i < challengeID.length; i++) {
      for (let j = 0; j < participantChallenge.length; j++) {
        if (challengeID[i] === participantChallenge[j].challengeID) {
          participantsWithChallenge.push(participantChallenge[j].participantID);
        }
      }
    }

    // Ensure there's no duplicate teamIDs
    participantsWithChallenge = _.uniq(participantsWithChallenge);

    // Get the filtered participants
    const participants = [];
    for (let i = 0; i < participantsWithChallenge.length; i++) {
      for (let j = 0; j < participant.length; j++) {
        if (participantsWithChallenge[i] === participant[j]._id) {
          participants.push(participant[j]);
        }
      }
    }
    return participants;
  }

  /**
   * Filters through the data based on the user selection. By default, if no option is selected it
   * returns the original data
   * @param value The inputs given
   * @param allInterests All the available interests
   * @param participantInterests Each participants' interest(s)
   * @param participant The participants
   * @returns {[]|*} Returns the filtered array
   */
  filterByInterest(value, allInterests, participantInterests, participant) {

    // if there are no tools selected
    if (value.length === 0) {
      return participant;
    }

    // convert from interestName --> interestID
    const interestID = [];
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < allInterests.length; j++) {
        if (value[i] === allInterests[j].title) {
          interestID.push(allInterests[j]._id);
        }
      }
    }

    // get participantIDs for those that have the challenges
    let participantsWithInterest = [];
    for (let i = 0; i < interestID.length; i++) {
      for (let j = 0; j < participantInterests.length; j++) {
        if (interestID[i] === participantInterests[j].interestID) {
          participantsWithInterest.push(participantInterests[j].participantID);
        }
      }
    }

    // Ensure there's no duplicate teamIDs
    participantsWithInterest = _.uniq(participantsWithInterest);

    // Get the filtered participants
    const participants = [];
    for (let i = 0; i < participantsWithInterest.length; i++) {
      for (let j = 0; j < participant.length; j++) {
        if (participantsWithInterest[i] === participant[j]._id) {
          participants.push(participant[j]);
        }
      }
    }
    return participants;
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
