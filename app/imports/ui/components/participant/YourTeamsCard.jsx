import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  Grid,
  Header,
  Image,
  Item,
  Icon,
  Button, Modal, Segment,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  TextField,
  ListField,
  ListItemField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

const schema = new SimpleSchema({
  participants: {
    type: Array,
    minCount: 1,
  },
  'participants.$': {
    type: Object,
  },
  'participants.$.email': {
    type: String,
    min: 3,
  },

});

class YourTeamsCard extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  /** On submit, insert the data.
   * @param formData {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  // eslint-disable-next-line no-unused-vars
  submit(formData, formRef) {

    // console.log('CreateTeam.submit', formData, this.props);

    const { participants } = formData;

    const participantCollection = Participants.dumpAll().contents;

    const foundParticipants = [];
    const participantList = [];

    // get all participant email and also the ones listed in form
    for (let i = 0; i < participants.length; i++) {
      participantList.push(participants[i].email);
      for (let j = 0; j < participantCollection.length; j++) {
        if (participants[i].email === participantCollection[j].username) {
          foundParticipants.push(participants[i].email);
        }
      }
    }

    // difference should be 0 if all the inputted participants are registered via slack
    const notFoundParticipants = _.difference(participantList, foundParticipants);

    // console.log('Not Found:', notFoundParticipants);

    // if they entered duplicates
    if (_.uniq(participantList).length !== participantList.length) {
      swal('Error',
          'Sorry, it seems like you entered a duplicate email.\n\nPlease check again.',
          'error');
      return;
    }

    // If we cannot find a participant's email
    if (notFoundParticipants.length > 0) {
      swal('Error',
          `Sorry, we could not find participant(s): \n${notFoundParticipants.join(', ')}
          \n\nPlease double check that their emails are inputted correctly and that they 
          have registered with the HACC-HUI Slackbot.`,
          'error');
      return;
    }

    // If the participant is already in the team OR user tries to invite themselves OR there is already an invitation
    const selfUser = Participants.findDoc({ userID: Meteor.userId() }).username;
    for (let i = 0; i < participantList.length; i++) {
      const participantDoc = Participants.findDoc({ username: participantList[i] });

      if (selfUser === participantList[i]) {
        swal('Error',
            'Sorry, you can\'t invite yourself!',
            'error');
        return;
      }
      if (typeof TeamParticipants.findOne({
        teamID: this.props.teams._id,
        developerID: participantDoc._id,
      }) !== 'undefined') {
        swal('Error',
            `Sorry, participant ${participantList[i]} is already in ${this.props.teams.name}!`,
            'error');
        return;
      }

      // check to see if the invitation was already issued
      for (let j = 0; j < this.props.teamInvitation.length; j++) {
        if (this.props.teamInvitation[j].teamID === this.props.teams._id &&
            this.props.teamInvitation[j].participantID === participantDoc._id) {
          swal('Error',
              `Sorry, an invitation to ${participantList[i]} was already issued!`,
              'error');
          return;
        }
      }
    }

    // IF WE WANT TO ISSUE DIRECT INVITE (THEY DON'T HAVE TO ACCEPT IT)

    // const teamDoc = Teams.findDoc(this.props.teams._id);
    // const team = teamDoc._id;
    // const developerDoc = Developers.findDoc({ username: participantList[i] });
    // const developer = developerDoc._id;
    // console.log(definitionData);
    // const addToTeam = TeamDevelopers.getCollectionName();
    //
    // defineMethod.call({ collectionName: addToTeam, definitionData: definitionData },
    //     (error) => {
    //       if (error) {
    //         swal('Error', error.message, 'error');
    //       } else {
    //         swal('Success',
    //             `You've successfully added participant(s):\n\n ${participantList.join(', ')}
    //           to ${this.props.teams.name}`,
    //             'success');
    //       }
    //     });

    // if there are no errors, we can then add everyone
    for (let i = 0; i < participantList.length; i++) {
      // const collectionName = WantsToJoin.getCollectionName();
      const teamDoc = Teams.findDoc(this.props.teams._id);
      const team = Slugs.getNameFromID(teamDoc.slugID);
      const participant = participantList[i];

      // console.log(developerDoc);
      // console.log(developer);

      const definitionData = {
        team,
        participant,
      };

      const collectionName2 = TeamInvitations.getCollectionName();
      // console.log(collectionName2, definitionData);
      defineMethod.call({ collectionName: collectionName2, definitionData }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success',
              `You've successfully invited participant(s):\n\n ${participantList.join(', ')}
              \nto ${this.props.teams.name}
              \n The participants can now look at 'Team Invitations' to accept it.`,
              'success');
        }
      });
    }

  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);

    return (
        <Item style={{ padding: '0rem 2rem 0rem 2rem' }}>
          <Item.Content>
            <Item.Header>
              <Header as={'h3'} style={{ color: '#263763', paddingTop: '2rem' }}>
                <Icon name='users' size='tiny'/>
                {this.props.teams.name}
              </Header>
            </Item.Header>
            <Item.Meta>
              <Grid columns='equal'>
                <Grid.Column>
                  <Image src={this.props.teams.image} rounded size='large'/>
                </Grid.Column>
                <Grid.Column>
                  <Header>Members</Header>
                  {this.props.teamParticipants.map((participant) => <p key={participant}>
                    {participant.firstName} {participant.lastName}</p>)}
                </Grid.Column>
              </Grid>
            </Item.Meta>
          </Item.Content>

          <Button id={this.props.teams._id} style={{ backgroundColor: 'transparent' }}>
            <Link to={`/interested-developers/${this.props.teams._id}`}>See interested
              developers</Link>
          </Button>
          <Modal
              closeIcon
              onClose={() => this.setState({ open: false })}
              onOpen={() => this.setState({ open: true })}
              open={this.state.open}
              trigger={
                <Button id={this.props.teams._id}
                        style={{ backgroundColor: 'transparent', color: '#4183C4' }}>
                  Invite Participants
                </Button>
              }
          >
            <Modal.Content
                style={{
                  background: 'none',
                  padding: 0,
                }}>
              <AutoForm ref={ref => {
                fRef = ref;
              }} schema={formSchema}
                        onSubmit={data => this.submit(data, fRef)}
              >
                <Segment style={{
                  borderRadius: '10px',
                }}>
                  <Grid columns={1} style={{ paddingTop: '20px' }}>
                    <Grid.Column style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                      <Header as="h2" textAlign="center">
                        Who would you like to invite to {this.props.teams.name}?
                      </Header>
                      <Header as={'h4'} textAlign={'center'}
                              style={{ paddingBottom: '2rem', marginTop: '0rem' }}>
                        Please make sure the email you input is the same as the ones they&apos;ve used to
                        make their Slack account.
                      </Header>
                      <ListField name="participants" label={'Enter each participant\'s email'}>
                        <ListItemField name="$">
                          <TextField showInlineError
                                     iconLeft='mail'
                                     name="email"
                                     label={'Email'}/>
                        </ListItemField>
                      </ListField>

                    </Grid.Column>
                  </Grid>
                  <div align='center'>
                    <Button
                        content="Invite"
                        labelPosition='right'
                        icon='checkmark'
                        positive
                        style={{ margin: '20px 0px' }}
                    />
                  </div>
                </Segment>
              </AutoForm>
            </Modal.Content>
          </Modal>

          <Button id={this.props.teams._id} style={{ backgroundColor: 'transparent' }}>
            <Link to={`/edit-team/${this.props.teams._id}`}>Edit Team</Link>
          </Button>
        </Item>
    );
  }
}

YourTeamsCard.propTypes = {
  teams: PropTypes.object.isRequired,
  teamParticipants: PropTypes.array.isRequired,
  teamInvitation: PropTypes.array.isRequired,
};

export default YourTeamsCard;
