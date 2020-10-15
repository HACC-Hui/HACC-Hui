import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Header, Sidebar, Segment, Icon } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';

/**
 * The SideBar appears on the side of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {

    const isAdmin = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    const isParticipant = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);
    // console.log(isParticipant);

    const setVisible = (state) => {
      this.setState({ visible: state });
    };

    return (
        <div>
          <Menu borderless inverted fixed={'top'} className={'mobileBar'}>
            <Menu.Item position={'left'}>
              <div onClick={() => setVisible(!this.state.visible)} style={{ padding: '5px' }}>
                <Icon name='bars'/>
              </div>
            </Menu.Item>
          </Menu>
          <Sidebar.Pushable as={Segment} className={'sideBar'}>
            <Sidebar
                style={{ paddingTop: '4rem', backgroundColor: 'rgb(18, 72, 132)' }}
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                onHide={() => setVisible(false)}
                visible={this.state.visible}
                width='thin'
            >
              <Menu.Item as={NavLink} activeClassName="" exact to={ROUTES.LANDING}
                         onClick={() => setVisible(!this.state.visible)}>
                <Header inverted as='h1'>HACC-Hui</Header>
              </Menu.Item>
              {isParticipant ? (
                  [<Menu.Item as={NavLink} activeClassName="active"
                              onClick={() => setVisible(!this.state.visible)}
                              exact to={ROUTES.CREATE_TEAM} key='team-creation'>Create a
                    Team</Menu.Item>,
                    <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.YOUR_PROFILE}
                               key='edit-profile'
                               onClick={() => setVisible(!this.state.visible)}>
                      Your Profile</Menu.Item>,
                    <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.LIST_TEAMS}
                               key='list-teams'
                               onClick={() => setVisible(!this.state.visible)}>List the
                      Teams</Menu.Item>,
                    <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.YOUR_TEAMS}
                               key='your-teams'
                               onClick={() => setVisible(!this.state.visible)}>Your
                      Teams</Menu.Item>,
                    // eslint-disable-next-line max-len
                    <Menu.Item as={NavLink} activeClassName="active" exact
                               to={ROUTES.LIST_PARTICIPANTS}
                               key='list-participants'
                               onClick={() => setVisible(!this.state.visible)}>List the
                      Participants</Menu.Item>,
                  ]
              ) : ''}
              {isAdmin ? (
                  [
                    <Menu.Item as={NavLink} activeClassName="active" exact
                               to={ROUTES.CONFIGURE_HACC}
                               key={ROUTES.CONFIGURE_HACC}
                               onClick={() => setVisible(!this.state.visible)}>Configure HACC</Menu.Item>,
                    <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.DUMP_DATABASE}
                               key={ROUTES.DUMP_DATABASE}
                               onClick={() => setVisible(!this.state.visible)}>Dump Database</Menu.Item>,
                  ]
              ) : ''}
              <Menu.Item>
                {this.props.currentUser === '' ? (
                    <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.SIGN_IN}
                               key={ROUTES.SIGN_IN}
                               onClick={() => setVisible(!this.state.visible)}>Sign In</Menu.Item>
                ) : (
                    [<Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.SIGN_OUT}
                               key={ROUTES.SIGN_OUT}
                               onClick={() => setVisible(!this.state.visible)}>Sign Out</Menu.Item>,
                      <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.DELETE_ACCOUNT}
                                 key={ROUTES.DELETE_ACCOUNT}
                                 onClick={() => setVisible(!this.state.visible)}>Delete Account</Menu.Item>,
                    ]
                )}
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher style={{ paddingTop: '5rem' }}>
              {this.props.children}
            </Sidebar.Pusher>
          </Sidebar.Pushable>
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
