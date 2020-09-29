import React from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
class AdminToolSkill extends React.Component {
  render() {
    return (
      <div>
        <div style={{ textAlign: "center", marginTop: "70px" }}>
          <h2>Admin HACC Configurator</h2>
          <h3 style={{ marginTop: "28px" }}> Please Select an Option</h3>
          <Link to={"/ToolsList/"}>
            <Button
              style={{ marginRight: "60px", marginTop: "30px" }}
              variant="contained"
              color="primary"
            >
              Manage Tools
            </Button>
          </Link>
          <Link to={"/SkillsList/"}>
            <Button
              style={{ marginTop: "30px" }}
              variant="contained"
              color="primary"
            >
              Manage Skills
            </Button>
          </Link>
          <Link to={"/ChallengesList/"}>
            <Button
              style={{ marginLeft: "60px", marginTop: "30px" }}
              variant="contained"
              color="primary"
            >
              Manage Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default AdminToolSkill;
