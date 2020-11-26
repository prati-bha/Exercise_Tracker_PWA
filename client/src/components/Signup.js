import { TextField } from "@material-ui/core";
import React, { Component } from "react";
import validator from "validator";
import axios from "axios";
import { ENDPOINTS } from "../constant";
import { toast } from "react-toastify";

toast.configure();
export class Signup extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: false,
      errorMessage: {
        username: "",
        email: "",
      },
      uniqueUsername: false,
      matchPassword: true,
    };
  }

  onChangeName(e) {
    this.setState(
      {
        username: "",
        errorMessage: {
          ...this.state.errorMessage,
          username: "",
        },
      },
      () => console.log(this.state)
    );
    if (e.target.value && !validator.isAlphanumeric(e.target.value)) {
      this.setState({
        errorMessage: {
          ...this.state.errorMessage,
          username: "Username should be alphanumeric",
        },
      });
    }
    if (e.target.value.length > 8) {
      this.setState({
        errorMessage: {
          ...this.state.errorMessage,
          username: "Maximum length should be 8",
        },
      });
    }
    this.setState({
      username: e.target.value,
    });
    axios
      .get(`${ENDPOINTS.CHECK_USERNAME}?username=${e.target.value}`)
      .then((res) => this.setState({ error: false, unique: true }))
      .catch((err) =>
        this.setState({
          error: true,
          uniqueUsername: false,
          errorMessage: {
            ...this.state.errorMessage,
            username: "Already exists",
          },
        })
      );
  }

  onChangeEmail(e) {
    this.setState(
      {
        email: "",
        errorMessage: {
          ...this.state.errorMessage,
          email: "",
        },
      },
      () => console.log(this.state)
    );
    if (e.target.value && !validator.isEmail(e.target.value)) {
      this.setState({
        errorMessage: {
          ...this.state.errorMessage,
          email: "Invalid Email",
        },
      });
    }
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
      matchPassword: true,
    });
    if (e.target.value && e.target.value !== this.state.confirmPassword) {
      this.setState({
        matchPassword: false,
      });
    }
  }

  onChangeConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value,
      matchPassword: true,
    });
    if (e.target.value && e.target.value !== this.state.password) {
      this.setState({
        matchPassword: false,
      });
    }
  }
  notify(e) {
    return toast.success(e, { position: toast.POSITION.TOP_RIGHT });
  }

  onSubmit(e) {
    const { history } = this.props;
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    // TODO add sign up api endpoint
    axios.post(ENDPOINTS.SIGN_UP, user).then((res) => {
      this.notify("Signed Up Successfully!");
      history.push("/login");
      return console.log(res.data);
    });

    this.setState({
      email: "",
      password: "",
      confirmPassword: "",
      error: false,
      errorMessage: {
        username: "",
        email: "",
      },
      uniqueUsername: false,
      matchPassword: true,
    });
  }

  render() {
    return (
      <div className="exercise-container">
        <h3>Sign Up</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <TextField
              variant="outlined"
              error={
                this.state.errorMessage.email &&
                this.state.errorMessage.email.length
              }
              helperText={
                this.state.errorMessage.email && this.state.errorMessage.email
              }
              required
              id="standard-required"
              label="Email"
              placeholder="Enter Email"
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </div>
          <div className="form-group">
            <TextField
              variant="outlined"
              required
              id="standard-required"
              label="Password"
              type="password"
              placeholder="Enter Password"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <TextField
              error={!this.state.matchPassword}
              helperText={
                !this.state.matchPassword ? "Password does not match" : null
              }
              variant="outlined"
              required
              id="standard-required-confirm"
              label="Confirm Password"
              type="password"
              placeholder="Enter Confirm Password"
              value={this.state.confirmPassword}
              onChange={this.onChangeConfirmPassword}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Sign Up"
              className="btn btn-primary"
              disabled={
                !this.state.email ||
                !this.state.password ||
                !this.state.confirmPassword ||
                this.state.error ||
                !this.state.matchPassword
              }
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Signup;
