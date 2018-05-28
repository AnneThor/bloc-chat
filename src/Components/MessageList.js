import React, {Component} from 'react';
import './MessageList.css';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      newMessage: '',
      editMessage: false,
      editMessageKey: ''
    }
    this.messageList = this.props.firebase.database().ref('messages');
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }


  componentDidMount() {
    this.messageList.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState( {messages: this.state.messages.concat( message )} );
    });
  }

  handleDeleteMessage(e, message) {
      this.messageList.child(e.target.value).remove();
      const messageArrayCopy = [...this.state.messages];
      const indexToRemove = messageArrayCopy.indexOf(message);
      messageArrayCopy.splice(indexToRemove, 1);
      this.setState( { messages: messageArrayCopy} );
  }

  handleEditMessageClick(e, message) {
    this.setState(
      { editMessage: true,
        editMessageKey: e.target.value }
    );
  }

  handleNewMessage= (event) => {
    this.setState(
      { newMessage: event.target.value }
    );
  }

  handleSendMessage = (event) => {
    event.preventDefault();
      this.messageList.push(
        { content: this.state.newMessage,
          roomId: this.props.activeRoom.key,
          sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
          username: this.props.activeUser ? this.props.activeUser.displayName : "Anonymous"
        });
    this.setState(
      {newMessage: ''}
    )
  }

  handleSubmitUpdatedMessage = (e) => {
    if (e.key === "Enter") {
      if (this.state.newMessage === '') {
        this.setState( {editRoom: false});
      } else {
      const updatedMessageList = [...this.state.messages];
      const indexOfEdit = updatedMessageList.findIndex(
        message => message.key === this.state.editMessageKey);
      updatedMessageList[indexOfEdit].content = this.state.newMessage;

      const editedMessage = this.messageList.child(this.state.editMessageKey);
      editedMessage.update({content: this.state.newMessage});
      this.setState(
          { messages: updatedMessageList,
            newMessage: '',
            editMessage: false,
            editMessageKey: '' }
      );
    }
  }}


  handleUpdateMessage = (e) => {
    this.setState( {newMessage: e.target.value});
  }

  convertTime = (timestamp) => {
    const thisDate = new Date(timestamp);
    return thisDate.toLocaleString();
  }

  render() {

    const roomMessages = this.state.messages.filter( message => message.roomId === this.props.activeRoom.key);
    roomMessages.sort(function (a,b) {return a.sentAt - b.sentAt} );

    const editMessageField = (
      <input autoFocus
        placeholder={this.state.selectedMessage}
        className="edit-message-input"
        type="text"
        value={this.state.newMessage}
        onChange={this.handleUpdateMessage}
        onKeyPress={this.handleSubmitUpdatedMessage}/>
    );


    return(
      <div className="messagelist">
        <h2 className="active-room-name">
          {this.props.activeRoom.name}
        </h2>

        <ul className="available-message-list">
        {roomMessages.map(
          (message, index) =>
            <li key={index} className="message-list-items">
              <div className="message-content">
                <p className="message-text">
                  {(this.state.editMessage && message.key===this.state.editMessageKey)? editMessageField : message.content}
                </p>
                <p className="username">{message.username}</p>
              </div>
              <div className="message-details">
                <p className="timestamp">{this.convertTime(message.sentAt)}</p>
                <button
                  value={message.key}
                  onClick={(e) => this.handleEditMessageClick(e)}>Edit
                </button>
                  <button
                  value={message.key}
                  onClick={(e) => this.handleDeleteMessage(e, message)}>Delete
                </button>
              </div>
            </li>
        )}
        </ul>

        <form className="message-create" onSubmit = { this.handleSendMessage }>
          <input
            className="message-input-field"
            type="text"
            value={this.state.newMessage}
            placeholder="Write your message here"
            onChange= {this.handleNewMessage} />
          <input
            className="message-send-button"
            type="submit"
            value="Send Message" />
        </form>

      </div>
    )
  }

}

export default MessageList;
