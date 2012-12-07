var express = require('express');

var app = express.createServer(),
    io = require('socket.io').listen(app,{log:0});

var db = require('mongoskin').db('admin:admin@localhost:27017/testdb',{safe:false});

/*
db.collection('user').find({name:"city"}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
});
*/

var us =  db.collection('user');

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

app.get('/login', function(req, res){
    res.render('login', {
        title: 'login page',
        youAreUsingJade: true,
        domain: '192.168.100.178'
    });
});

app.get('/admin', function(req, res){
    res.render('admin', {
        title: 'Product Manager',
        youAreUsingJade: true,
        domain: '192.168.100.178'
    });
});

app.listen(3000);
console.log("Express server listening on port 3000 in %s mode", app.settings.env);

io.sockets.on('connection', function (socket) {
    var socket = socket;

    socket.on('_submit', function (data) {
        var _result = {};
        //console.log(data.__id)
        us.find().toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            for(var i=0;i<result.length;i++){
                if(result[i]._id==data.__id){
                    socket.emit('_error',"索引值重复!");
                    _result.id=result[i]._id;
                    return false
                }
            }

            us.insert({_id:(!!data.__id)?data.__id:undefined,name:data.__sn,value:data.__sv});
            _result._id=data.__id;
            _result.name=data.__sn;
            _result.value=data.__sv;

            socket.emit("_printf",_result);
        });
    });

    socket.on('_search', function (data) {

        us.find(data).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            socket.emit("_printfResult",result);
        });

    });

    socket.on('_del', function (data) {
        if(!!data._id||!!data.name||!!data.value)
        us.remove(data);
        socket.emit("_printfResultDEL","删除完毕！");
    });
});