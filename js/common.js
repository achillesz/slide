/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-4-28
 * Time: ����10:18
 * To change this template use File | Settings | File Templates.
 */
// �̳�
function Class(parent) {
    var kclass = function () {
        if (parent) {
            parent.apply(this, arguments);
        }
        this.init.apply(this, arguments);
    }
    if (parent) {
        kclass.prototype = new parent;
    }
    kclass.prototype.init = function () {
    };
    kclass.fn = kclass.prototype;
    kclass.fn.parent = kclass;
    kclass.extend = function (obj) {
        var extended = obj.extended;
        for (i in obj) {
            if (!kclass[i]) {
                kclass[i] = obj[i];
            }
        }
        if (extended) extended(kclass);
    }
    kclass.include = function (obj) {
        var included = obj.included;
        for (i in obj) {
            kclass.fn[i] = obj[i];
        }
        if (included) {
            included(kclass);
        }
        return kclass;
    }
    kclass.proxy = function (func) {
        var self = this;
        return(function () {
            return func.apply(self, arguments);
        });
    }
    return kclass;
}

// Add Class Drag
var Drag = Class();
// ��ʼ����
Drag.fn.init = function(dragEle){
    this.dragEle = dragEle;
    this.tar =  null;
    this.sL = 0;
    this.sT = 0;
    this.disX = 0;
    this.disY = 0;
    this.start();
};
// ��չԭ��
Drag.include({
    start:function(){
        var _this = this;
        this.dragEle.mousedown(function(e){
            _this.downHandler(e);
        });
    },
    downHandler:function(e){
        var _this = this;
        function moveHandler(e){
            _this.moveHandler(e);
        }
        function upHandler(e){
            $(document).unbind('mousemove',moveHandler);
            $(document).unbind('mouseup',upHandler);
        }
        var offset = this.dragEle.offset();
        this.sL = $(window).scrollLeft();
        this.sT = $(window).scrollTop();
        this.disX = e.clientX + this.sL - offset.left;
        this.disY = e.clientY + this.sT - offset.top;
        $(document).mousemove(moveHandler);
        $(document).mouseup(upHandler);
        if(e.stopPropagation){
            e.stopPropagation();
        }
        e.cancelable = true;
    },
    moveHandler:function(e){
        var x, y,ele = this.dragEle,offset = ele.offset();
        this.tar = ele.parent();
        this.sL = $(window).scrollLeft();
        this.sT = $(window).scrollTop();
        x = e.clientX + this.sL - this.disX;
        y = e.clientY + this.sT - this.disY;
        this.tar.css('left',x);
        this.tar.css('top',y);
    }
});

// add Tab Class
var Tab = Class();
// ��ʼ����
Tab.fn.init = function(options){
    this.elem = null;
    this.navs = null;
    this.cons = null;
    this.type = 'click';
    this.firstDisplay = 0;
    this.onClass = '';
    this.callback = null;
    $.extend(this,options);
    this.start();
};
// ��չԭ��
Tab.include({
    start:function(){
        this.navs = this.ele.find('ul:first li');
        this.cons = this.ele.children('div');
        this.navs.eq(this.firstDisplay).addClass(this.onClass);
        this.cons.hide();
        this.cons.eq(this.firstDisplay).show();
        this.bindEvent();
    },
    bindEvent:function(){
        _this = this;
        this.navs.bind(this.type,function(){
            var index = this.index;
            _this.navs.removeClass(_this.onClass);
            _this.navs.eq(index).addClass(_this.onClass);
            _this.cons.hide();
            _this.cons.eq(index).show();
            if(typeof _this.callback === 'function'){
                _this.callback();
            }
        })
    }
});

