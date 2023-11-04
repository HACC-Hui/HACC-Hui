import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';
import { MinorParticipants } from '../../api/user/MinorParticipantCollection';
import { HACCHui } from '../../api/hacc-hui/HACCHui';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    let isCompliant = HACCHui.canCreateTeams;
    const isAdmin = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    const isParticipant = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);

    if (isParticipant) {
      const participant = Participants.findDoc({ userID: Meteor.userId() });
      isCompliant = isCompliant && participant.isCompliant;
    }

    const numParticipants = Participants.count();
    const numTeams = Teams.find({ open: true }).count();
    const teamCount = Teams.count();
    const suggestionCount = Suggestions.count();
    const minors = MinorParticipants.find({}).fetch();
    const uncompliantMinors = minors.filter((m) => Participants.findDoc(m.participantID).isCompliant).length;

    const setVisible = (state) => {
      this.setState({ visible: state });
    };

    return (
        <div>
          <Navbar bg="dark" variant="dark" fixed="top" className="mobileBar">
            <Navbar.Brand>
              <div onClick={() => setVisible(!this.state.visible)} style={{ padding: '5px' }}>
                <i className="fas fa-bars"></i>
              </div>
            </Navbar.Brand>
          </Navbar>

          <div className="d-flex">
            <Sidebar style={{ paddingTop: '4rem', backgroundColor: 'rgb(18, 72, 132)' }}
                     animation='overlay'
                     icon='labeled'
                     inverted
                     vertical
                     onHide={() => setVisible(false)}
                     visible={this.state.visible}
                     width='thin'>
              <Nav className="flex-column">
                <Nav.Item as={NavLink} activeClassName="" exact to={ROUTES.LANDING}
                          onClick={() => setVisible(!this.state.visible)}>
                  <h1>HACC-Hui</h1>
                </Nav.Item>

                {isParticipant ? (
                    <>
                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                disabled={!isCompliant}
                                exact
                                to={ROUTES.CREATE_TEAM}>Create a Team</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.YOUR_PROFILE}>Your Profile</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.BEST_FIT}>List the Teams ({numTeams})</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                disabled={!isCompliant}
                                exact
                                to={ROUTES.YOUR_TEAMS}>Your Teams</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.LIST_PARTICIPANTS}>List the Participants ({numParticipants})</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.SUGGEST_TOOL_SKILL}>Suggest Tool/Skill</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.TEAM_INVITATIONS}>Your Invitations</Nav.Item>
                    </>
                ) : ''}

                {isAdmin ? (
                    <>
                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.CONFIGURE_HACC}>Configure HACC</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.UPDATE_MP}>Update Minor Participants Status ({uncompliantMinors})</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.LIST_SUGGESTIONS}>Suggestions List ({suggestionCount})</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.VIEW_TEAMS}>View Team ({teamCount})</Nav.Item>

                      <Nav.Item as={NavLink}
                                activeClassName="active"
                                exact
                                to={ROUTES.DUMP_DATABASE}>Dump Database</Nav.Item>
                    </>
                ) : ''}

                <Nav.Item>
                  {this.props.currentUser === '' ? (
                      <>
                        <Nav.Item as={NavLink} activeClassName="active" exact to={ROUTES.SIGN_IN}
                                  onClick={() => setVisible(!this.state.visible)}>Sign In</Nav.Item>
                      </>
                  ) : (
                      <>
                        <Nav.Item as={NavLink} activeClassName="active" exact to={ROUTES.SIGN_OUT}
                                  onClick={() => setVisible(!this.state.visible)}>Sign Out</Nav.Item>

                        <Nav.Item as={NavLink} activeClassName="active" exact to={ROUTES.DELETE_ACCOUNT}
                                  onClick={() => setVisible(!this.state.visible)}>Delete Account</Nav.Item>
                      </>
                  )}
                </Nav.Item>
              </Nav>
            </Sidebar>

            <div style={{ paddingTop: '5rem' }}>
              {this.props.children}
            </div>
          </div>
        </div>
    );
  }
}

// Declare the types of all properties.
SideBar.propTypes = {
  currentUser: PropTypes.string,
  children: PropTypes.array,
  visible: PropTypes.bool,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const SideBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(SideBar);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(SideBarContainer);
