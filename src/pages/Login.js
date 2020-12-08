import React from "react";
import { Link, useHistory } from "react-router-dom";

import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import { GithubIcon, TwitterIcon } from "../icons";
import { Label, Input, Button } from "@windmill/react-ui";
// import { firebase } from "../firebase";
import firebase from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const auth = firebase.auth();

// const auth = firebase.auth();

function Login() {
  const history = useHistory();
  const [user, loading, error] = useAuthState(auth);
  // const authenticated = true;
  const authenticated = !!user;
  React.useEffect(() => {
    if (!authenticated) return;
    history.push("/app/dashboard");
  }, [authenticated]);

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log({ provider });
    return auth.signInWithRedirect(provider);
  };
  const Google = async () => {
    await signInWithGoogle();
    history.push("/app/dashboard");
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              <p>Login with your Social</p>
              <br />
              <Button block layout="outline" onClick={Google}>
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Google
              </Button>
              <hr className="my-8" />

              {/* <Button className="mt-4" block layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button> */}

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/create-account"
                >
                  Create account
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
