import React from 'react';
import { Meteor } from 'meteor/meteor'
import { Form, Grid, Button, Dropdown, Segment, Header } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { Developers } from '../../api/user/DeveloperCollection';


class DeletionReason extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */



  state = {typeData:''}
  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  handleSubmit = () => {

    const id = Meteor.user().username;
    console.log(id);
    removeItMethod.call({ collectionName: Developers.getCollectionName(), instance: Developers.getID(id) });

  }

  render() {
    const { typeData } = this.state
    return (
        <div style={ {backgroundColor: '#C4C4C4' } }>
          <Grid container centered>
            <Grid.Column>
              <Form onSubmit ={this.handleSubmit}>
                <Form.TextArea
                    name='typeData'
                    value={typeData}
                    label="Tell us why you're leaving!"
                    onChange={this.handleChange}
                />
                <Form.Button content='Submit'/>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}
export default DeletionReason;
