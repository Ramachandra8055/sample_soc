
var mysql = require('mysql') ;
var io = require('socket.io').listen(3000) ;

var db = mysql.createConnection({
    host:'192.168.0.140',
    user:'apssdctest',
    password:'Novi1234',
    database:'apssdctest',
    connectionLimit : 0
 
});

db.connect(function(err){
    if(err) console.log(err);
    console.log("Connected Successfully To The Database");
});

// Here We Need List Of Competitions To Emit To All Clients 

var Competitions = [] ;
var isInitCompetitions = false ;
var socketCount = 0 ;


//
io.sockets.on('connection',function(socket){
     Competitions = [] ;

    db.query("SELECT * FROM `userDisability").on(
        'result',function(data) {
            Competitions.push(data) ;
        }
    ).on(
        'end',function(){
            socket.emit('all competitions',Competitions);
        }
    ) ;
socketCount++ ;
io.sockets.emit('Another User Is Connected : ' ,socketCount);
console.log('One User Is Connected'+socketCount);
socket.on('disconnect',function() {
    io.sockets.emit('One User Left : ' ,socketCount);
});

function checkNewCompetitions() {
    Competitions=[];

/// Every 3 seconds you check the database for new comps
        db.query("SELECT * FROM `userDisability").on(
            'result',function(data) {
               
                Competitions.push(data) ;

            }
        ).on(
            'end',function(){

// here you have to call socket.emit('newComp') 
// so the client gets the event a new comp is inserted in database. 
                socket.emit('all competitions',Competitions);
                console.log('Number Of Competitions in Flow : ' , Competitions.length) ;
            }
        ) ;

}

setInterval(checkNewCompetitions,3000);
});