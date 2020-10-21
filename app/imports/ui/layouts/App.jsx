import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signout from '../pages/Signout';
import withAllSubscriptions from './AllSubscriptionsHOC';
import { ROLE } from '../../api/role/Role';
import AgePage from '../pages/participant/AgePage';
import ParticipationForm from '../pages/participant/ParticipationForm';
import UnderParticipationForm from '../pages/participant/UnderParticipationForm';
import { ROUTES } from '../../startup/client/route-constants';
import DeleteForm from '../pages/participant/DeleteForm';
import AddChallenge from '../pages/administrator/AddChallenge';
import AddSkill from '../pages/administrator/AddSkill';
import AddTool from '../pages/administrator/AddTool';
import DumpDatabase from '../pages/administrator/DumpDatabase';
import EditProfilePage from '../pages/participant/EditProfilePage';
import ListTeamsPage from '../pages/participant/ListTeamsPage';
import ConfigureHaccPage from '../pages/administrator/ConfigureHaccPage';
import ShowMinorPage from '../pages/administrator/ShowMinorPage';
import EditChallengePage from '../pages/administrator/EditChallengePage';
import EditToolPage from '../pages/administrator/EditToolPage';
import EditSkillPage from '../pages/administrator/EditSkillPage';
import CreateTeamPage from '../pages/participant/CreateTeamPage';
import EditTeamPage from '../pages/participant/EditTeamPage';
import YourTeams from '../pages/participant/YourTeams';
import ProfilePage from '../pages/participant/ProfilePage';
import CreateProfilePage from '../pages/participant/CreateProfilePage';
import SuggestToolSkillPage from '../pages/participant/SuggestToolSkillPage';
import ListSuggestions from '../pages/administrator/ListSuggestions';
import ListParticipantsPage from '../pages/participant/ListParticipantsPage';
import TeamInvitationsPage from '../pages/participant/TeamInvitationsPage';
import AdminEditTeamPage from '../pages/administrator/AdminEditTeamPage';
import SideBar from '../components/SideBar';
import ViewTeamPage from '../pages/administrator/ViewTeamPage';
import BestFitTeamDisplay from '../pages/participant/BestFitTeamDisplay';
import UpdateMinorParticipantsCompliant from '../pages/administrator/UpdateMinorParticipantsCompliant';
import HelpPage from '../pages/HelpPage';
import InterestedParticipantPage from '../pages/participant/InterestedParticipantPage';

/* global window */
/**
 * Top-level layout component for this application. Called in imports/startup/client/startup.jsx.
 * @memberOf ui/layouts
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDesktop: false,
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 750 });
  }

  render() {

    const isDesktop = this.state.isDesktop;

    const routes = () => (
        <Switch>
          <Route exact path={ROUTES.LANDING} component={Landing} />
          <Route path={ROUTES.SIGN_IN} component={Signin} />
          <Route path={ROUTES.HELP_PAGE} component={HelpPage} />
          <ProtectedRoute path={ROUTES.AGE_CONSENT} component={AgePage} />
          <ProtectedRoute path={ROUTES.PARTICIPATION} component={ParticipationForm} />
          <ProtectedRoute path={ROUTES.UNDERAGE_PARTICIPATION} component={UnderParticipationForm} />
          <ProtectedRoute path={ROUTES.CREATE_PROFILE} component={CreateProfilePage} />
          <ProtectedRoute path={ROUTES.YOUR_PROFILE} component={ProfilePage} />
          <ProtectedRoute path={ROUTES.EDIT_PROFILE} component={EditProfilePage} />
          <ProtectedRoute path={ROUTES.CREATE_TEAM} component={CreateTeamPage} />
          <ProtectedRoute path={ROUTES.EDIT_TEAM} component={EditTeamPage} />
          <ProtectedRoute path={ROUTES.LIST_TEAMS} component={ListTeamsPage} />
          <ProtectedRoute path={ROUTES.BEST_FIT} component={BestFitTeamDisplay} />
          <ProtectedRoute path={ROUTES.DELETE_ACCOUNT} component={DeleteForm} />
          <ProtectedRoute path={ROUTES.YOUR_TEAMS} component={YourTeams} />
          <ProtectedRoute path={ROUTES.LIST_PARTICIPANTS} component={ListParticipantsPage} />
          <ProtectedRoute path={ROUTES.TEAM_INVITATIONS} component={TeamInvitationsPage}/>
          <ProtectedRoute path={ROUTES.SUGGEST_TOOL_SKILL} component={SuggestToolSkillPage} />
          <ProtectedRoute path={ROUTES.INTERESTED_PARTICIPANTS} component={InterestedParticipantPage} />
          <AdminProtectedRoute path={ROUTES.CONFIGURE_HACC} component={ConfigureHaccPage} />
          <AdminProtectedRoute path={ROUTES.ADD_CHALLENGE} component={AddChallenge} />
          <AdminProtectedRoute path={ROUTES.UPDATE_MP} component={UpdateMinorParticipantsCompliant} />
          <AdminProtectedRoute path={ROUTES.ADD_SKILL} component={AddSkill} />
          <AdminProtectedRoute path={ROUTES.ADD_TOOL} component={AddTool} />
          <AdminProtectedRoute path={ROUTES.EDIT_CHALLENGE} component={EditChallengePage}/>
          <AdminProtectedRoute path={ROUTES.EDIT_TOOL} component={EditToolPage}/>
          <AdminProtectedRoute path={ROUTES.EDIT_SKILL} component={EditSkillPage}/>
          <AdminProtectedRoute path={ROUTES.LIST_SUGGESTIONS} component={ListSuggestions}/>
          <AdminProtectedRoute path={ROUTES.DUMP_DATABASE} component={DumpDatabase} />
          <AdminProtectedRoute path={ROUTES.ADMIN_EDIT_TEAM} component={AdminEditTeamPage} />
          <AdminProtectedRoute path={ROUTES.VIEW_TEAM} component={ViewTeamPage} />
          <AdminProtectedRoute path={ROUTES.SHOW_MINORS} component={ShowMinorPage} />
          <ProtectedRoute path={ROUTES.SIGN_OUT} component={Signout} />
          <Route component={NotFound} />
        </Switch>
    );

    return (
        <Router>
          <div>
            {isDesktop ? (
                <div>
                  <NavBar/>
                  {routes()}
                  <Footer/>
                </div>
            ) : (
                <div style={{ display: 'flex', padding: `${10}px` }}>
                  <meta name="viewport" content="width=device-width, maximum-scale=1.5"/>
                  <SideBar visible={this.state.visible}>
                    {routes()}
                    <Footer/>
                  </SideBar>
                </div>
            )}
          </div>
        </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 * @memberOf ui/layouts
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const WrappedComponent = withAllSubscriptions(Component);
  return (
      <Route
          {...rest}
          render={(props) => {
            const isLogged = Meteor.userId() !== null;
            return isLogged ?
                (<WrappedComponent {...props} />) :
                (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
                );
          }}
      />
  );
};

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 * @memberOf ui/layouts
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => {
  const WrappedComponent = withAllSubscriptions(Component);
  return (
      <Route
          {...rest}
          render={(props) => {
            const isLogged = Meteor.userId() !== null;
            const isAdmin = Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
            return (isLogged && isAdmin) ?
                (<WrappedComponent {...props} />) :
                (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
                );
          }}
      />
  );
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.object.isRequired,
  ]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.object.isRequired,
  ]),
  location: PropTypes.object,
};

export default withAllSubscriptions(App);
