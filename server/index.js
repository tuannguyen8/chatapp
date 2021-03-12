const app = require('express')();
const http = require('http').Server(app);
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

const io = require('socket.io')(http, {
    cors: {
        origin: "*",
    }
});

const port = process.env.PORT || 4000;

//Create a dictionary to save key: client_id, value = username
var users = {}

app.get('/', (req, res) => {
    res.send('<h1>Chat Server</h1>');
});

io.on('connection', (socket) => {
   
    //Send message to all
    socket.on('broadcast', (fromUser,msg) => {
        io.emit('broadcast',fromUser, msg);
        //Store to table broadcast
        mongoClient.connect(url, function(error, db){
            var storeObj = {fromUser,message:msg, receiveTime:Date.now()}
            console.log(storeObj)
            var dbo = db.db("mydb");
            //Save to broadcast, so other users can see
            dbo.collection('broadcast').insertOne(storeObj,function(error,res){
                if (error)
                    throw error;
            })
            //save to the history of the current user
            dbo.collection('userhistory').insertOne({userName:fromUser,message:msg,read:true, receiveTime: Date.now()},function(error,res){
                if (error)
                    throw error;
            })
        })
    });

    socket.on('private-chat',(fromUser,touser,message)=>{
        //Case chat private
        mongoClient.connect(url, function(error,db){
            if (error)
                throw error;
            if (touser in users)
                users[touser].emit('private-chat', fromUser, message)
            socket.emit('private-chat',fromUser,message)

            var dbo = db.db("mydb");
            //Save message for fromuser
            dbo.collection('userhistory').insertOne({userName:fromUser,fromUser,name:touser, message,read:false, receiveTime: Date.now()},function(error,res){
                if (error)
                    throw error;
            })
            //Save message for touser
            dbo.collection('userhistory').insertOne({userName:touser,fromUser,name:fromUser,message,read:false, receiveTime: Date.now()},function(error,res){
                if (error)
                    throw error;
            })
        })
    })

    socket.on('have-new-user', (userName, password, email, fullName) => {
        //Step 1: check if the user exist in database
        mongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");

            var count = dbo.collection("users").countDocuments({ userName: userName }, { limit: 1 })
            //Step 1.1: if the user already exist, return the error
             
            if (count > 0) {
                socket.emit('error-register', 'User already exist')
                db.close();
                return
            }

            //Step 2: Insert new user to databse
            dbo.collection("users").insertOne(
                { userName: userName, password: password, email: email, fullName: fullName },
                function (err, res) {
                    if (err) {
                        //Step 2.1: Insert fail
                        socket.emit('error-register', 'Insert fail')
                        db.close();
                        throw err
                    }
                    //Step 2.2: register successfully
                    socket.emit('success-register', 'Register successfully!')
                }
            )

            db.close();

        })
    })


    socket.on('add-contact', (userName, contact,email) => {
        //Step 1: check if the user exist in database
        var count = 0;
        mongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("users").findOne(
             {userName:contact}               
            ).then(result =>{
                console.log('result',result)
                if (result !== null) {
                    dbo.collection("usercontact").insertOne(
                        { userName,contact, email},
                        function (err, res) {
                            if (err) {
                                //Step 2.1: Insert fail
                                socket.emit('add-contact-fail', 'Insert fail')
                                db.close();
                                throw err
                            }
                            //Step 2.2: add the new contact successfully
                            socket.emit('add-contact-successful', 'Added the contact successfully!')
                        }
                    ).then(result=>{
                        dbo.collection("usercontact").find({
                            userName
                        }).forEach(record=>{
                            console.log('contact',record)
                            socket.emit('contact-receive', record.contact)
                        })
                    })

                 }  else {
                     socket.emit('add-contact-fail', 'The user does not exist on the system!')
                 }      
            
                db.close();

            })
        })
    })


    socket.on('authentication', (userName, password) => {
        //Step 1: check if user exist in database
       
        mongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var query = { userName: userName, password:password}
           
            dbo.collection("users").find(query).toArray(function(err,res){ 
                    //Step 1.1: If the user exist, return fail
                    if (err) {
                        socket.emit('error-login', 'User name or password is wrong!')
                        db.close()
                        return
                    }
                    if (res.length > 0) {
                        socket.emit('success-login', 'Login Successfully!')
                        //Map sock id to userName
                        console.log('user login = ',res[0].userName)
                        users[res[0].userName] =  socket 

                        dbo.collection('broadcast').find().forEach(result=>{
                            socket.emit('broadcast',result.fromUser, result.message)
                        })

                        dbo.collection("usercontact").find({
                            userName:res[0].userName
                        }).forEach(record=>{
                            console.log('contact',record)
                            socket.emit('contact-receive', record.contact)
                        })
                        
                    }
                    else {
                        socket.emit('error-login', 'User name or password is wrong!')
                    }
                    db.close();                    
    
            })
            
        })
    })

    socket.on('load-history',(userRequest, messFromUser)=>{
        console.log('load-history:',userRequest,' ',messFromUser)
        mongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            if (messFromUser != "broadcast")
                dbo.collection('userhistory').find({
                    userName:userRequest,
                    name:messFromUser
                }).forEach(result=>{
                    socket.emit('private-chat',result.fromUser, result.message)
                })
            else
                dbo.collection('broadcast').find().forEach(result=>{
                    socket.emit('broadcast',result.fromUser, result.message)
                })
        })

    })

});



http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
})
