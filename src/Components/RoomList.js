import React, {Component} from 'react';
import './RoomList.css';

class RoomList extends Component {
  constructor(props){
    super(props);
    this.state = {
      rooms: []
    };
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState( {rooms: this.state.rooms.concat( room )} );
    });
  }

  render () {
    return (
      <div className="sidebar">
        <h2>Bloc Chat</h2>
        <ul className="room-list">
          { this.state.rooms.map( (room, index) => <li key={index}>Room {room.key}</li> ) }
        </ul>
      </div>
    );
  }

}

export default RoomList;
