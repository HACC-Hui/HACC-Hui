import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Header, Loader } from 'semantic-ui-react';
import _ from 'underscore';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import UpdateMinorParticipantsWidget from '../../components/administrator/UpdateMinorParticipantsWidget';

class UpdateMinorParticipantsCompliant extends React.Component {

  getMinorParticipants() {
    const AllMinorParticipants = MinorParticipants._collection.find({}).fetch();
    return AllMinorParticipants;
  }

  getCFParticipants() {
    const CFParticipants = Participants._collection.find({ isCompliant: false }).fetch();
    return CFParticipants;
  }

  getMinorCFParticipants() {
    const CFParticipantsID = _.pluck(this.getCFParticipants(), '_id');
    const AllMinorParticipantsID = _.pluck(this.getMinorParticipants(), 'participantID');
    const MinorCFParticipantsID = _.intersection(CFParticipantsID, AllMinorParticipantsID);
    return MinorCFParticipantsID;

  }

  renderMinorCFParticipants() {
    const MinorCFParticipantsID = this.getMinorCFParticipants();
    // eslint-disable-next-line eqeqeq
    if (MinorCFParticipantsID.length == 0) {
      return <div><Header>No uncompilable underage participants yet</Header></div>;
    }

      return <div><UpdateMinorParticipantsWidget MinorParticipantsID={MinorCFParticipantsID}/></div>;

  }

  render() {

    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    return (<Container center>
      <Header>List for the uncompilable underage participants</Header>
      {this.renderMinorCFParticipants()}
    </Container>);
  }

}
UpdateMinorParticipantsCompliant.propTypes = {

  ready: PropTypes.bool.isRequired,

};
export default withTracker(() => {

  const subscriptionParticipant = Participants.subscribe();
  const subscriptionMinor = MinorParticipants.subscribe();

  return {

    // developerSkill: ParticipantSkills.find({}).fetch(),
   // teamSkills: TeamSkills.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionParticipant.ready() && subscriptionMinor.ready(),
  };
})(UpdateMinorParticipantsCompliant);
