import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './Components/RoomList';

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBtfHl6VBJEQKHRPVNCt2i1hWMXo4mglpY",
    authDomain: "bloc-chat-c529d.firebaseapp.com",
    databaseURL: "https://bloc-chat-c529d.firebaseio.com",
    projectId: "bloc-chat-c529d",
    storageBucket: "bloc-chat-c529d.appspot.com",
    messagingSenderId: "841629726669"
  };
  firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App grid-container">
        <RoomList firebase={firebase} className="room-list"/>
      </div>
    );
  }
}

export default App;
