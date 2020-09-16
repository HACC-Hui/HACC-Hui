import _ from 'lodash';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { WantsToJoin } from '../../api/team/WantToJoinCollection';
import { Developers } from '../../api/user/DeveloperCollection';
import { Teams } from '../../api/team/TeamCollection';
import { TeamDevelopers } from '../../api/team/TeamDeveloperCollection';

SyncedCron.add({
  name: 'Check for developers wanting to join team',
  schedule(parser) {
    // parser is a later.parse object
    return parser.text('every 2 minutes'); // TODO change the value to something more realistic
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
