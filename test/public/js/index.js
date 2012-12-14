function admin_init() {
    $("#btn-set").click(function(){
        alert("0");
        var $stime = $('#starttime').val(),$etime = $('#endtime').val(),$pid = $('#pid').val();
        if($etime!==""&&$pid!==""){
            socket.emit("_setprice",{__st:$stime,__et:$etime,__id:$pid})
        }
        $('#starttime').val("");
        $('#endtime').val("");
        $('#pid').val("");
    });
}

//定时器构造函数
function Timer(time,obj,callback){
    /*参数说明
     time:设置结束时间，必填
     时间格式：年/月/日 时:分:秒
     obj:设置显示计时结果的对象或元素ID，可不填
     callback:计时结束时的触发函数，可不填
     */
    this.arg = arguments;
    this.sDate = new Date();
    this.eDate = new Date(time);
    this.aDate = this.eDate.getTime() - this.sDate.getTime();
    this.s = this.aDate/1000;
    this.m = this.s/60;
    this.h = this.m/60;
    this.d = this.h/24;
    this.sec = (Math.floor(this.s%60)<10)?"0"+Math.floor(this.s%60):Math.floor(this.s%60);
    this.min = Math.floor(this.m%60);
    this.hour= Math.floor(this.h%24);
    this.day = Math.floor(this.d%365);
    this.o = document.getElementById((this.arg.length>1&&(typeof this.arg[1]=="object"||typeof this.arg[1]=="string"))?this.arg[1]:undefined);
    this.callback = this.arg.length>1 && typeof this.arg[this.arg.length-1]=="function";

    Timer.prototype.formatTime = function(_time) {
        return _time.replace(/\b(\w)\b/g, '0$1');
    };

    Timer.prototype.timeout = function(){
        var that = this;
        return function(){
            setTimeout(function(){that.fire();that=null},1000);
        }()
    };

    Timer.prototype.fire = function(){
        var _this = this;
        _this.sec --;
        if (_this.sec == -1) {
            _this.min --;
            _this.sec = 59;
        }
        if (_this.min == -1) {
            _this.hour --;
            _this.min = 59;
        }
        if (_this.hour == -1) {
            _this.day --;
            _this.hour = 23;
        }
        if(_this.sec>=0 && _this.min>=0 && _this.hour>=0 && _this.day>=0){
            if(_this.o)_this.o.innerHTML = this.formatTime(_this.day+"天"+_this.hour+"时"+_this.min+"分"+_this.sec+"秒");
            this.timeout()
        }else{
            if(_this.o)_this.o.innerHTML = "活动已结束！";
            this.timeout = null;
            if(!(_this.sec>0) && !(_this.sec<0)){return}
            if(_this.callback){
                _this.arg[_this.arg.length-1]()
            }
        }
    };
    return this.fire()
}
