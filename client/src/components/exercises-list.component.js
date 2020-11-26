import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENDPOINTS, getToken } from "../constant";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import "../App.css";
import { Waypoint } from "react-waypoint";
import Spinner from "./Spinner/Spinner";

toast.configure();

const Exercise = (props) => (
  <tr>
    <td>{props.exercise.username}</td>
    <div className="desc">
      <td>{props.exercise.description}</td>
    </div>
    <td>{props.exercise.duration}</td>
    <td>{props.exercise.date.substring(0, 10)}</td>
    <td>
      {/* <Link to={"/edit/" + props.exercise._id}>edit</Link>  */}
      {/* <a
        href="#"
        onClick={() => {
          props.deleteExercise(props.exercise._id);
        }}
      >
        delete
      </a> */}
      <IconButton aria-label="edit" className="icon-margin">
        <EditIcon
          color="primary"
          href={"/edit/" + props.exercise._id}
          onClick={() => {
            window.location.href = "/edit/" + props.exercise._id;
          }}
        />
      </IconButton>{" "}
      |{" "}
      <IconButton aria-label="delete" className="icon-margin">
        <DeleteIcon
          color="secondary"
          href="#"
          onClick={() => {
            props.deleteExercise(props.exercise._id);
          }}
        />
      </IconButton>
    </td>
  </tr>
);

export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this);

    this.state = {
      exercises: [],
      pageNum: 0,
      limit: 10,
      hasNext: false,
      loading: false,
    };
  }

  notify(e) {
    return toast.error(e, { position: toast.POSITION.TOP_RIGHT });
  }

  checkDataLimit(data) {
    return data.length === this.state.limit;
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    axios
      .get(
        `${ENDPOINTS.EXERCISES}?pageNum=${this.state.pageNum}&limit=${this.state.limit}`,
        {
          headers: getToken,
        }
      )
      .then((response) => {
        this.setState({
          hasNext: this.checkDataLimit(response.data),
          loading: false,
        });
        this.setState({ exercises: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteExercise(id) {
    axios
      .delete(`${ENDPOINTS.EXERCISES}/${id}`, {
        headers: getToken,
      })
      .then((response) => {
        this.notify("Exercise Deleted!");
        return console.log(response.data);
      });

    this.setState({
      exercises: this.state.exercises.filter((el) => el._id !== id),
    });
  }

  setPageIndex() {
    this.setState({
      pageNum: this.state.pageNum + 1,
      loading: true,
    });
    axios
      .get(
        `${ENDPOINTS.EXERCISES}?pageNum=${this.state.pageNum}&limit=${this.state.limit}`,
        {
          headers: getToken,
        }
      )
      .then((response) => {
        this.setState({
          hasNext: this.checkDataLimit(response.data),
          exercises: [...this.state.exercises, ...response.data],
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  exerciseList() {
    return this.state.exercises.map((currentexercise, i) => (
      <React.Fragment>
        <Exercise
          exercise={currentexercise}
          deleteExercise={this.deleteExercise}
          key={currentexercise._id}
        />
        {this.state.hasNext && i === this.state.exercises.length - 1 && (
          <Waypoint onEnter={() => this.setPageIndex()} />
        )}
      </React.Fragment>
    ));
  }

  render() {
    const loading = this.state.loading ? <Spinner /> : null;
    return (
      <div>
        <h3>Logged Exercises</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.exerciseList()}</tbody>
        </table>
        {loading}
      </div>
    );
  }
}
