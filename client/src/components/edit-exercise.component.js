import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withRouter } from "react-router-dom";
import { ENDPOINTS, getToken } from "../constant";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import moment from "moment";
import CustomizedDialogs from "./Modal/Modal";

toast.configure();
class EditExercise extends Component {
  constructor(props) {
    super(props);

    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      description: "",
      duration: "",
      date: moment(new Date()).format("YYYY-MM-DD"),
      users: [],
      validMinutes: true,
      validDescLength: true,
      errorMessage: "",
      hasUsername: true,
    };
  }

  componentDidMount() {
    if (localStorage.getItem("username") === null) {
      this.setState({
        hasUsername: false,
      });
    }
    axios
      .get(`${ENDPOINTS.EXERCISES}/${this.props.match.params.id}`, {
        headers: getToken,
      })
      .then((response) => {
        this.setState({
          username: response.data.username,
          description: response.data.description,
          duration: response.data.duration,
          date: moment(response.data.date).format("YYYY-MM-DD"),
        });
        console.log(this.state);
      })
      .catch(function (error) {
        console.log(error);
      });


  }


  onChangeDescription(e) {
    this.setState({
      validDescLength: true,
      errorMessage: "",
    });
    if (e.target.value && e.target.value.length > 250) {
      this.setState({
        validDescLength: false,
        errorMessage: "Description should be less than 250 characters",
      });
    }
    this.setState({
      description: e.target.value,
    });
  }
  onChangeDuration(e) {
    this.setState({
      duration: e.target.value,
    });
    // not more than minutes in a day
    if (e.target.value > 1440) {
      this.setState({
        validMinutes: false,
      });
    } else {
      this.setState({ validMinutes: true });
    }
  }
  onChangeDate(e) {
    this.setState({
      date: e.target.value,
    });
  }

  notify(e) {
    return toast.success(e, { position: toast.POSITION.TOP_RIGHT });
  }

  onSubmit(e) {
    const { history } = this.props;
    e.preventDefault();

    const exercise = {
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date,
    };

    console.log(exercise);

    axios
      .post(ENDPOINTS.UPDATE_EXERCISE + this.props.match.params.id, exercise, {
        headers: getToken,
      })
      .then((res) => {
        this.notify("Exercise Updated!");
        history.push("/");
        return console.log(res.data);
      });
  }

  render() {
    if (!this.state.hasUsername) {
      return <CustomizedDialogs open />;
    }
    return (
      <div className="exercise-container">
        <h3>Edit Exercise Log</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            {/* <label>Description: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
            /> */}
            <TextField
              error={!this.state.validDescLength}
              helperText={
                !this.state.validDescLength ? this.state.errorMessage : null
              }
              variant="outlined"
              multiline
              rowsMax={5}
              required
              id="standard-required"
              label="Description"
              placeholder="Enter Description"
              value={this.state.description}
              onChange={this.onChangeDescription}
              style={{ maxWidth: 300, minWidth: 300 }}
            />
          </div>
          <div className="form-group">
            {/* <label>Duration (in minutes): </label>
            <input
              type="number"
              className="form-control"
              value={this.state.duration}
              onChange={this.onChangeDuration}
            /> */}
            <TextField
              error={!this.state.validMinutes}
              helperText={
                !this.state.validMinutes
                  ? "Minutes shouldn't exceed 1440"
                  : null
              }
              variant="outlined"
              required
              type="number"
              id="standard-required"
              label="Duration (in minutes)"
              placeholder="Enter Duration"
              value={this.state.duration}
              onChange={this.onChangeDuration}
              style={{ maxWidth: 300, minWidth: 300 }}
            />
          </div>
          <div className="form-group">
            {/* <label>Date: </label> */}
            <div>
              {/* <DatePicker
                selected={this.state.date}
                onChange={this.onChangeDate}
              /> */}
              {/* <TextField
                variant="outlined"
                id="date"
                label="Date"
                type="date"
                // defaultValue="2017-05-24"
                className="textField"
                InputLabelProps={{
                  shrink: true,
                }}
                selected={this.state.date}
                onChange={this.onChangeDate}
              /> */}
              <TextField
                variant="outlined"
                id="date"
                label="Date"
                type="date"
                className="textField"
                defaultValue={this.state.date}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={this.onChangeDate}
                style={{ maxWidth: 300, minWidth: 300 }}
              />
            </div>
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Edit Exercise Log"
              className="btn btn-primary exercise-container-btn"
              disabled={
                this.state.description.length === 0 ||
                !this.state.duration ||
                !this.state.validMinutes
              }
            />
          </div>
        </form>
      </div>
    );
  }
}
export default withRouter(EditExercise);
