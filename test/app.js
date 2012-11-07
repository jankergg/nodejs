var express = require('express');

var app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);

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
        title: 'Express index',
        youAreUsingJade: true,
        domain: '192.168.100.178'
    });
});

app.get('/sub', function(req, res){
    res.render('subpage', {
        title: 'Express subpage',
        youAreUsingJade: true,
        domain: '192.168.100.178'
    });
});

app.listen(3000);
console.log("Express server listening on port 3000 in %s mode", app.settings.env);

io.sockets.on('connection', function (socket) {
    socket.on('keypress', function (data) {
        console.log(data,"----");
        io.sockets.emit('getmsg',{key:data});
    });
});