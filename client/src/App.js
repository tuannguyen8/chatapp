import React, { Component } from 'react'
import ChatWindow from './components/ChatWindow'
import UserRegistration from './components/UserRegistration'
import Login from './components/Login'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {userName:'', isDisplaySigup:false, toUser:'broadcast', socket:{}}
}

updateFromLogin =(userName,socket)=> {
   this.setState({socket, userName})
}

doSignup = () => {
  this.setState({isDisplaySigup:true})
}

doLogin = () => {
  this.setState({isDisplaySigup:false, userName:''})
}

render() {
  var {userName,isDisplaySigup,toUser, socket} = this.state
    return (
     <div className="App">  
     {
        isDisplaySigup == true ? <UserRegistration doLogin = {this.doLogin}></UserRegistration>:
        userName == '' ? <Login updateBack = {this.updateFromLogin} doSignup = {this.doSignup} > </Login> 
                      : <ChatWindow userName = {userName}  socket = {socket} > </ChatWindow>
     }
    </div>
    );
  }
}

export default App;
