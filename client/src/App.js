/* eslint-disable no-unused-vars */

import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";
import ExercisesList from "./components/exercises-list.component";
import EditExercise from "./components/edit-exercise.component";
import CreateExercise from "./components/create-exercise.component";
import CreateUser from "./components/create-user.component";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound from "./components/404/NotFound";
import Profile from "./components/User/Profile";
import { useUsernameContext } from './contexts/UsernameContext'

//Lazy load components
// const EditExercise = React.lazy(() =>
//   import("./components/edit-exercise.component")
// );

// const CreateExercise = React.lazy(() =>
//   import("./components/create-exercise.component")
// );

// const CreateUser = React.lazy(() =>
//   import("./components/create-user.component")
// );

function App() {


  const {
    token
  } = useUsernameContext();
  return (
    <div className="container">
      <Router>
        <Navbar />
        <br />
        <Switch>
          <Route
            path="/"
            exact
            render={() =>
              token === null ? (
                <Redirect to="/login" />
              ) : (
                  <ExercisesList />
                )
            }
          // component={ExercisesList}
          />
          <Route
            path="/edit/:id"
            render={() =>
              token === null ? (
                <Redirect to="/login" />
              ) : (
                  <EditExercise />
                )
            }

          // component={EditExercise}
          // render={() => (
          //   <Suspense fallback={() => <div>Loading...</div>}>
          //     <EditExercise />
          //   </Suspense>
          // )}
          />
          <Route
            path="/create"
            render={() =>
              token === null ? (
                <Redirect to="/login" />
              ) : (
                  <CreateExercise />
                )
            }

          // component={CreateExercise}
          // render={() => (
          //   <Suspense fallback={() => <div>Loading...</div>}>
          //     <CreateExercise />
          //   </Suspense>
          // )}
          />
          <Route
            path="/user"
            render={() =>
              token === null ? (
                <Redirect to="/login" />
              ) : (
                  <CreateUser />
                )
            }

          // component={CreateUser}
          // render={() => (
          //   <Suspense fallback={() => <div>Loading...</div>}>
          //     <CreateUser />
          //   </Suspense>
          // )}
          />
          <Route
            path="/profile"
            render={() =>
              token === null ? (
                <Redirect to="/login" />
              ) : (
                  <Profile />
                )
            }

          // component={CreateUser}
          // render={() => (
          //   <Suspense fallback={() => <div>Loading...</div>}>
          //     <CreateUser />
          //   </Suspense>
          // )}
          />

          <Route path="/login" component={Login} />
          <Route path="/signUp" component={Signup} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
