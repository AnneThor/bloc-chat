import React, {Component} from 'react';
import './RoomList.css';

class RoomList extends Component {
  constructor(props){
    super(props);
    this.state = {
      rooms: [],
      newRoom: '',
      editRoom: false,
      roomBeingEdited: '',
      updatedRoomName: ''
    }
    this.roomsRef = this.props.firebase.database().ref('rooms');
    // this.roomsRef.on("value", this.getRoomName, this.errRoomName);
    this.messageRef = this.props.firebase.database().ref('messages');
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
    this.roomsRef.push( {name: this.state.newRoom } );
    this.setState( { newRoom: ''} );
  }

  handleDeleteRoom = (e, room) => {
    this.messageRef.on('value', snapshot => {
      snapshot.forEach( snapshot => {
        var obj = snapshot.val();
        obj.key = snapshot.key;
        if (obj.roomId === room.key) {
          this.messageRef.child(obj.key).remove();
        }
      })
    });
    this.roomsRef.child(e.target.value).remove();
    var roomArrayCopy = [...this.state.rooms];
    var index = roomArrayCopy.indexOf(room);
    roomArrayCopy.splice(index, 1);
    this.setState( { rooms: roomArrayCopy });
  }

  handleEditRoom = (e, room) => {
    var roomKey = room.key;
    this.setState( { editRoom: true,
                     roomBeingEdited: roomKey }
                   );
  }

  handleSubmitNewRoomTitle = (e) => {
    this.setState(
        { updatedRoomName: e.target.value }
      );
    if (e.key === "Enter") {
      if (this.state.updatedRoomName === '') {
        this.setState( {editRoom: false});
      } else {
      const updatedRooms = [...this.state.rooms];
      const index = updatedRooms.indexOf(this.props.activeRoom);
      updatedRooms[index].name = this.state.updatedRoomName;
      this.setState(
          { rooms: updatedRooms,
            updatedRoomName: '',
            editRoom: false }
      );
      const editedRoomRef = this.roomsRef.child(this.state.roomBeingEdited);
      editedRoomRef.update({name: this.state.updatedRoomName});
    }
  }}

  handleNewChatName = (event) => {
    this.setState(
      { newRoom: event.target.value }
    );
  }

  // getRoomName = (data) => {
  //   if (this.props.activeRoom === null) {
  //     return;
  //   }
  //   var rooms = data.val();
  //   var roomArray = Object.keys(rooms);
  //   var index = roomArray.indexOf(this.props.activeRoom.key);
  //   var updatedName = rooms[(roomArray[index])].name;
  //   var updatedNameKey = rooms[(roomArray[index])].key;
  //   if (this.props.activeRoom.key === updatedNameKey && this.props.activeRoom.name !== updatedName) {
  //     this.props.activeRoom.name = updatedName;
  //   }
  // }
  //
  // errRoomName = (err) => {
  //   console.log("Error!");
  //   console.log(err);
  // }


  render () {

    const editRoomField = (
      <input autoFocus
        className="edit-roomname"
        type="text"
        onKeyUp={this.handleSubmitNewRoomTitle}/>
      );

    return (
      <div className="roomlist">
        <h2>Available Chat Rooms</h2>
        <ul className="available-rooms">
          { this.state.rooms.map(
            (room, index) =>
            <li className="available-room-item"
                key={index}>
              <section
                className="available-room-name"
                key={index}
                onClick={(e) => this.props.roomSelect(e, room)}
                onDoubleClick={(e) => this.handleEditRoom(e, room)}>
                  { (this.state.editRoom && room === this.props.activeRoom) ? editRoomField : room.name }
              </section>
              <button
                className="delete-room-button"
                value={room.key}
                onClick={(e) => this.handleDeleteRoom(e, room)}>
                Delete
              </button>
            </li>
           ) }
        </ul>
        <form className="create-room">
          Create a new chat room:
          <input
            className="enter-room-name"
            type="text"
            value={this.state.newRoom}
            placeholder="Enter New Room Name"
            onChange= {this.handleNewChatName} />
          <input
            className="submit-room-name"
            type="submit"
            value="Add New Room"
            onClick = { this.handleAddNewRoom } />
        </form>
      </div>
    );
  }
}

export default RoomList;
