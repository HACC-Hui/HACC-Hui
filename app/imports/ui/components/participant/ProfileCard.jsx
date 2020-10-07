import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Card, Grid, Header, Icon } from 'semantic-ui-react';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';

class ProfileCard extends React.Component {
  render() {
    const skillNames = _.map(this.props.model.skills, (s) => {
      const skillID = Slugs.getEntityID(s.slug);
      const name = Skills.findDoc(skillID).name;
      return `${name}: ${s.level}`;
    });
    const toolNames = _.map(this.props.model.tools, (t) => {
      const toolID = Slugs.getEntityID(t.slug);
      const name = Tools.findDoc(toolID).name;
      return `${name}: ${t.level}`;
    });
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
                  <Header size="small">Challenges</Header>
                  {this.props.model.challenges.join(', ')}
                </Grid.Column>
                <Grid.Column>
                  <Header size="small">Interests</Header>
                  {this.props.model.interests.join(', ')}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header size="tiny">Skills</Header>
                  {skillNames.join(', ')}
                </Grid.Column>
                <Grid.Column>
                  <Header size="tiny">Tools</Header>
                  {toolNames.join(', ')}
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
