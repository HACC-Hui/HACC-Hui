import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Header, Icon, List } from 'semantic-ui-react';
import SkillItem from './SkillItem';
import ToolItem from './ToolItem';

class ProfileCard extends React.Component {
  render() {
    return (
        <Card fluid>
          <Card.Content>
            <Card.Header>{this.props.model.firstName} {this.props.model.lastName}</Card.Header>
            <Card.Meta>
              {this.props.model.username} <br /> {this.props.model.demographicLevel}
            </Card.Meta>
            <Card.Description>
              <Grid container columns={3}>
                <Grid.Column><Icon name="github" /> GitHub:<br />
                  <a href={this.props.model.gitHub}>{this.props.model.gitHub}</a>
                </Grid.Column>
                <Grid.Column><Icon name="linkedin" /> Linked In:<br />
                  <a href={this.props.model.linkedIn}>{this.props.model.linkedIn}</a>
                </Grid.Column>
                <Grid.Column><Icon name="server" /> Website:<br />
                  <a href={this.props.model.website}>{this.props.model.website}</a>
                </Grid.Column>
              </Grid>
              <Grid container columns={1}>
                <Grid.Column><Icon name="comment" /> About me: {this.props.model.aboutMe}</Grid.Column>
              </Grid>
            </Card.Description>
          </Card.Content>
          <Card.Content>
            <Grid container columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <Header dividing size="small">Challenges</Header>
                  <List bulleted>
                  {this.props.model.challenges.map((item) => <List.Item key={item}>{item}</List.Item>)}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header dividing size="small">Interests</Header>
                  <List>
                    {this.props.model.interests.map((item) => <List.Item key={item}>{item}</List.Item>)}
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header dividing size="tiny">Skills</Header>
                  <List bulleted>
                    {this.props.model.skills.map((item) => <SkillItem item={item} key={item._id} />)}
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header dividing size="tiny">Tools</Header>
                  <List bulleted>
                    {this.props.model.tools.map((item) => <ToolItem item={item} key={item._id} />)}
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
    );
  }

}

ProfileCard.propTypes = {
  model: PropTypes.object.isRequired,
};

export default ProfileCard;