// add Class from the value to the other value
var Animate = Class();
Animate.fn.init = function(options){
    this.ele = null;
    this.value = 0;
    this.tar = 0;
    this.time = null;
    this.speed = 5;
    this.speed2 = 30;
    this.attr = '';
    this.animated = false;
    $.extend(this,options);
    this.start();
}
Animate.include({
    start:function(){
        var _this = this;
        this.time = setInterval(function(){
            //console.log(1)
            _this.doIt(_this.attr);
        },this.speed2)
    },
    getValue:function(attr){
        if(attr === 'opacity'){
           return this.ele.css(attr)*100;
        }
        return parseInt(this.ele.css(attr));
    },
    setValue:function(attr,value){
        if(attr == 'opacity'){
            return this.ele.css(attr,value/100);
        }
        this.ele.css(attr,value);
    },
    doIt:function(attr){

        this.animated = true;
        var iSpeed;
        this.value = this.getValue(attr);
        iSpeed = (this.tar - this.value) > 0 ? Math.ceil((this.tar - this.value) / this.speed ) : Math.floor((this.tar - this.value) / this.speed);
        this.value += iSpeed;
        if(this.value === this.tar){
            this.animated = false;
            this.clear();
        }
        this.setValue(attr,this.value);
    },
    clear:function(){
        clearInterval(this.time);
    }
});
// add slide Class
var Slide = Class();
Slide.fn.init = function(options){
    this.ele = null;
    this.eleTar = null;
    this.time1 = null;
    this.time2 = null;
    this.speed1 = 3000;
    this.speed2 = 30;
    this.speed3 = 8;
    this.baseW = 0;
    this.nowIndex = 0;
    this.len = 0;
    this.attr = 'left';
    this.tar = 0;
    this.animated = null;
    $.extend(this,options);
    this.start();
};
Slide.include({
    start:function(){
        var _this = this;
        this.baseW = this.ele.find('li').eq(0).width();
        this.len = this.ele.find('li').length;
        this.eleTar =  this.ele.find('ul');
        this.eleTar.append(this.ele.find('ul').html());
        this.bindEvent();
        this.time1 = setInterval(function(){
            _this.setIndex();
            _this.doMove(_this.nowIndex);
        },this.speed1);
    },
    doMove:function(index){
        var _this = this;
        this.tar = -index*this.baseW;
        //console.log(this.tar);
        this.time2 = setInterval(function(){
            _this.doIt(_this.attr);
        },this.speed2);
    },
    setIndex:function(index){
        if(typeof index != 'number'){
            this.nowIndex++;
        }
        else{
            this.nowIndex--;
        }
        if(this.nowIndex === this.len + 1){
            this.ele.find('ul').css('left','0px');
            this.nowIndex = 0;
            this.nowIndex++;
        }
        if(this.nowIndex === -1){
            this.eleTar.css('left',-this.baseW*this.len);
            this.nowIndex = this.len-1;
        }
    },
    bindEvent:function(){
        var _this = this;
        this.ele.find('.btnPre').bind('click',function(){
            if(_this.animated === true) return;
            _this.clear1();
            _this.setIndex(1);
            _this.doMove(_this.nowIndex);
            if(_this.animated === false){
                _this.time1 = setInterval(function(){
                    _this.setIndex();
                    _this.doMove(_this.nowIndex);
                },_this.speed1);
            }
        });
        this.ele.find('.btnNext').bind('click',function(){
            if(_this.animated === true) return;
            _this.clear1();
            _this.setIndex();
            _this.doMove(_this.nowIndex);
            if(_this.animated === false){
                _this.time1 = setInterval(function(){
                    _this.setIndex();
                    _this.doMove(_this.nowIndex);
                },_this.speed1);
            }
        })
    },
    getValue:function(attr){
        if(attr === 'opacity'){
            return this.ele.css(attr)*100;
        }
        return parseInt(this.eleTar.css(attr));
    },
    setValue:function(attr,value){
        if(attr == 'opacity'){
            return this.eleTar.css(attr,value/100);
        }
        this.eleTar.css(attr,value);
    },
    doIt:function(attr){
        this.animated = true;
        var iSpeed;
        this.value = this.getValue(attr);
        iSpeed = (this.tar - this.value) > 0 ? Math.ceil((this.tar - this.value) / this.speed3 ) : Math.floor((this.tar - this.value) / this.speed3);
        this.value += iSpeed;
        if(this.value === this.tar){
            this.animated = false;
            this.clear2();
        }
        this.setValue(attr,this.value);
    },
    clear2:function(){
        clearInterval(this.time2);
    },
    clear1:function(){
        clearInterval(this.time1);
    }
});



