import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { WantsToJoin } from '../../api/team/WantToJoinCollection';
import { Developers } from '../../api/user/DeveloperCollection';
import { Teams } from '../../api/team/TeamCollection';
import { TeamDevelopers } from '../../api/team/TeamDeveloperCollection';
import { sendDM2DeveloperMethod } from '../../api/slackbot/Slack.methods';
import { TeamInvitations } from '../../api/team/TeamInvitationCollection';

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
      // console.log(team, teamMemberIDs);
      teamMemberIDs.push(team.owner);
      // console.log(developer);
      teamMemberIDs.forEach((memberID) => {
        const message = `${developer.firstName} ${developer.lastName} would like to join your team.`;
        if (Developers.isDefined(memberID)) {
          const username = Developers.findDoc(memberID).username;
          sendDM2DeveloperMethod.call({ developer: username, message }, (error) => {
            if (error) {
              console.error('Failed to send DM. ', error);
            }
          });
        }
      });
      WantsToJoin.removeIt(join._id);
    });
  },
});

SyncedCron.add({
  name: 'Check for invitations from teams',
  schedule(parser) {
    // parser is a later.parse object
    const interval = Meteor.settings.pollingInterval || 5;
    return parser.text(`every ${interval} minutes`);
  },
  job() {
    const teamInvite = TeamInvitations.find({}).fetch();
    _.forEach(teamInvite, (join) => {
      if (!join.sentDM) {
        const { teamID, developerID } = join;
        const developer = Developers.findDoc(developerID);
        const team = Teams.findDoc(teamID);
        const message = `Team ${team.name} has sent you an invitation. Check out your team invitations in HACC HUI!`;
        if (Developers.isDefined(developerID)) {
          const username = developer.username;
          sendDM2DeveloperMethod.call({ developer: username, message }, (error) => {
            if (error) {
              console.error('Failed to send DM. ', error);
            }
          });
        }
        TeamInvitations.update(join._id, { team: join.teamID, developer: join.developerID, sentDM: true });
      }
    });
  },
});
