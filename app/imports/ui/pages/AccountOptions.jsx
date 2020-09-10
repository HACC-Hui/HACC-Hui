import React from 'react';
import { Grid, Button, Header, Card, Icon, Image, Modal } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import swal from 'sweetalert';
import {
    AutoForm,
    ErrorsField,
    SubmitField,
    TextField,
    LongTextField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { NavLink } from 'react-router-dom';
import { createDeveloperMethod } from '../../api/user/AccountOptions.methods';
import { Developers } from '../../api/user/DeveloperCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Challenges } from '../../api/challenge/ChallengeCollection';

import { userInteractionTypes } from '../../api/user/UserInteractionCollection';
import { demographicLevels } from '../../api/level/Levels';
import { makeSampleSkillSlugArray } from '../../api/skill/SampleSkills';
/**
 * Renders the Page for Account Options. **deprecated**
 * @memberOf ui/pages
 */

const schema = new SimpleSchema({
    username: { type: String },
    slugID: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    demographicLevel: { type: String, allowedValues: demographicLevels, optional: true },
    linkedIn: { type: String, optional: true },
    gitHub: { type: String, optional: true },
    website: { type: String, optional: true },
    aboutMe: { type: String, optional: true },
    userID: { type: SimpleSchema.RegEx.Id, optional: true },
    lookingForTeam: { type: Boolean, optional: true },
    isCompliant: { type: Boolean, optional: true },
});

function AccountOptions() {

    const [open, setOpen] = React.useState(false);
    /* submit = (formRef) => {
        const username = 'cmoore@hawaii.edu';
        const firstName = 'Cam';
        const lastName = 'Moore';
        const demographicLevel = demographicLevels[0];
        const lookingForTeam = true;
        const skills = makeSampleSkillSlugArray(2);
        const definitionData = { username, firstName, lastName, demographicLevel,
            lookingForTeam, skills };

        // const collectionName = Developers.getCollectionName();
        // console.log(collectionName);

        defineMethod.call({ collectionName: Developers.getCollectionName(), definitionData: definitionData },
            (error) => {
                if (error) {
                    swal('Error', error.message, 'error');
                    // console.error(error.message);
                } else {
                    swal('Success', 'Item added successfully', 'success');
                    formRef.reset();
                    // console.log('Success');
                }
            });
  } */
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Account Options</Header>
              <Card fluid>
                  <Image src='https://thepowerofthedream.org/wp-content/uploads/2015/09/generic-profile-picture.jpg'
                         floated='left' size='small' wrapped ui={true} />
                  <Card.Content>
                      <Card.Header>{Meteor.user().username}</Card.Header>
                      <Card.Meta>
                          <span className='date'>Joined (date)</span>
                      </Card.Meta>
                      <Card.Description>
                          User Bio Info
                      </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                      <a>
                          <Icon name='users' />
                          (Team Name Goes Here)
                      </a>
                  </Card.Content>
                  <Card.Content extra>
                      <a>
                          <Icon name='setting' />
                          <Modal
                              open={open}
                              trigger={<Button color='red'>Delete Account</Button>}
                              onClose={() => setOpen(false)}
                              onOpen={() => setOpen(true)}
                          >
                              <Modal.Header>Account Removal Form</Modal.Header>
                              <Modal.Content>
                                  <p>
                                      {/* eslint-disable-next-line max-len */}
                                      Before you go please fill out this questionnaire so we can improve the HACC experience in the future.
                                  </p>
                              </Modal.Content>
                              <Modal.Actions>
                                  <Button color='red' onClick={() => setOpen(false)}>
                                      <Icon name='remove' /> Cancel
                                  </Button>
                                  <Button color='green' onClick={() => setOpen(false)} as={NavLink} exact to ="/deleteform">
                                      <Icon name='checkmark' /> Form & Delete
                                  </Button>
                              </Modal.Actions>
                          </Modal>
                      </a>
                  </Card.Content>
              </Card>
          </Grid.Column>
        </Grid>
    );
}

export default AccountOptions;
