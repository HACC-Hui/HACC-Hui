import React from 'react';
import { Grid, Segment, Header, Table, Button } from 'semantic-ui-react';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class ManageHACC extends React.Component {

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (
        <div style={{ backgroundColor: '#C4C4C4', paddingBottom: '50px' }}>
          <Grid container centered>
            <Grid.Column>
              <div style={{
                backgroundColor: '#393B44', padding: '1rem 0rem', margin: '2rem 0rem',
                borderRadius: '2rem',
              }}>
                <Header as="h2" textAlign="center" inverted>Manage HACC</Header>
              </div>
              <Segment style={{
                borderRadius: '1rem',
                backgroundColor: '#393B44',
              }} className={'teamCreate'}>
                <Header as="h2" textAlign="center" inverted>Challenges</Header>
                <Table>
                  <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Interests</Table.HeaderCell>
                    <Table.HeaderCell>Submission Detail</Table.HeaderCell>
                    <Table.HeaderCell>Pitch</Table.HeaderCell>
                  </Table.Row>
                  </Table.Header>
                </Table>
                <div align='center'>
                <Button style={{
                  color: 'white', backgroundColor: '#24252B',
                  margin: '2rem 0rem',
                }}>Add Challenge</Button>
                </div>
                <Header as="h2" textAlign="center" inverted>Skills</Header>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                </Table>
                <div align='center'>
                <Button style={{
                  color: 'white', backgroundColor: '#24252B',
                  margin: '2rem 0rem',
                }}>Add Skill</Button>
                </div>
                <Header as="h2" textAlign="center" inverted>Tools</Header>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                </Table>
                <div align='center'>
                <Button style={{
                  color: 'white', backgroundColor: '#24252B',
                  margin: '2rem 0rem',
                }}>Add Tool</Button>
                </div>
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

export default ManageHACC;
