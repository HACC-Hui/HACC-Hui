import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Container, Header, Image, Menu, Icon, Dropdown, Grid, List } from 'semantic-ui-react';

/**
 * **Deprecated**
 *
 *  Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx.
 *  @memberOf ui/components
 */
class ChallengesAdmin extends React.Component {
  render() {

    const title={
      marginLeft: '-1000px',
    }
    const description={
      width: '25%',
    }
    const interest={
      width: '25%',
    }
    const submissionDetail={
      width: '25%',
    }
    const pitch={
      width: '25%',
    }


    return (
        <Table.Row>
          <Table.Cell>
            {this.props.challenge.title}
            <button className="ui button" style ={{margin: 10}}>
              <Link to={`/editChallenges/${this.props.challenge._id}`}>Edit</Link>
            </button>
          </Table.Cell>
          <Table.Cell>{this.props.challenge.description}</Table.Cell>
          <Table.Cell>{this.props.interest}</Table.Cell>
          <Table.Cell><a href={this.props.challenge.submissionDetail}>{this.props.challenge.submissionDetail}</a></Table.Cell>
          <Table.Cell><a href={this.props.challenge.pitch}>{this.props.challenge.pitch}</a></Table.Cell>
        </Table.Row>
    );
  }
}



// Require a document to be passed to this component.
ChallengesAdmin.propTypes = {
  challenge: PropTypes.object.isRequired,
  interest: PropTypes.string.isRequired,
};

export default withRouter(ChallengesAdmin);