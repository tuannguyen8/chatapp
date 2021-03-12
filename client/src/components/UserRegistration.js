import React, { Component } from 'react'
import { io } from "socket.io-client";
import './UserRegistration.css'
const ENDPOINT = "http://localhost:4000/";

class UserRegistration extends Component {
    constructor(props) {
        super(props)
        this.state = { socket: {}, userName: '', password: '',passRepeat:'', fullName: '', email: '', info:'',error:'' }

    }

    doRegisterSuccesss = () => {
        this.setState({info:'The Registration is successful!'})
    }

    informError = (error) => {
        this.setState({error:error})
    }

    componentDidMount() {
        var new_socket = io(ENDPOINT);
        new_socket.on('success-register', this.doRegisterSuccesss);
        new_socket.on('error-register', this.informError);
        this.setState({ socket: new_socket })
    }

    doSubmit = (event) => {
        event.preventDefault();
        var { userName, password, email, fullName } = this.state
        this.setState({ userName, password, fullName, email })
        //Send message to server
        this.state.socket.emit('have-new-user', userName, password, email, fullName);
    }

    doEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }

    doFullnameChange = (event) => {
        this.setState({ fullName: event.target.value })
    }

    doPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    doPassRepeatChange = (event) => {
        this.setState({ passRepeat: event.target.value })
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
                    <h1>Register</h1>
                    <p>Please fill in this form to create an account.</p>

                    <label for="email"><b>Email</b></label>
                    <input type="text" placeholder="Enter Email" name="email" id="email"
                        onChange={this.doEmailChange}
                        required />
                    <label for="userName"><b>Login Name</b></label>
                    <input type="text" placeholder="Enter Login Name" name="userName" id="userName"
                        onChange={this.doUsernameChange}
                        required />
                    <label for="fullName"><b>Full Name</b></label>
                    <input type="text" placeholder="Full Name" name="fullName" id="fullName"
                        onChange={this.doFullnameChange}
                        required />

                    <label for="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" id="psw"
                        onChange={this.doPasswordChange}
                        required />

                    <label for="psw-repeat"><b>Repeat Password</b></label>
                    <input type="password" placeholder="Repeat Password" name="pswRepeat" id="psw-repeat"
                        onChange={this.doPassRepeatChange}
                        required />

                    <p>By creating an account you agree to our <a href="#"> {"Terms & Privacy"}</a>.</p>
                    <button type="submit" className="registerbtn">Register</button>
                </div>

                <div className="container signin">
                    <p>Already have an account? <a href="#"  onClick = {this.doLogin} >Sign in</a>.</p>
                </div>
            </form>

        );
    }
}

export default UserRegistration;