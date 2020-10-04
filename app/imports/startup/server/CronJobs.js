import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { WantsToJoin } from '../../api/team/WantToJoinCollection';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { TeamParticipants } from '../../api/team/TeamParticipantCollection';
import { sendDM2ParticipantMethod } from '../../api/slackbot/Slack.methods';

SyncedCron.add({
  name: 'Check for participants wanting to join team',
  schedule(parser) {
    // parser is a later.parse object
    const interval = Meteor.settings.pollingInterval || 5;
    return parser.text(`every ${interval} minutes`);
  },
  job() {
    const wantsToJoin = WantsToJoin.find({}).fetch();
    _.forEach(wantsToJoin, (join) => {
      const { teamID, participantID } = join;
      const participant = Participants.findDoc(participantID);
      const team = Teams.findDoc(teamID);
      const teamMemberIDs = TeamParticipants.find({ teamID }).fetch();
      // console.log(team, teamMemberIDs);
      teamMemberIDs.push(team.owner);
      // console.log(participant);
      teamMemberIDs.forEach((memberID) => {
        const message = `${participant.firstName} ${participant.lastName} would like to join your team.`;
        if (Participants.isDefined(memberID)) {
          const username = Participants.findDoc(memberID).username;
          sendDM2ParticipantMethod.call({ participant: username, message }, (error) => {
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
