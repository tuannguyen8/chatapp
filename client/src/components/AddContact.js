import React, { Component } from 'react'
import { io } from "socket.io-client";
import './AddContact.css'
const ENDPOINT = "http://localhost:4000/";

class AddContact extends Component {
    constructor(props) {
        super(props)
        this.state = { socket: {}, userName: '', email: '', info:'',error:'' }

    }

    doAddContactSuccess = (result) => {
        this.setState({info: result})
    }

    informError = (error) => {
        this.setState({error:error})
    }

    componentDidMount() {
        var {socket} = this.props
        console.log(socket)
        this.setState({socket})
        socket.on('add-contact-successful',this.doAddContactSuccess);
        socket.on('add-contact-fail',this. informError);
    }

    doSubmit = (event) => {
        event.preventDefault();
        var { userName, email} = this.state
        //Send message to server
        this.state.socket.emit('add-contact', this.props.userName, userName, email);
    }

    doEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }


    doUsernameChange  = (event) => {
        this.setState({ userName: event.target.value })
    }

    doLogin = () => {
        this.props.doLogin()
    }


    render() {
        var {info,error} = this.state;

        return (
            <form onSubmit={this.doSubmit}>
                <div className="container">
                    <p id ="info"> {info} </p>
                    <p id ="error"> {error} </p>
                    <h1>Create Contact</h1>
                   
                    <label for="email"><b>Email</b></label>
                    <input type="text" placeholder="Enter Email" name="email" id="email"
                        onChange={this.doEmailChange}
                        required />
                    <label for="userName"><b>Login Name</b></label>
                    <input type="text" placeholder="Enter Login Name" name="userName" id="userName"
                        onChange={this.doUsernameChange}
                        required />

                    <button type="submit" className="registerbtn">Add</button>
                </div>


            </form>

        );
    }
}

export default AddContact;