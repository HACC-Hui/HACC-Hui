import React from 'react';
import { Grid, Header, Form, Button, Checkbox } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { Developers } from '../../api/user/DeveloperCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */

const schema = new SimpleSchema({
    response1: String,
    response2: String,
    response3: String,
    response4: String,
});

class DeleteForm extends React.Component {
    state = { response1: '0', response2: '0', response3: '0', response4: '' }

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

        const id = Meteor.userId();
        console.log(id);
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
                    label={<label>Couldn't find a team I liked being on.</label>}
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
                <Button content='Submit' fluid color='red'>Delete Account & Submit Form</Button>
            </Form>
          </Grid.Column>
        </Grid>
    );
  }
}

export default DeleteForm;
