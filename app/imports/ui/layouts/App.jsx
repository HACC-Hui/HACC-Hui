import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Roles } from 'meteor/alanning:roles';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
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
import ListParticipantsPageAdmin from '../pages/administrator/ListParticipantsPageAdmin';
import TeamInvitationsPage from '../pages/participant/TeamInvitationsPage';
import AdminEditTeamPage from '../pages/administrator/AdminEditTeamPage';
import SideBar from '../components/SideBar';
import ViewTeamsPage from '../pages/administrator/ViewTeamsPage';
import BestFitTeamDisplay from '../pages/participant/BestFitTeamDisplay';
import UpdateMinorParticipantsCompliant from '../pages/administrator/UpdateMinorParticipantsCompliant';
import HelpPage from '../pages/HelpPage';
import InterestedParticipantPage from '../pages/participant/InterestedParticipantPage';
import AllTeamInvitationsPage from '../pages/administrator/AllTeamInvitationsPage';
import ShowMinorPage from '../pages/administrator/ShowMinorPage';

/* global window */
/**
 * Top-level layout component for this application. Called in imports/startup/client/startup.jsx.
 * @memberOf ui/layouts
 */
const App = () => {
  const [collapseNavbar, setCollapseNavbar] = useState(false);

  const updatePredicate = useCallback(() => {
    setCollapseNavbar(window.innerWidth < 750);
  }, []);

  useEffect(() => {
    updatePredicate();

    const root = document.querySelector(':root');
    const footer = document.getElementById('footer');
    root.style.setProperty('--footer-height', `${footer.offsetHeight}px`);

    return () => {
      window.removeEventListener('resize', updatePredicate);
    };
  }, [updatePredicate]);

  // prettier-ignore
  const routes = () => (
    <Switch>
      <Route exact path={ROUTES.LANDING} component={Landing} />
      <Route path={ROUTES.SIGN_IN} component={Signin} />
      <Route path={ROUTES.HELP_PAGE} component={HelpPage} />
      <ProtectedRoute path={ROUTES.SIGN_OUT} component={Signout} />
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
      <ProtectedRoute path={ROUTES.TEAM_INVITATIONS} component={TeamInvitationsPage} />
      <ProtectedRoute path={ROUTES.SUGGEST_TOOL_SKILL} component={SuggestToolSkillPage} />
      <ProtectedRoute path={ROUTES.INTERESTED_PARTICIPANTS} component={InterestedParticipantPage} />
      <AdminProtectedRoute path={ROUTES.CONFIGURE_HACC} component={ConfigureHaccPage} />
      <AdminProtectedRoute path={ROUTES.ADD_CHALLENGE} component={AddChallenge} />
      <AdminProtectedRoute path={ROUTES.UPDATE_MP} component={UpdateMinorParticipantsCompliant} />
      <AdminProtectedRoute path={ROUTES.SHOW_MINOR} component={ShowMinorPage} />
      <AdminProtectedRoute path={ROUTES.ADD_SKILL} component={AddSkill} />
      <AdminProtectedRoute path={ROUTES.ADD_TOOL} component={AddTool} />
      <AdminProtectedRoute path={ROUTES.EDIT_CHALLENGE} component={EditChallengePage} />
      <AdminProtectedRoute path={ROUTES.EDIT_TOOL} component={EditToolPage} />
      <AdminProtectedRoute path={ROUTES.EDIT_SKILL} component={EditSkillPage} />
      <AdminProtectedRoute path={ROUTES.LIST_SUGGESTIONS} component={ListSuggestions} />
      <ProtectedRoute path={ROUTES.LIST_PARTICIPANTS_ADMIN} component={ListParticipantsPageAdmin} />
      <AdminProtectedRoute path={ROUTES.DUMP_DATABASE} component={DumpDatabase} />
      <AdminProtectedRoute path={ROUTES.ADMIN_EDIT_TEAM} component={AdminEditTeamPage} />
      <AdminProtectedRoute path={ROUTES.VIEW_TEAMS} component={ViewTeamsPage} />
      <AdminProtectedRoute path={ROUTES.ALL_TEAM_INVITATIONS} component={AllTeamInvitationsPage} />
      <Route component={NotFound} />
    </Switch>
  );

  return (
    <Router>
      {!collapseNavbar ? (
        <>
          <NavBar />
          <div id="page-wrapper">{routes()}</div>
          <Footer />
        </>
      ) : (
        <>
          <meta
            name="viewport"
            content="width=device-width, maximum-scale=1.5"
          />
          <SideBar visible>
            <div id="page-wrapper">{routes()}</div>
            <Footer />
          </SideBar>
        </>
      )}
    </Router>
  );
};

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
        return isLogged ? (
          <WrappedComponent {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/signin', state: { from: props.location } }}
          />
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
        return isLogged && isAdmin ? (
          <WrappedComponent {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/signin', state: { from: props.location } }}
          />
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
