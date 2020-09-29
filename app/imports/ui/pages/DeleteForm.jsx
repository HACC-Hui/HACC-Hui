import React from 'react';
import { Grid, Header, Form, Button, Checkbox, Confirm, Dropdown } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { NavLink } from 'react-router-dom';
import { userInteractionDefineMethod } from '../../api/user/UserInteractionCollection.methods';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { Developers } from '../../api/user/DeveloperCollection';

class DeleteForm extends React.Component {
    state = { response1: '', response2: '', response3: '', response4: '', open: false }

    show = () => this.setState({ open: true })

    handleConfirm = () => this.setState({ open: false })

    handleCancel = () => this.setState({ open: false })

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    }

    handleSubmit = () => {
        const { response1, response2, response3, response4 } = this.state;
        console.log(`Response 1:${response1}`);
        console.log(`Response 2:${response2}`);
        console.log(`Response 3:${response3}`);
        console.log(`Response 4:${response4}`);
        // eslint-disable-next-line max-len
        this.setState({ submittedResponse1: response1, submittedResponse2: response2, submittedResponse3: response3, submittedResponse4: response4 });

        const id = Meteor.user().username;
        console.log(id);

        const responses = [response1, response2, response3, response4];
        const date = new Date();
        console.log(date);
        const userInteraction = { username: Meteor.user().username,
            type: 'Account Deletion Form',
            typeData: responses,
            'typeData.$': 'String',
            timestamp: date };

        userInteractionDefineMethod.call(userInteraction);

        removeItMethod.call({ collectionName: Developers.getCollectionName(), instance: Developers.getID(id) });

    }

  render() {
      // eslint-disable-next-line max-len
        const { response1, response2, response3, response4, submittedResponse1, submittedResponse2, submittedResponse3, submittedResponse4 } = this.state;
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Delete Form</Header>
              <Form onSubmit={this.handleSubmit}>
                <label>Questions</label>
                <Form.Field
                    name='response1'
                    value={'No challenge was interesting.'}
                    control={Checkbox}
                    label={<label>No challenge was interesting.</label>}
                    onChange={this.handleChange}
                />
                <Form.Field
                    name='response2'
                    value={'Couldn\'t find a team I liked being on.'}
                    control={Checkbox}
                    label={<label>Couldn&apos;t find a team I liked being on.</label>}
                    onChange={this.handleChange}
                />
                <Form.Field
                    name='response3'
                    value={'Not enough time to fully participate in the event.'}
                    control={Checkbox}
                    label={<label>Not enough time to fully participate in the event.</label>}
                    onChange={this.handleChange}
                />
                <Form.TextArea name='response4' value={response4} onChange={this.handleChange} label='Other' />
                  <div>
                      <Button content='Submit' onClick={this.show} fluid color='red' >
                          Delete Account & Submit Form
                      </Button>
                      <Confirm
                          open={this.state.open}
                          content='Your account has successfully been deleted, goodbye...'
                          onConfirm={this.handleConfirm}
                          as={NavLink} exact to="/signout"
                      />
                  </div>
            </Form>
          </Grid.Column>
        </Grid>
    );
  }
}

export default DeleteForm;
