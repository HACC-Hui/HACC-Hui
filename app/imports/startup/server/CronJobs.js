import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { WantsToJoin } from '../../api/team/WantToJoinCollection';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { TeamParticipants } from '../../api/team/TeamParticipantCollection';
import { sendDM2AdministratorsMethod, sendDM2ParticipantMethod } from '../../api/slackbot/Slack.methods';
import { MinorParticipants } from '../../api/user/MinorParticipantCollection';
import { TeamInvitations } from '../../api/team/TeamInvitationCollection';

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

SyncedCron.add({
  name: 'Check for minors signing up.',
  schedule(parser) {
    // parser is a later.parse object
    const interval = Meteor.settings.pollingInterval || 5;
    return parser.text(`every ${interval} minutes`);
  },
  job() {
    const newMinors = MinorParticipants.find({ sentAdminDM: false }).fetch();
    _.forEach(newMinors, (minor) => {
      const docID = minor._id;
      const { participantID, parentFirstName, parentLastName, parentEmail } = minor;
      const minorFullName = Participants.getFullName(participantID);
      const message = `A minor ${minorFullName} has joined HACC 2020. Their parent/guardian is
      ${parentFirstName} ${parentLastName}, email address is ${parentEmail}.`;
      sendDM2AdministratorsMethod.call({ message });
      MinorParticipants.update(docID, { sentAdminDM: true });
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
        const { teamID, participantID } = join;
        const developer = Participants.findDoc(participantID);
        const team = Teams.findDoc(teamID);
        const message = `Team ${team.name} has sent you an invitation. Check out your team invitations in HACC HUI!`;
        if (Participants.isDefined(participantID)) {
          const username = developer.username;
          sendDM2ParticipantMethod.call({ participant: username, message }, (error) => {
            if (error) {
              console.error('Failed to send DM. ', error);
            }
          });
        }
        TeamInvitations.update(join._id, { team: join.teamID, participant: join.participantID, sentDM: true });
      }
    });
  },
});
