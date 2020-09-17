import React from 'react';
import {
  Grid,
  Segment,
  Header,
  Image,
  Popup,
  Item,
  Modal,
  Icon,
  Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class TeamFinderCard extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {

    function changeBackground(e) {
      e.currentTarget.style.backgroundColor = '#fafafa';
      e.currentTarget.style.cursor = 'pointer';
    }

    function onLeave(e) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }

    return (
        <Item onMouseEnter={changeBackground} onMouseLeave={onLeave}
              style={{ padding: '0rem 2rem 0rem 2rem' }}>
          <Modal closeIcon trigger={
            <Item.Content>
              <Item.Header>

                <Header as={'h3'} style={{ color: '#263763', paddingTop: '2rem' }}>
                  {this.props.teams.name}
                </Header>


              </Item.Header>
              <Item.Meta>
                <Item.Meta>
                  <Grid doubling columns={4}>
                    <Grid.Column>
                      <Grid.Row>
                        <Image src={this.props.teams.image} size='small' />
                      </Grid.Row>
                      <Grid.Column floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                          <p style={{ color: 'rgb(89, 119, 199)' }}>
                            ChallengeName
                          </p>
                        </Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                      Skills
                    </Grid.Column>
                    <Grid.Column>
                      Challenges
                    </Grid.Column>
                  </Grid>
                </Item.Meta>
              </Item.Meta>

              {/*<Item.Extra>*/}
              {/*  {props.internship.skills.map((skill) => (*/}
              {/*      hasSkill(skill)*/}
              {/*  ))}*/}
              {/*  {isRemote(props.internship.location.city)}*/}
              {/*</Item.Extra>*/}
              {/*<Item.Extra style={{ paddingBottom: '2rem' }}>*/}
              {/*</Item.Extra>*/}
            </Item.Content>
          }>
            <Modal.Header>Description</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                test
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }}>
                <Icon name='star'/>
                Add to Favorites
              </Button>
              <a href='' target="_blank" rel='noopener noreferrer'>
                <Button style={{ backgroundColor: 'rgb(89, 119, 199)', color: 'white' }}>
                  Go to Listing: test
                  <Icon name='chevron right'/>
                </Button>
              </a>
            </Modal.Actions>
          </Modal>
          <Popup
              content='Request sent!'
              mouseLeaveDelay={200}
              on='click'
              trigger={
                <Button style={{ backgroundColor: 'transparent' }}>
                  Request to join
                </Button>
              }
          />
        </Item>
    );
  }
}

TeamFinderCard.propTypes = {
  teams: PropTypes.object.isRequired,
};

export default TeamFinderCard;
