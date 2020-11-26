import { Button, Menu, MenuItem } from "@material-ui/core";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { profile } from "../images";

export default class Navbar extends Component {
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
            <li className="navbar-item">
              <Link to="/user" className="nav-link">
                Create User
              </Link>
            </li>
            {/* <li className="navbar-item">
              <Button
                className="nav-btn"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <img src={profile} alt="profile" className="nav-img"></img>
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
              </Menu>
            </li> */}
          </ul>
        </div>
      </nav>
    );
  }
}
