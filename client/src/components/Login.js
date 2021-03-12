import React, { Component } from 'react'
import { io } from "socket.io-client"
import './Login.css'
const ENDPOINT = "http://localhost:4000/";

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = { socket:{}, userName: '', password: '', info: '', error: '' }


    }

    doLoginSuccesss = () => {
        this.setState({ error: '' })
        this.setState({ info: 'The login is successful!' })
        this.props.updateBack(this.state.userName,this.state.socket)
    }

    informError = (er) => {
        this.setState({ info: '' })
        this.setState({ error: er })
    }

    componentDidMount() {
       var new_socket = io(ENDPOINT);
        new_socket.on('success-login', this.doLoginSuccesss);
        new_socket.on('error-login', this.informError);
        this.setState({socket:new_socket})
    }

    doSubmit = (event) => {
        event.preventDefault();
        var { userName, password,socket } = this.state
        //Send message to server
        socket.emit('authentication', userName, password);
    }

    doSignup = (event) => {
       this.props.doSignup()
      
    }

    doPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    doUsernameChange = (event) => {
        this.setState({ userName: event.target.value })
    }


    render() {
        var { info, error } = this.state;
        var { doSigup } = this.props

        return (
            <div className="container">
                <form onSubmit={this.doSubmit}>
                    <div className="col">
                        <div className="hide-md-lg">
                            <p>Or sign in manually:</p>
                        </div>

                        <input type="text" name="username" placeholder="Username"
                            onChange={this.doUsernameChange}
                            required />
                        <input type="password" name="password" placeholder="Password"
                            onChange={this.doPasswordChange}
                            required />
                        <p id="error"> {error} </p>
                        <p id="info"> {info} </p>
                        <input type="submit" value={"Login"} />
                    </div>
                </form>

                <div className="bottom-container">
                    <div className="row">
                        <div className="col">
                            <a href="#" style={{ color: "white" }} className="btn"
                                onClick={this.doSignup}
                            >Sign up</a>
                        </div>
                        <div className="col">
                            <a href="#" style={{ color: "white" }} className="btn">Forgot password?</a>
                        </div>
                    </div>
                </div>

            </div>

        );
    }
}

export default Login;