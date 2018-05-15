import React, {Component} from 'react';
import './RoomList.css';

class RoomList extends Component {
  constructor(props){
    super(props);
    this.state = {
      rooms: [],
      newRoom: '',
      editRoom: false,
      updatedRoomName: ''
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

  handleDeleteRoom = (e, room) => {
    var array = [...this.state.rooms];
    var index = array.indexOf(room);
    array.splice(index, 1);
    this.setState( { rooms: array });
    this.setState(
      this.roomsRef.child(e.target.value).remove()
    );
  }

  handleEditRoom = (e, room) => {
    this.setState( {editRoom: true} );
  }

  handleEditRoomSubmit = (e) => {
    console.log("Submit method was called");
    const updatedRooms = [...this.state.rooms];
    const index = updatedRooms.indexOf(e.target.value);
    updatedRooms[index].name = this.state.updatedRoomName;
    this.setState(
        { rooms: updatedRooms }
      )
    }

  handleUpdateRoom = (e) => {
    this.setState(
        { updatedRoomName: e.target.value }
      );
    }

  handleSubmitNewRoomTitle = (e) => {
    if (e.key === "Enter") {
      const updatedRooms = [...this.state.rooms];
      const index = updatedRooms.indexOf(this.props.activeRoom);
      updatedRooms[index].name = this.state.updatedRoomName;
      this.setState(
          { rooms: updatedRooms,
            updatedRoomName: '',
            editRoom: false }
      );
    }}

  handleNewChatName = (event) => {
    this.setState(
      { newRoom: event.target.value }
    );
  }


  render () {

    const editRoomField = (
      <input
        className="edit-roomname"
        type="text"
        onChange={this.handleUpdateRoom}
        onKeyPress={this.handleSubmitNewRoomTitle}
        onSubmit={ this.handleEditRoomSubmit} />
    );

    return (
      <div className="sidebar">
        <h2>Available Chat Rooms</h2>
        <ul className="room-list">
          { this.state.rooms.map(
            (room, index) =>
            <li
              key={index}
              onClick={(e) => this.props.roomSelect(e, room)}
              onDoubleClick={(e) => this.handleEditRoom(e, room)}>{ (this.state.editRoom && room === this.props.activeRoom) ? editRoomField : room.name }

            <button
                className="delete-room"
                value={room.key}
                onClick={(e) => this.handleDeleteRoom(e, room) }>
                Delete {room.name} </button>
            </li>

           ) }
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
