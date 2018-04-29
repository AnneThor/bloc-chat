import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './Components/RoomList';
import MessageList from './Components/MessageList';

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
    this.state = {
      activeRoom: null
    };

  }

  handleRoomChange = (event, room) => {
    this.setState( {
      activeRoom: room
    });

    console.log(this.state.activeRoom);
  }



  render() {
    const activeRoom = this.state.activeRoom;

    return (
      <div className="App grid-container">
        <RoomList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          roomSelect={this.handleRoomChange}/>
      { activeRoom ? ( <MessageList firebase={firebase}
        activeRoom={this.state.activeRoom} />) : (null) }
      </div>
    );
  }
}

export default App;
