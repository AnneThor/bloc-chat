import React, {Component} from 'react';
import './MessageList.css';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      newMessage: ''
    };
    this.messageList = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    this.messageList.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState( {messages: this.state.messages.concat( message )} );
    })
  }

  handleNewMessage= (event) => {
    this.setState(
      { newMessage: event.target.value }
    );
    console.log(this.state.newMessage);
  }

  handleSendMessage = (event) => {
    event.preventDefault();
    this.setState(
      this.messageList.push(
        { content: this.state.newMessage,
          roomId: this.props.activeRoom.key,
          sentAt: this.convertTime(this.props.firebase.database.ServerValue.TIMESTAMP),
          username: this.props.activeUser.displayName
        }
      ))
  }

  convertTime = (timestamp) => {
    const formatDate = new Date(timestamp);
    return formatDate.toDateString();
  }

  render() {
    const roomMessages = this.state.messages.filter( message => message.roomId === this.props.activeRoom.key);
    roomMessages.sort(function (a,b) {return a.sentAt - b.sentAt} );

    return(
      <div className="message-list">
        <h2 className="active-room-name">{this.props.activeRoom.name}</h2>
        <ul>
        {roomMessages.map(
          (message, index) =>
            <li key={index} className="message-list-items">
              <p className="timestamp"> {message.sentAt}</p>
              <p className="username">{message.username}</p>
              <p className="message">{message.content}</p>
            </li>
        )}
        </ul>

        <form className="message-create">
          <input
            className="message-input-field"
            type="text"
            value={this.state.newMessage}
            placeholder="Write your message here"
            onChange= {this.handleNewMessage} />
          <input
            className="message-send-button"
            type="submit"
            value="Send"
            onClick = { this.handleSendMessage } />
        </form>

      </div>
    )
  }

}

export default MessageList;
