import { TextField } from "@material-ui/core";
import React from "react";

function UserProfile(props) {
  return (
    <div className="user-container">
      <div className="form-group">
        <TextField
          variant="outlined"
          //   error={
          //     this.state.error ||
          //     !this.state.validUsernameLength ||
          //     this.state.errorMessage.length
          //   }
          //   helperText={this.state.errorMessage}
          id="standard-required"
          label="Username"
          placeholder="Enter Username"
          maxLength="8"
          value={props.username}
          onChange={props.onChangeUsername}
        />
      </div>
      <div className="form-group">
        <TextField
          variant="outlined"
          //   error={
          //     this.state.error ||
          //     !this.state.validUsernameLength ||
          //     this.state.errorMessage.length
          //   }
          //   helperText={this.state.errorMessage}
          id="standard-required"
          label="Email"
          placeholder="Enter Username"
          maxLength="8"
          value={props.email}
          onChange={props.onChangeEmail}
        />
      </div>
    </div>
  );
}

export default UserProfile;
