import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './Components/RoomList/RoomList';
import MessageList from './Components/MessageList';
import User from './Components/User';

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
      activeRoom: null,
      activeUser: null,
    };
    this.roomsRef = firebase.database().ref('rooms');
    this.messageRef = firebase.database().ref('messages');
  }

  componentWillUpdate() {
    this.roomsRef.on('value', snapshot => {
      if ( this.state.activeRoom && snapshot.val() ) {
        const room = snapshot.val();
        room.key = snapshot.key;
        if (room.key === this.state.activeRoom.key) {
          const updatedRoomName = this.state.activeRoom;
          updatedRoomName.name = room.name;
          this.setState( { activeRoom: updatedRoomName } );
        }
      }
    });

    this.roomsRef.on('child_removed', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      if (this.state.activeRoom !== null && room.key === this.state.activeRoom.key) {
        this.setState( {activeRoom: null } )
      };
    })

  }

  handleRoomChange = (event, room) => {
    this.setState(
      { activeRoom: room }
    );
  }

  handleDeleteRoom = (event) => {
    this.setState(
      { activeRoom: null }
    );
  }

  setUser = (user) => {
    this.setState(
      { activeUser: user }
    );
  }

  render() {
    const activeRoom = this.state.activeRoom;

    return (
      <div className="grid-layout">
        <User
          firebase={firebase}
          setUser={this.setUser}
          activeUser={this.state.activeUser} />

        <RoomList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          roomSelect={this.handleRoomChange}
          deleteRoom={this.handleDeleteRoom}/>
        { activeRoom ?
          ( <MessageList
              firebase={firebase}
              activeRoom={this.state.activeRoom}
              activeUser={this.state.activeUser}/>)
              : (null) }
      </div>
    );
  }
}

export default App;
