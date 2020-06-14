import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Developers } from '../user/DeveloperCollection';
import { Teams } from './TeamCollection';

class TeamDeveloperCollection extends BaseCollection {
  constructor() {
    super('TeamDeveloper', new SimpleSchema({
      teamID: { type: SimpleSchema.RegEx.Id },
      developerID: { type: SimpleSchema.RegEx.Id },
    }));
  }

  define({ team, developer }) {
    const teamID = Teams.getID(team);
    const developerID = Developers.getID(developer);
    return this._collection.insert({ teamID, developerID });
  }

  update(docID, { team, developer }) {
    this.assertDefined(docID);
    const updateData = {};
    if (developer) {
      updateData.developerID = Developers.getID(developer);
    }
    if (team) {
      updateData.teamID = Teams.getID(team);
    }
    this._collection.update(docID, { $set: updateData });
  }

  removeIt(docID) {
    super.removeIt(docID);
  }

  removeDeveloper(developer) {
    const developerID = Developers.getID(developer);
    this._collection.remove({ developerID });
  }

  removeTeam(team) {
    const teamID = Teams.getID(team);
    this._collection.remove({ teamID });
  }
}

export const TeamDevelopers = new TeamDeveloperCollection();
