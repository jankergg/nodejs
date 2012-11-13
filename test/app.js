var express = require('express');

var app = express.createServer(),
    io = require('socket.io').listen(app,{log:0});

var db = require('mongoskin').db('admin:admin@localhost:27017/testdb',{safe:false});

db.collection('user').find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
});

var us =  db.collection('user');
us.remove({name:"QQ"});
// Configuration
app.configure(function(){
    app.set('views', __dirname + '/view');
    app.set('view engine', 'jade');
    app.set('view options', {layout: true});
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
    res.render('index', {
        title: 'MongoDB test',
        youAreUsingJade: true,
        domain: '192.168.100.178'
    });
});

app.get('/sub', function(req, res){
    res.render('subpage', {
        title: 'MongoDB test subpage',
        youAreUsingJade: true,
        domain: '192.168.100.178'
    });
});

app.listen(3000);
console.log("Express server listening on port 3000 in %s mode", app.settings.env);

io.sockets.on('connection', function (socket) {
    socket.on('_submit', function (data) {
        us.find().toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            for(var i=0;i<result.length;++i){
                var _this = result[i];
                if(_this._id==data.__id){
                    io.sockets.emit('_error',"索引值重复!");
                    return false
                }
            }
            if(!!data.__id){
                us.insert({_id:data.__id,name:data.__sn,value:data.__sv});
            }else{
                us.insert({name:data.__sn,value:data.__sv});
            }

            io.sockets.emit('printf',result);
        });
    });
});