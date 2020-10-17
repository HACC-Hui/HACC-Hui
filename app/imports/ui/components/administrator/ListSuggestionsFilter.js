import { _ } from 'lodash';

class ListSuggestionsFilter {

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
      console.log(data[i]);
      const suggestionName = data[i].name;
      const suggestionDescription = data[i].description;
      const nameLowercase = suggestionName.toString().toLowerCase();
      const descriptionLowercase = suggestionDescription.toString().toLowerCase();
      if (nameLowercase.includes(searchQuery.toString().toLowerCase())) {
        list.push(data[i]);
      } else if (descriptionLowercase.includes(searchQuery.toString().toLowerCase())) {
        list.push(data[i]);
      } else if (searchQuery.toString().toLowerCase() === `${nameLowercase} ${descriptionLowercase}`) {
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
    if (value === 'names') {
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
  typeResults(suggestions, type) {

    // if there are no skills selected
    if (type.length === 0) {
      return suggestions;
    }

    if (type === 'All') {
      return suggestions;
    }

    // Get the filtered suggestions
    const validSuggestions = [];
    for (let i = 0; i < suggestions.length; i++) {
      if (suggestions[i].type === type) {
        validSuggestions.push(suggestions[i]);
      }
    }

    return validSuggestions;
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

export default ListSuggestionsFilter;
