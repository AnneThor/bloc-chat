import React, {Component} from 'react';
import './MessageList.css';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.messageList= this.props.firebase.database().ref('messages').orderByChild('sentAt');
  }

  componentDidMount() {
    this.messageList.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState( {messages: this.state.messages.concat( message )} );
    })
  }


  render() {
    const roomMessages = this.state.messages.filter( message => message.roomId === this.props.activeRoom.key);
    roomMessages.sort(function (a,b) {return a.sentAt - b.sentAt} );

    return(
      <div className="message-list">
        <h2>{this.props.activeRoom.name}</h2>
        <ul id="message-list">
        {roomMessages.map(
          (message, index) =>
            <li key={index} >
              <p className="username">{message.username} {message.sentAt}</p>
              <p className="message">{message.content}</p>
            </li>
        )}
        </ul>
      </div>
    )
  }

}

export default MessageList;
