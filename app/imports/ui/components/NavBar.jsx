import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { Participants } from '../../api/user/ParticipantCollection';

/**
 * The NavBar appears at the top of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
class NavBar extends React.Component {
  render() {
    let isCompliant = true;
    const isAdmin = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    const isParticipant = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);
    if (isParticipant) {
      const participant = Participants.findDoc({ userID: Meteor.userId() });
      isCompliant = participant.isCompliant;
    }
    return (
        <Menu attached="top" borderless inverted className={'navBar'}>
          <Menu.Item as={NavLink} activeClassName="" exact to={ROUTES.LANDING}>
            <Header inverted as='h1'>HACC-Hui</Header>
          </Menu.Item>
                {isParticipant ? (
                      [
                        <Menu.Item as={NavLink}
                           activeClassName="active"
                           disabled={!isCompliant}
                           exact
                           to={ROUTES.CREATE_TEAM}
                           key='team-creation'>Create a Team</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact
                           to={ROUTES.YOUR_PROFILE}
                           key='edit-profile'>Your Profile</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact
                           to={ROUTES.BEST_FIT}
                           key='list-teams'>List the Teams</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           disabled={!isCompliant}
                           exact
                           to={ROUTES.YOUR_TEAMS}
                           key='your-teams'>Your
                  Teams</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact to={ROUTES.LIST_PARTICIPANTS}
                           key='list-participants'>List the Participants</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact
                           to={ROUTES.SUGGEST_TOOL_SKILL}
                           key='suggest-tool-skill'>Suggest Tool/Skill</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact
                           to={ROUTES.TEAM_INVITATIONS}
                           key='team-invitations'>Your Invitations</Menu.Item>,
              ]
          ) : ''}
          {isAdmin ? (
              [
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact
                           to={ROUTES.CONFIGURE_HACC}
                           key={ROUTES.CONFIGURE_HACC}>Configure HACC</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact
                           to={ROUTES.UPDATE_MP}
                           key={ROUTES.UPDATE_MP}>Update Minor Participants Status</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact
                           to={ROUTES.LIST_SUGGESTIONS}
                           key={ROUTES.LIST_SUGGESTIONS}>Suggestions List</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact
                           to={ROUTES.VIEW_TEAM}
                           key={ROUTES.VIEW_TEAM}>View Team</Menu.Item>,
                <Menu.Item as={NavLink}
                           activeClassName="active"
                           exact
                           to={ROUTES.DUMP_DATABASE}
                           key={ROUTES.DUMP_DATABASE}>Dump Database</Menu.Item>,
                <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.SHOW_MINOR}
                           key={ROUTES.SHOW_MINOR}>Show Minor</Menu.Item>,
              ]
          ) : ''}
          <Menu.Item position="right">
            {this.props.currentUser === '' ? (
                <Dropdown text="Login" pointing="top right" icon={'user'}>
                  <Dropdown.Menu>
                    <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to={ROUTES.SIGN_IN} key={ROUTES.SIGN_IN} />
                  </Dropdown.Menu>
                </Dropdown>
            ) : (
                <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
                  <Dropdown.Menu>
                    <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to={ROUTES.SIGN_OUT} key={ROUTES.SIGN_OUT}/>
                    {isParticipant ? (
                        <Dropdown.Item icon="user delete" text="Delete Account" as={NavLink} exact
                                       to={ROUTES.DELETE_ACCOUNT} />) : ''}
                  </Dropdown.Menu>
                </Dropdown>
            )}
          </Menu.Item>
        </Menu>
    );
  }
}

// Declare the types of all properties.
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(NavBarContainer);
