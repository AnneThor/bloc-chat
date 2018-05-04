import React, { Component } from 'react';

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
      <button className="header-button" type="button" onClick={() => this.handleSignOut(this.props.firebase)} >
        Sign Out
      </button>
    );

    const activeButton = this.props.activeUser ? signOutButton: signInButton;

    return (
      <div className="header">
      <h1 className="header-title">BLOC CHAT</h1>
      <p className="user-name">{this.props.activeUser ? "Logged in as: " + this.props.activeUser.displayName : "Guest: Logged Out"}</p>
      {activeButton}
      </div>
    );}
  }

export default User;
