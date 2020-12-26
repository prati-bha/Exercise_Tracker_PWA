import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "./components/404/NotFound";
import Navbar from "./components/navbar.component";
import ExercisesList from "./components/exercises-list.component";
import EditExercise from "./components/edit-exercise.component";
import CreateExercise from "./components/create-exercise.component";
import CreateUser from "./components/create-user.component";

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Switch>
          <Route exact path="/" component={ExercisesList} />
          <Route exact path="/edit/:id" component={EditExercise} />
          <Route exact path="/create" component={CreateExercise} />
          <Route exact path="/user" component={CreateUser} />
          <Route exact component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
