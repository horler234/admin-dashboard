import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import firebase from "./firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Main from "./containers/Main";
import { LoadingIcon } from "./icons";
require("firebase/functions");

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Page404 = lazy(() => import("./pages/404"));

const auth = firebase.auth();
// const firestore = firebase.firestore();
// const analytics = firebase.analytics();

function App() {
  const [user, loading, error] = useAuthState(auth);
  // const authenticated = true;
  const authenticated = !!user;

  const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={(props) => {
          if (authenticated) {
            return <Component {...rest} {...props} />;
          } else {
            return (
              <Redirect
                to={{
                  pathname: "/login",
                  state: {
                    from: props.location,
                  },
                }}
              />
            );
          }
        }}
      />
    );
  };
  if (loading) {
    return (
      <div className={`flex h-screen bg-gray-50 dark:bg-gray-900`}>
        <div className="flex flex-col flex-1 w-full">
          <Main>
            <LoadingIcon />
          </Main>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          {/* Place new routes over this */}
          <ProtectedRoute path="/app" component={Layout} />
          <Redirect exact from="/" to="/app" />
          <Route exact path="/login" component={Login} />
          {/* <Redirect exact from="/" to="/login" /> */}
          <ProtectedRoute path="/create-account" component={CreateAccount} />
          <ProtectedRoute path="/forgot-password" component={ForgotPassword} />
          <Route component={Page404} />
          {/* If you have an index page, you can remothis Redirect */}
          {/* <Redirect exact from="/" to="/app" /> */}
        </Switch>
      </Router>
    </>
  );
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          {/* Place new routes over this */}
          <Route path="/app" component={Layout} />
          <Route path="/login" component={Login} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/forgot-password" component={ForgotPassword} />
          {/* If you have an index page, you can remothis Redirect */}
          <Redirect exact from="/" to="/app" />
        </Switch>
      </Router>
    </>
  );
}

export default App;
