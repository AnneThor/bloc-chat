import React, {Component} from 'react';
import './RoomList.css';

class RoomList extends Component {
  constructor(props){
    super(props);
    this.state = {
      rooms: [],
      newRoom: ''
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

  handleNewChatName = (event) => {
    this.setState(
      { newRoom: event.target.value }
    );
  }

  handleAddNewRoom = (event) => {
    event.preventDefault();
    this.setState(
      this.roomsRef.push(
        { name: this.state.newRoom }
      )
    )
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
              onClick={(e) => this.props.roomSelect(e, room)} >{room.name}</li> ) }
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
