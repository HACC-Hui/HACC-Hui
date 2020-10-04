import React from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Button } from 'semantic-ui-react';
import { ROUTES } from '../../../startup/client/route-constants';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
class AgePage extends React.Component {
  render() {
    return (
        <div style={{ backgroundColor: '#393B44' }}>
          <div align={'center'} style={{ backgroundColor: '#24252B' }}>
            <Header inverted style={{ padding: '5rem 10rem 5rem 10rem' }} as={'h2'}>
              Before we move onto making your profile, we need to verify your age.
              <br/>
              Are you 18 or over?
              <br/>
              <Button as={NavLink} activeClassName="active" exact to={ROUTES.PARTICIPATION}
                  style={{ color: 'white', backgroundColor: '#393B44' }} content="Yes, I am." />
              <br/>
              <Button as={NavLink} activeClassName="active" exact to={ROUTES.UNDERAGE_PARTICIPATION}
                      style={{ color: 'white', backgroundColor: '#393B44' }} content="No, I am not." />
            </Header>
          </div>
        </div>
    );
  }
}

export default AgePage;
