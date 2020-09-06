import React from 'react';
import { Form, Image, Grid, Container, Icon, Menu, Checkbox, List, Button, Segment } from 'semantic-ui-react';

const levels = ['Dont Know', 'Novice', 'Experienced'];

const challenges = ['HGIA Green Loan Portal', 'ETS/HGG Community Engagement & Digital Storytelling',
                   'Energy/HECO Electric Vehicle Charging Analysis', 'DOE Aloha+ Curricular Database'];

class Profile extends React.Component {

  state = { checked: false }

  handleSkillAClick = (e, { name }) => this.setState({ activeSkillA: name })

  handleSkillBClick = (e, { name }) => this.setState({ activeSkillB: name })

  handleSkillCClick = (e, { name }) => this.setState({ activeSkillC: name })

  handleToolAClick = (e, { name }) => this.setState({ activeToolA: name })

  handleToolBClick = (e, { name }) => this.setState({ activeToolB: name })

  handleToolCClick = (e, { name }) => this.setState({ activeToolC: name })

  toggle = () => this.setState((prevState) => ({ checked: !prevState.checked }))

  render() {

    const { activeSkillA, activeSkillB, activeSkillC, activeToolA, activeToolB, activeToolC } = this.state;

    const gridStyle = {
      paddingTop: '140px',
      paddingBottom: '200px',
    };

    const nameStyle = {
      paddingLeft: '20px',
      font: 'Monsterrat',
      fontSize: '36px',
      fontWeight: '500px',
      color: 'white',
    };

    const headerStyle = {
      paddingTop: '25px',
      marginBottom: '0px',
      fontWeight: '600',
      fontSize: '24px',
    };

    const choiceStyle = {
      marginTop: '20px',
      fontWeight: '500px',
      fontSize: '17px',
    };

    const lineStyle = {
      width: '400px',
      marginLeft: '0px',
      border: '2px solid',
      color: 'black',
    };

    const radioStyle = {
      margin: '30px 0px 30px 30px',
      fontSize: '15px',
    };

    return (
        <Container style={{ height: '1500px' }}>
          <div id='cover-photo'>
              <Grid style={gridStyle}>
                <Grid.Column width={7} style={{ paddingLeft: '7em' }}>
                  <Grid.Row length={3}>
                    <div>
                      {/* eslint-disable-next-line max-len */}
                      <Image src='/images/basic_pic.png' size='small' circular id='profile-pic' style={{ display: 'inline' }}/>
                      <span style={nameStyle}>John Doe</span>
                    </div>
                  </Grid.Row>
                  <Grid.Row style={{ paddingTop: '15px' }}>
                    <p style={headerStyle}>
                      About me
                    </p>
                    <hr style={lineStyle}/>
                    <p className='info-style' style={{ paddingTop: '10px' }}>
                      Hi my name is John and I’m married to Jane and I like making friends.
                    </p>
                  </Grid.Row>
                  <Grid.Row style={{ paddingTop: '20px' }}>
                    <p style={headerStyle}>
                      Contact me
                    </p>
                    <hr style={lineStyle}/>
                    <div className='info-style' style={{ paddingTop: '10px' }}>Website</div>
                    {/* eslint-disable-next-line max-len */}
                    <div className='info-style' style={{ paddingTop: '7px', color: '#18A0FB' }}>https://hacc-hui.github.io/</div>
                    <div className='info-style' style={{ paddingTop: '30px' }}><Icon name='mail'/>Email</div>
                    <div className='info-style' style={{ paddingTop: '7px', color: '#18A0FB' }}>john@foo.com</div>
                    <div className='info-style' style={{ paddingTop: '30px' }}><Icon name='github'/>Github</div>
                    {/* eslint-disable-next-line max-len */}
                    <div className='info-style' style={{ paddingTop: '7px', color: '#18A0FB' }}>https://github.com/Team-CCC/HACC-Hui</div>
                    <div className='info-style' style={{ paddingTop: '30px' }}><Icon name='linkedin'/>LinkedIn</div>
                    {/* eslint-disable-next-line max-len */}
                    <div className='info-style' style={{ paddingTop: '7px', color: '#18A0FB' }}>https://www.linkedin.com/</div>
                  </Grid.Row>
                </Grid.Column>
              <Grid.Column width={8} style={{ paddingLeft: '9em' }}>
                <Segment style={{ borderRadius: '.75rem', padding: '0px 30px 30px 30px' }}>
                  <Form>
                    <p style={{
                      marginTop: '28px',
                      marginBottom: '0px',
                      fontWeight: '600',
                      fontSize: '24px',
                    }}>
                      SKILLS
                    </p>
                    <hr style={lineStyle}/>
                    <p style={choiceStyle}>
                      Javascript
                    </p>
                    <Menu secondary pointing fluid widths={3}>
                      {levels.map((c) => (
                          // eslint-disable-next-line react/jsx-key
                          <Menu.Item
                              name={c}
                              active={activeSkillA === c}
                              onClick={this.handleSkillAClick}
                          />
                      ))}
                    </Menu>
                    <p style={choiceStyle}>
                      Teamwork
                    </p>
                    <Menu secondary pointing fluid widths={3}>
                      {levels.map((c) => (
                          // eslint-disable-next-line react/jsx-key
                          <Menu.Item
                              name={c}
                              active={activeSkillB === c}
                              onClick={this.handleSkillBClick}
                          />
                      ))}
                    </Menu>
                    <p style={choiceStyle}>
                      Communication
                    </p>
                    <Menu secondary pointing fluid widths={3}>
                      {levels.map((c) => (
                          // eslint-disable-next-line react/jsx-key
                          <Menu.Item
                              name={c}
                              active={activeSkillC === c}
                              onClick={this.handleSkillCClick}
                          />
                      ))}
                    </Menu>
                    <p style={headerStyle}>
                      TOOLS
                    </p>
                    <hr style={lineStyle}/>
                    <p style={choiceStyle}>
                      Javasript
                    </p>
                    <Menu secondary pointing fluid widths={3}>
                      {levels.map((c) => (
                          // eslint-disable-next-line react/jsx-key
                          <Menu.Item
                              name={c}
                              active={activeToolA === c}
                              onClick={this.handleToolAClick}
                          />
                      ))}
                    </Menu>
                    <p style={choiceStyle}>
                      Intellij
                    </p>
                    <Menu secondary pointing fluid widths={3}>
                      {levels.map((c) => (
                          // eslint-disable-next-line react/jsx-key
                          <Menu.Item
                              name={c}
                              active={activeToolB === c}
                              onClick={this.handleToolBClick}
                          />
                      ))}
                    </Menu>
                    <p style={choiceStyle}>
                      Github
                    </p>
                    <Menu secondary pointing fluid widths={3}>
                      {levels.map((c) => (
                          // eslint-disable-next-line react/jsx-key
                          <Menu.Item
                              name={c}
                              active={activeToolC === c}
                              onClick={this.handleToolCClick}
                          />
                      ))}
                    </Menu>
                    <p style={headerStyle}>
                      CHALLENGES
                    </p>
                    <hr style={lineStyle}/>
                    {challenges.map((c) => (
                        // eslint-disable-next-line react/jsx-key
                        <List>
                          <List.Item style={radioStyle}>
                            <Checkbox label={c}/>
                          </List.Item>
                        </List>
                    ))}
                    <Button type='submit' style={{ marginLeft: '150px' }}>Submit</Button>
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid>
          </div>
        </Container>
    );
  }

}

export default Profile;
