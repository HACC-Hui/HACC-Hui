import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Button, Header } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { TeamDevelopers } from '../../api/team/TeamDeveloperCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Developers } from '../../api/user/DeveloperCollection';

/**
 * The NavBar appears at the top of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
class NavBar extends React.Component {

  render() {
    const isAdmin = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    const isDeveloper = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.DEVELOPER);
    const menuStyle = { marginBottom: '10px' };
    // if (isDeveloper) {
    //   console.log(`this.props.teams`);
    //   console.log(this.props.teams);
    //   console.log(`this.props.teamDevelopers`);
    //   console.log(this.props.teamDevelopers);
    //   console.log(`Meteor.userID`);
    //   console.log(Meteor.userId());
    //   const developer = Developers.findDoc({ userID: Meteor.userId() });
    //   console.log(`developer`);
    //   console.log(developer);
    // }


    // this.props.teamDevelopers.filter(teamDeveloper => {
    //   (teamDeveloper.developerID === this.props.currentUser)
    //   }
    // )
    return (
        <Menu style={menuStyle} attached="top" borderless inverted>
          <Menu.Item as={NavLink} activeClassName="" exact to={ROUTES.LANDING}>
            <Header inverted as='h1'>HACC-Hui</Header>
          </Menu.Item>
          {isDeveloper ? (
              [<Menu.Item as={NavLink} activeClassName="active" exact
                          to={ROUTES.CREATE_TEAM} key='team-creation'>Create a Team</Menu.Item>,
                <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.EDIT_PROFILE} key='edit-profile'>Edit
                  Your Profile</Menu.Item>,
                <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.LIST_TEAMS} key='list-teams'>List the
                  Teams</Menu.Item>,
                <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.TEAMMATES} key='teammates'>
                  Teammates
                </Menu.Item>,
              ]
          ) : ''}


          {/* {isDeveloper ? (
            (this.props.teamDevelopers.map(teamDeveloper => (

              )
            )
            
            )
            <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.TEAMMATES} key='list-teammates'>List the
                Teams</Menu.Item>
          ) : ''} */}


          {isAdmin ? (
              [
                <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.CONFIGURE_HACC}
                           key={ROUTES.CONFIGURE_HACC}>Configure HACC</Menu.Item>,
                <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.DUMP_DATABASE}
                           key={ROUTES.DUMP_DATABASE}>Dump Database</Menu.Item>,
              ]
          ) : ''}
          <Menu.Item position="right">
            {this.props.currentUser === '' ? (
                <Dropdown text="Login" pointing="top right" icon={'user'}>
                  <Dropdown.Menu>
                    <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to={ROUTES.SIGN_IN} />
                  </Dropdown.Menu>
                </Dropdown>
            ) : (
                <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
                  <Dropdown.Menu>
                    <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to={ROUTES.SIGN_OUT} />
                    {isDeveloper ? (
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

// // Declare the types of all properties.
// NavBar.propTypes = {
//   currentUser: PropTypes.string,
//   ready: PropTypes.bool,
//   // teamDevelopers: PropTypes.arrayOf(
//   //   PropTypes.object,
//   // ),
//   teams: PropTypes.arrayOf(
//     PropTypes.object,
//   ),
// };

// // withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
// const NavBarContainer = withTracker(() => {
//   // const teamDevelopers = Meteor.subscribe(TeamDevelopers);
//   // const teams = Teams.find({}).fetch();
//   const currentUser = Meteor.user() ? Meteor.user().username : '';

//   return {
//     currentUser,
//     // ready: teamDevelopers.ready(),
//     // teams, 
//   };
// })(NavBar);

// Declare the types of all properties.
NavBar.propTypes = {
  currentUser: PropTypes.string,
  subscriptions: PropTypes.object,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(NavBarContainer);
