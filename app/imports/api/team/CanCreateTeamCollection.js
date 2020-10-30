import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class CanCreateTeamCollection extends BaseCollection {
  constructor() {
    super('CanCreateTeam', new SimpleSchema({
      canCreateTeams: { type: Boolean },
    }));
  }

  /**
   * Defines the state for creating teams.
   * @param canCreateTeams {Boolean} the state for creating teams (optional defaults to true).
   */
  define({ canCreateTeams = true }) {
    return this._collection.insert({ canCreateTeams });
  }

  update(docID, { canCreateTeams }) {
    // console.log('CanCreateTeams.update', docID, canCreateTeams);
    this.assertDefined(docID);
    const updateData = {
      canCreateTeams,
    };
    this._collection.update(docID, { $set: updateData });
  }
}

export const CanCreateTeams = new CanCreateTeamCollection();
