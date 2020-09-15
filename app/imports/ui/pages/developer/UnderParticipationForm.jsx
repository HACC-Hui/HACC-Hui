import React from 'react';
import { Button, Header, Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../startup/client/route-constants';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class UnderParticipationForm extends React.Component {
  render() {
    return (
        <div style={{ backgroundColor: '#393B44' }}>
          <div align={'center'} style={{ backgroundColor: '#24252B' }}>
            <Header inverted style={{ padding: '5rem 0rem 0rem 0rem' }} as={'h2'}>
              Participation form for underage contestants
            </Header>
            <Image style={{ padding: '0rem 5rem 5rem 5rem' }} src='images/under-participation.png'/>
            <div className="ui inverted segment">
            <div className="ui inverted form">
              <div className="two fields">
                <div className="field">
                  <label>First Name</label>
                  <input placeholder="First Name" type="text"/>
                </div>
                <div className="field">
                  <label>Last Name</label>
                  <input placeholder="Last Name" type="text"/>
                </div>
              </div>
              <div className="two fields">
                <div className="field">
                  <label>First Name</label>
                  <input placeholder="First Name" type="text"/>
                </div>
                <div className="field">
                  <label>Last Name</label>
                  <input placeholder="Last Name" type="text"/>
                </div>
              </div>
              <div className="inline field">
                <div className="ui checkbox">
                  <input type="checkbox" tabIndex="0" className="hidden"/>
                  <label>I agree to the terms and conditions</label>
                </div>
              </div>
              <Button as={NavLink} exact to={ROUTES.CREATE_PROFILE}>
                SUBMIT
              </Button>
            </div>
          </div>
          </div>
        </div>
    );
  }
}

export default UnderParticipationForm;
