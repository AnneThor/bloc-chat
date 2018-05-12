import React, {Component} from 'react';
import './RoomList.css';

class RoomList extends Component {
  constructor(props){
    super(props);
    this.state = {
      rooms: [],
      newRoom: '',
    };
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState( {rooms: this.state.rooms.concat( room )} );
    });

    this.roomsRef.on('child_removed', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.state.rooms.splice(room.key,1);
      const newRoomsArray = this.state.rooms;
      this.setState = ({ rooms: newRoomsArray });
    })
  }

  handleAddNewRoom = (event) => {
    event.preventDefault();
    this.setState(
      this.roomsRef.push(
        { name: this.state.newRoom }
      )
    );
    this.setState(
      { newRoom: ''}
    )
  }

  handleDeleteRoom = (e) => {
    e.preventDefault();
    this.roomsRef.child(e.target.value).remove();
  }

  handleNewChatName = (event) => {
    this.setState(
      { newRoom: event.target.value }
    );
  }

  render () {
    return (
      <div className="sidebar">
        <h2>Available Chat Rooms</h2>
        <ul className="room-list">
          { this.state.rooms.map(
            (room, index) =>
            <li
              key={index}
              onClick={(e) => this.props.roomSelect(e, room)} >{room.name}
              <button
                className="delete-room"
                value={room.key}
                onClick={this.handleDeleteRoom}>Delete {room.name} </button>
            </li> ) }
        </ul>
        <form className="create-room">
          Create a new chat room:
          <input
            type="text"
            value={this.state.newRoom}
            placeholder="Enter New Room Name"
            onChange= {this.handleNewChatName} />
          <input
            type="submit"
            value="Add New Room"
            onClick = { this.handleAddNewRoom } />
        </form>
      </div>
    );
  }

}

export default RoomList;
