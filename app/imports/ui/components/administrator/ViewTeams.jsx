import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { ZipZap } from 'meteor/udondan:zipzap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import FormCheck from 'react-bootstrap/FormCheck';

import { Teams } from '../../../api/team/TeamCollection';
import ViewTeamExample from './ViewTeam';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';

const getTeamMembers = (team) => {
  const teamID = team._id;
  const teamParticipants = TeamParticipants.find({ teamID }).fetch();
  const memberNames = teamParticipants.map((tp) => {
    const fullName = Participants.getFullName(tp.participantID);
    const participant = Participants.findDoc(tp.participantID);
    const gitHub = participant.gitHub;
    return `${fullName}, (${gitHub})`;
  });
  return _.uniq(memberNames);
};

const ViewTeams = ({
  participants,
  teams,
  teamChallenges,
  teamParticipants,
}) => {
  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [filterValue, setFilterValue] = useState('None');
  // console.log(filteredTeams);
  const stickyStyle = {
    position1: '-webkit-sticky',
    position: 'sticky',
    top: '6.5rem',
  };

  const teamIsCompliant = (teamID) => {
    const tps = teamParticipants.filter((tp) => tp.teamID === teamID);
    let compliant = true;
    tps.forEach((tp) => {
      const participant = participants.filter(
        (p) => p._id === tp.participantID,
      );
      // console.log(participant);
      compliant = compliant && participant[0].isCompliant;
    });
    return compliant;
  };

  const handleChange = ({ target: { value } }) => {
    setFilterValue(value);
    const remainingTeams = [];
    const localTeams = filteredTeams;
    switch (value) {
      case 'Challenge':
        localTeams.forEach((team) => {
          const challengeIDs = teamChallenges.filter(
            (tc) => tc.teamID === team._id,
          );
          if (challengeIDs.length === 0) {
            remainingTeams.push(team);
          }
        });
        setFilteredTeams(remainingTeams);
        break;
      case 'NonCompliant':
        localTeams.forEach((team) => {
          if (!teamIsCompliant(team._id)) {
            remainingTeams.push(team);
          }
        });
        setFilteredTeams(remainingTeams);
        break;
      case 'NoDevPost':
        localTeams.forEach((team) => {
          if (!team.devPostPage) {
            remainingTeams.push(team);
          }
        });
        setFilteredTeams(remainingTeams);
        break;
      case 'NoGitHub':
        localTeams.forEach((team) => {
          if (!team.gitHubRepo) {
            remainingTeams.push(team);
          }
        });
        setFilteredTeams(remainingTeams);
        break;
      default:
        setFilteredTeams(teams);
    }
  };

  const handleDownload = () => {
    const zip = new ZipZap();
    const dir = 'hacchui-team-captains';
    const fileName = `${dir}/${moment().format(
      databaseFileDateFormat,
    )}-team-captains.txt`;
    const localTeams = filteredTeams;
    const ownerIDs = localTeams.map((t) => t.owner);
    const emails = [];
    ownerIDs.forEach((id) => {
      const pArr = participants.filter((p) => p._id === id);
      emails.push(pArr[0].username);
    });
    zip.file(fileName, emails.join('\n'));
    zip.saveAs(`${dir}.zip`);
  };

  return (
    <Container centered>
      <Row>
        <Col width={16}>
          <div
            style={{
              backgroundColor: '#E5F0FE',
              padding: '1rem 0rem',
              margin: '2rem 0rem',
              borderRadius: '2rem',
              textAlign: 'center',
            }}
          >
            <h2>View Teams ({filteredTeams.length})</h2>
          </div>
        </Col>
      </Row>
      <Row>
        <Button onClick={handleDownload}>Download Team Captain emails</Button>
      </Row>
      <Row>
        <Col width={4}>
          <Container style={stickyStyle}>
            <Form>
              <Form.Group>Select a filter</Form.Group>
              {/* <Form.Field> */}
              {/*  <Checkbox checked={filterValue === 'Challenge'} label="No challenge" onChange={handleChange} */}
              {/*            radio name='checkboxRadioGroup' value='Challenge' */}
              {/*  /> */}
              {/* </Form.Field> */}
              <Form.Group>
                <FormCheck
                  type="radio"
                  label="Non Compliant"
                  radio
                  name="checkboxRadioGroup"
                  value="NonCompliant"
                  checked={filterValue === 'NonCompliant'}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="radio"
                  label="No devpost"
                  radio
                  name="checkboxRadioGroup"
                  value="NoDevPost"
                  checked={filterValue === 'NoDevPost'}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="radio"
                  label="No GitHub"
                  radio
                  name="checkboxRadioGroup"
                  value="NoGitHub"
                  checked={filterValue === 'NoGitHub'}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="radio"
                  label="None"
                  radio
                  name="checkboxRadioGroup"
                  value="None"
                  checked={filterValue === 'None'}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Container>
        </Col>
        <Col width={12}>
          <Stack gap={5}>
            {filteredTeams.map((team) => (
              <ViewTeamExample
                key={team._id}
                team={team}
                teamMembers={getTeamMembers(team)}
                isCompliant={teamIsCompliant(team._id)}
              />
            ))}
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

ViewTeams.propTypes = {
  participants: PropTypes.arrayOf(PropTypes.object),
  teams: PropTypes.arrayOf(PropTypes.object),
  teamChallenges: PropTypes.arrayOf(PropTypes.object),
  teamParticipants: PropTypes.arrayOf(PropTypes.object),
};

export default withTracker(() => {
  const teams = Teams.find({}, { sort: { name: 1 } }).fetch();
  const teamChallenges = TeamChallenges.find({}).fetch();
  const teamParticipants = TeamParticipants.find({}).fetch();
  const participants = Participants.find({}).fetch();
  return {
    participants,
    teams,
    teamChallenges,
    teamParticipants,
  };
})(ViewTeams);
