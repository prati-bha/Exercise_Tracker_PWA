import React, { Component } from "react";
import axios from "axios";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withRouter } from "react-router-dom";
import { EDITED_EXERCISE_SYNC_TAG, EDITED_EXERCISE_OBJECT_STORE, ENDPOINTS, SYNCED_DATABASE } from "../constant";
import {
  FormControl,
  // FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import moment from "moment";

toast.configure();
class EditExercise extends Component {
  constructor(props) {
    super(props);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: "",
      description: "",
      duration: "",
      date: moment(new Date()).format("YYYY-MM-DD"),
      users: [],
      validMinutes: true,
      validDescLength: true,
      errorMessage: "",
    };
  }

  componentDidMount() {
    axios
      .get(`${ENDPOINTS.EXERCISES}/${this.props.match.params.id}`)
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

    axios
      .get(ENDPOINTS.USERS)
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map((user) => user.username),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
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
    const props = this.props;
    e.preventDefault();

    const exercise = {
      username: this.state.username,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date,
    };
    if ('serviceWorker' in navigator && 'SyncManager' in window && !navigator.onLine) {
      async function writeData(st, data) {
        let tx;
        const result = await window.indexedDB.open(SYNCED_DATABASE, 1);
        result.onupgradeneeded = function (event) {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(st)) {
            const store = db.createObjectStore(st, { keyPath: 'username' });
            store.transaction.oncomplete = () => {
              console.log(st)
              tx = db.transaction(st, 'readwrite');
              const objStore = tx.objectStore(st);
              data.userID = props.match.params.id;
              objStore.put(data);
            }
          }
        };
      }
      const title = "User Logged The Exercise";
      const options = {
        title: 'User Logged The Exercise',
        body: "You are offline and Your Exercise Log was Saved For Syncing.",
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBB4ELRwTrxy6lKCQJe9Q5ez9nIEqQHE-xRg&usqp=CAU"
      };
      navigator.serviceWorker.ready
        .then(function (sw) {
          writeData(EDITED_EXERCISE_OBJECT_STORE, exercise).then(() => {
            return sw.sync.register(EDITED_EXERCISE_SYNC_TAG);
          }).then(() => {
            sw.showNotification(title, options);
            history.push("/");
          })
            .catch(function (err) {
              console.log(err);
            });
        });
    } else {

      axios
        .post(ENDPOINTS.UPDATE_EXERCISE + this.props.match.params.id, exercise)
        .then((res) => {
          this.notify("Exercise Updated!");
          history.push("/");
          return console.log(res.data);
        });
    }
  }

  render() {
    return (
      <div className="exercise-container">
        <h3>Create New Exercise Log</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Username
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                label="Username"
                value={this.state.username}
                onChange={this.onChangeUsername}
                style={{ maxWidth: 300, minWidth: 300, textAlign: "left" }}
              >
                {this.state.users.map(function (user) {
                  return (
                    <MenuItem key={user} value={user}>
                      {user}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="form-group">
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
                !this.state.username ||
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
