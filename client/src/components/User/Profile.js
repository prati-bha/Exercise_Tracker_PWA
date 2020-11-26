import React, { Component } from "react";
import CustomizedSteppers from "../UI/Stepper/Stepper";
import Stepper from "../UI/Stepper/Stepper";

export class Profile extends Component {
  render() {
    return (
      <div className="stepper-container">
        {" "}
        <h3>Update Profile</h3>
        <CustomizedSteppers />
      </div>
    );
  }
}

export default Profile;
