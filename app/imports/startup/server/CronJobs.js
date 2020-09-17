import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { WantsToJoin } from '../../api/team/WantToJoinCollection';
import { Developers } from '../../api/user/DeveloperCollection';
import { Teams } from '../../api/team/TeamCollection';
import { TeamDevelopers } from '../../api/team/TeamDeveloperCollection';

SyncedCron.add({
  name: 'Check for developers wanting to join team',
  schedule(parser) {
    // parser is a later.parse object
    const interval = Meteor.settings.pollingInterval || 5;
    return parser.text(`every ${interval} minutes`);
  },
  job() {
    const wantsToJoin = WantsToJoin.find({}).fetch();
    _.forEach(wantsToJoin, (join) => {
      const { teamID, developerID } = join;
      const developer = Developers.findDoc(developerID);
      const team = Teams.findDoc(teamID);
      const teamMemberIDs = TeamDevelopers.find({ teamID }).fetch();
      teamMemberIDs.push(team.owner);
      console.log(teamMemberIDs, developer);
    });
  },
});
