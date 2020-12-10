/* eslint-disable no-unused-vars */

import { Button, Menu, MenuItem } from "@material-ui/core";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../constant";
import usernameContext from '../contexts/UsernameContext'
import "../App.css";

export default class Navbar extends Component {
  static contextType = usernameContext;
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      setAnchorEl: "",
      anchorEl: false,
    };
  }

  handleClick = (event) => {
    this.setState({ setAnchorEl: event.currentTarget, anchorEl: true });
  };

  handleClose = () => {
    this.setState({ setAnchorEl: "", anchorEl: false });
  };

  render() {
    const logoutUser = () => {
      axios
        .get(`${ENDPOINTS.LOGOUT}`, {
          headers: this.context.token,
        })
        .then((res) => { if (res.status === 200) { this.context.setToken(null); this.context.setUsername(null); } })
        .catch((err) =>
          console.log(err)
        );
    }
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          ExcerTracker
        </Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">
                Exercises
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/create" className="nav-link">
                Create Exercise Log
              </Link>
            </li>
            {this.context.username === null && <li className="navbar-item">
              <Link to="/user" className="nav-link">
                Create User
              </Link>
            </li>}
          </ul>
          {this.context.token !== null && <ul className="navbar-nav  ">
            <li className="navbar-item ml-auto text-secondary align-self-center " onClick={logoutUser}>
              <Link to="/login" className="nav-link">
                Logout
              </Link>
            </li>
          </ul>}
        </div >
      </nav >
    );
  }
}
