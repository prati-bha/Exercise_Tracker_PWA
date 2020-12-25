import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from "@material-ui/core";
import { ENDPOINTS } from "../constant";
import "../App.css";
import validator from "validator";

toast.configure();
export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.notify = this.notify.bind(this);

    this.state = {
      username: "",
      unique: false,
      error: false,
      validUsernameLength: true,
      errorMessage: "",
    };
  }

  notify(e) {
    return toast.success(e, { position: toast.POSITION.TOP_RIGHT });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
      validUsernameLength: true,
      error: false,
      unique: false,
      errorMessage: "",
    });
    if (
      e.target.value &&
      e.target.value !== null &&
      !validator.isAlphanumeric(e.target.value)
    ) {
      this.setState({
        error: true,
        unique: false,
        errorMessage: "Username must be alphanumeric",
      });
    }
    if (e.target.value.length > 8) {
      this.setState({
        validUsernameLength: false,
        errorMessage: "Maximum length is 8",
      });
    }
    axios
      .get(`${ENDPOINTS.CHECK_USERNAME}?username=${e.target.value}`)
      .then((res) => this.setState({ error: false, unique: true }))
      .catch((err) =>
        this.setState({
          error: true,
          unique: false,
          errorMessage: "Already exists",
        })
      );
  }

  onSubmit(e) {
    const { history } = this.props;
    e.preventDefault();

    const user = {
      username: this.state.username,
    };

    console.log(user);

    axios.post(ENDPOINTS.ADD_USER, user).then((res) => {
      this.notify("User Added!");
      history.push("/create");
      return console.log(res.data);
    });

    this.setState({
      username: "",
      unique: false,
      error: false,
    });
  }

  render() {
    return (
      <div className="user-container">
        <h3>Create New User</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <TextField
              
              variant="outlined"
              error={
                this.state.error ||
                !this.state.validUsernameLength ||
                this.state.errorMessage.length
              }
              helperText={this.state.errorMessage}
              required
              id="standard-required"
              label="Username"
              placeholder="Enter Username"
              maxLength="8"
              value={this.state.username}
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Create User"
              className="btn btn-primary"
              disabled={!this.state.unique || this.state.errorMessage}
            />
          </div>
        </form>
      </div>
    );
  }
}
