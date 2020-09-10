import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';

/**
 * The NavBar appears at the top of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
class NavBar extends React.Component {
  render() {
    const menuStyle = {
      marginTop: '0px',
      color: '#25C2A0',
      backgroundColor: 'white',
    };

    const menuItemStyle = {
      marginTop: '0px',
      color: '#25C2A0',
      backgroundColor: 'white',
    };

    return (
      // Since Navbar is fixed to the top I needed to put it in a div and create space so that it doesn't overlap other content
      <div style={{height: 65}} >
        <Menu 
          fixed='top' 
          style={menuStyle} 
          borderless 
          pointing
          secondary
          color='teal'
        >
          <Menu.Item style={{padding: '0.58em 0.2em'}} as={NavLink} activeClassName="" exact to="/">
            <img style={{width: 90}} src='/images/hacc_logo.png'/>
          </Menu.Item>
          {this.props.currentUser ? (
              [<Menu.Item as={NavLink} activeClassName="active" exact to="/profile" key='profile'>Profile</Menu.Item>,
              <Menu.Item as={NavLink} activeClassName="active" exact to="/create" key='create'>Create a Team</Menu.Item>,]
          ) : ''}
          {Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN) ? (
              <Menu.Item as={NavLink} activeClassName="active" exact to="/admin" key='admin'>Challenges</Menu.Item>
          ) : ''}
          <Menu.Item position="right">
            {this.props.currentUser === '' ? (
              <Button className='button-v1' as={NavLink} exact to="/signin" >
                Sign In
              </Button>
            ) : (
              <Dropdown style={{color: '#25C2A0'}} text={this.props.currentUser} pointing="top right" icon={'user'}>
                <Dropdown.Menu >
                  <Dropdown.Item  className='dropdown-item' icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
                  <Dropdown.Item icon="setting" text="Settings" as={NavLink} exact to="/settings"/>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

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
