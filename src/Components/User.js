import React, { Component } from 'react';
import './User.css';

class User extends Component {

  handleSignIn(firebase) {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
  }

  handleSignOut(firebase) {
      this.props.firebase.auth().signOut();
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
    });
  }

  render() {
    const signInButton = (
      <button className="header-button" type="button" onClick={() => this.handleSignIn(this.props.firebase)} >
        Sign In
      </button>
    );

    const signOutButton = (
      <button className="login-button" type="button" onClick={() => this.handleSignOut(this.props.firebase)} >
        Sign Out
      </button>
    );

    const activeButton = this.props.activeUser ? signOutButton: signInButton;

    return (
      <div className="user">
        <h1 className="title">BLOC CHAT</h1>
        <div className="login">
          <p className="user-name">{this.props.activeUser ? "Logged in as: " + this.props.activeUser.displayName : "Guest: Logged Out"}</p>
          {activeButton}
        </div>
      </div>
    );}
  }

export default User;
