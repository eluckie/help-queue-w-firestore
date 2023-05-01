import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

function SignIn() {
  const [signUpSuccess, setSignUpSuccess] = useState(null);
  const [signInSuccess, setSignInSuccess] = useState(null);
  const [signOutSuccess, setSignOutSuccess] = useState(null);

  function doSignUp(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // user successfully signed up
        setSignUpSuccess(`You've successfully signed up, ${userCredential.user.email}!`)
      })
      .catch((error) => {
        // there was an error with sign up
        setSignUpSuccess(`There was an error signing up: ${error.message}!`)
      });
  }

  function doSignIn(event) {
    event.preventDefault();
    const email = event.target.signinEmail.value;
    const password = event.target.signinPassword.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSignInSuccess(`You've successfully signed in as ${userCredential.user.email}!`)
      })
      .catch((error) => {
        setSignInSuccess(`There was an error signing in: ${error.message}!`)
      });
  }

  function doSignOut() {
    signOut(auth)
      .then(function() {
        setSignOutSuccess("You have successfully signed out!");
      })
      .catch(function(error) {
        setSignOutSuccess(`There was an error signing out: ${error.message}!`)
      });
  }

  return (
    <React.Fragment>
      <h1>Sign Up</h1>
      {signUpSuccess}
      <form onSubmit={doSignUp}>
        <input
          type="text"
          name="email"
          placeholder="email" />
        <input
          type="password"
          name="password"
          placeholder="password" />
        <br/>
        <button type="submit">Sign Up</button>
      </form>
      
      <h1>Sign In</h1>
      {signInSuccess}
      <form onSubmit={doSignIn}>
      <input
          type="text"
          name="signinEmail"
          placeholder="email" />
        <input
          type="password"
          name="signinPassword"
          placeholder="password" />
        <br/>
        <button type="submit">Sign In</button>
      </form>

      <h1>Sign Out</h1>
      {signOutSuccess}
      <br/>
      <button onClick={doSignOut}>Sign Out</button>
    </React.Fragment>
  );
}

export default SignIn;