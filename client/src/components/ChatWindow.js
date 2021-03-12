import React, { Component } from 'react'
import { io } from "socket.io-client";
import AddContact from './AddContact';
import './ChatWindow.css'
const ENDPOINT = "http://localhost:4000/";

class ChatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = { socket: {}, send_mess: '', isAddingContact: false, show_mess: [], contactList: [], toUser:'broadcast' }
    }
    receiveMessage = (fromUser, msg) => {
        var { show_mess } = this.state
        show_mess.push(fromUser + ': ' + msg)
        this.setState({ show_mess })
    }

    receiveContact = (contact) => {
        var { contactList,isAddingContact } = this.state
        if (contactList.includes(contact) == false) {
            contactList.push(contact)
            this.setState({ contactList,isAddingContact:false })
        }
        

    }
    componentDidMount = () => {
        var { socket } = this.props
        console.log(socket)
        this.setState({ socket })
        socket.on('broadcast', this.receiveMessage);
        socket.on('private-chat', this.receiveMessage);
        socket.on('contact-receive', this.receiveContact);
    }

    doSubmit = (event) => {
        event.preventDefault();
        var { show_mess, send_mess, socket,toUser } = this.state
        //Send message to server
        if (toUser == "broadcast")
            socket.emit("broadcast", this.props.userName, send_mess);
        else
            socket.emit('private-chat',this.props.userName,toUser,send_mess)
        this.setState({ send_mess: '' })

    }


    doAddingContact = (event) => {
        event.preventDefault();
        var { isAddingContact } = this.state
        this.setState({ isAddingContact: !isAddingContact })
    }

    doSentChange = (event) => {
        this.setState({ send_mess: event.target.value })
    }

    doChangeUser = (event) =>{
        var {socket,toUser} = this.state;
        console.log('toUser = ', event.target.value)
        this.setState({toUser:event.target.value, show_mess:[]})
        socket.emit('load-history',this.props.userName, event.target.value)
    }

    render() {
        var { show_mess, isAddingContact, socket, contactList } = this.state
        var { userName } = this.props
        var messages = show_mess.map((mess, index) => {
            return (<li key={index}> {mess}</li>)
        });
        let element;
        let size = contactList.length
        if (isAddingContact) {
            element = <AddContact userName={userName} socket={socket} />
        } else {
           
            element = (
                <div className='custome-select'>
                    <select id="contact" size={30} value = {this.state.toUser} onChange = {this.doChangeUser}>
                        <option key={0} value={"broadcast"}> All </option>
                        {
                            contactList.map((contact, index) => {
                                return (<option key={index+ 1} value={contact}> {contact} </option>)
                            })
                        }
                    </select>
                </div>

            )
        }

        return (
            <div id="chat-form">
                <div id="list-container">
                    <ul id="messages">
                        {messages}
                    </ul>
                    <div id="contact">
                        <label style={{display:"inline"}}>Login as :{userName}</label>
                        <button onClick={this.doAddingContact} >Add new contact</button>
                        {element}
                    </div>
                </div>

                <form id="form" onSubmit={this.doSubmit}>
                    <input id="input" value={this.state.send_mess} onChange={this.doSentChange} />
                    <button >Send</button>
                </form>

            </div>

        );
    }
}

export default ChatWindow;