import React, { useMemo } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { paleBlueStyle } from '../../styles';
import ProfileCard from '../../components/participant/ProfileCard';
import TeamCard from '../../components/participant/TeamCard';
import { ROUTES } from '../../../startup/client/route-constants';

const ProfilePage = () => {
  const {
    participant,
    participantID,
    devChallenges,
    devSkills,
    devTools,
    teams,
  } = useTracker(() => {
    const participantDoc = Participants.findDoc({ userID: Meteor.userId() });
    const participantIDDoc = participantDoc._id;
    const devChallengesDocs = ParticipantChallenges.find({
      participantIDDoc,
    }).fetch();
    const devSkillsDocs = ParticipantSkills.find({ participantIDDoc }).fetch();
    const devToolsDocs = ParticipantTools.find({ participantIDDoc }).fetch();
    const teamParts = TeamParticipants.find({ participantIDDoc }).fetch();
    const teamsDocs = teamParts.map((tP) => Teams.findDoc(tP.teamID));

    return {
      participant: participantDoc,
      participantID: participantIDDoc,
      devChallenges: devChallengesDocs,
      devSkills: devSkillsDocs,
      devTools: devToolsDocs,
      teams: teamsDocs,
    };
  }, []);

  const model = useMemo(() => {
    const m = participant;
    m.challenges = devChallenges.map((challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    m.skills = devSkills;
    m.tools = devTools;
    return m;
  }, [participant, devChallenges, devSkills, devTools]);

  return (
    <Container id="your-profile-page" style={{ marginTop: '2rem' }}>
      <section
        style={{ ...paleBlueStyle, marginBottom: '2rem', padding: '2rem' }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Your Profile
        </h1>
        <ProfileCard model={model} />
        <div style={{ display: 'grid' }}>
          <Button
            as={Link}
            to={ROUTES.EDIT_PROFILE}
            size="lg"
            variant="primary"
            style={{ fontWeight: 'bold' }}
          >
            Edit Profile
          </Button>
        </div>
      </section>
      <section style={{ ...paleBlueStyle, padding: '2rem' }}>
        <h2 style={{ textAlign: 'center' }}>Team Membership</h2>
        {teams.length > 0 ? (
          teams.map((team) => (
            <TeamCard
              team={team}
              key={team._id}
              participantID={participantID}
            />
          ))
        ) : (
          <h4>You aren&apos;t in any teams...</h4>
        )}
      </section>
    </Container>
  );
};

export default withRouter(withAllSubscriptions(ProfilePage));
