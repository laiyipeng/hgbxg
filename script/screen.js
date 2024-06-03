;(function(win,doc){
    //动态设置font-size值
    var h ,setUnitA ;
    win.addEventListener('resize',function () {
        clearTimeout(h);
        h = setTimeout(setUnitA,300);
    },false);
    win.addEventListener('pageshow',function(e){
        if(e.persisted){
            clearTimeout(h);
            h = setTimeout(setUnitA,300);
        }
    },false);
    
    setUnitA = function(){
        doc.style.fontSize =  parseInt(doc.clientWidth/32)+'px';
    }
    setUnitA();

    /**
     * IOS7 顶部样式
     */
    var linkObj = document.getElementById('css_for_ios');
    var uaparser , os , version;
    if(linkObj){
        if($.os.ios){
            var version = $.os.version.split('.')[0];
            version = parseInt(version,10);
            if(version>6){
                return ;
            }
        }
        linkObj.disabled = true;
    }


    window.TV = window.TV || {};
    /**
     * fix 浮点运算Bug
     */

    var NumHelp = {
        add : function(arg1,arg2){
            var r1, r2, m;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            return (arg1 * m + arg2 * m) / m;
        },
        sub : function(arg1,arg2){
            var r1, r2, m, n;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            //动态控制精度长度  
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        },
        mul : function(arg1,arg2){
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try { m += s1.split(".")[1].length } catch (e) { }
            try { m += s2.split(".")[1].length } catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        },
        div : function(arg1,arg2){
            var t1 = 0, t2 = 0, r1, r2;
            try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
            try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
            with (Math) {
                r1 = Number(arg1.toString().replace(".", ""));
                r2 = Number(arg2.toString().replace(".", ""));
                return (r1 / r2) * pow(10, t2 - t1);
            }
        }
    }
     
    window.TV.NumHelp = NumHelp;



    /**
     * 模板
     */ 
    var ya = function(str) {
        //核心分析方法
        var _analyze = function(text) {
            return text.replace(/{\$(\s|\S)*?\$}/g, function(s) {
                return s.replace(/("|\\)/g, "\\$1")
                    .replace("{$", '_s.push("')
                    .replace("$}", '");')
                    .replace(/{\%([\s\S]*?)\%}/g, '",$1,"').replace(/\r\n|\n/g, "\\n");
            });
        };
        //中间代码
        var _temp = "var _s=[];" + _analyze(str) + " return _s;";
        //返回生成器render方法
        return {
            render: function(mapping) {
                var _a = [],
                    _v = [],
                    i;
                for (i in mapping) {
                    _a.push(i);
                    _v.push(mapping[i]);
                }
                return (new Function(_a, _temp)).apply(null, _v).join("");
            }
        }
    }
    
    var TempHelper = function(el,temp){
        this.element = el;
        this.temp    = temp;
    }
    TempHelper.prototype = {
        empty  : function(){
            this.element.empty();
            return this;
        },
        getRenderStr : function(data){
            return this.temp.render(data);
        },
        update : function(data){
            this.element.html( this.getRenderStr(data) );
            return this;
        },
        before : function(data){
            this.element.prepend( this.getRenderStr(data) );
            return this;
        },
        after  : function(data){
            this.element.append( this.getRenderStr(data) );
            return this;
        }
    }

    window.TV.bindTemp = function(element,temp){
        var tmp = ya( temp.html() );
        return new TempHelper(element,tmp);
    }

     /**
     * Number + - 组件
     */
    var UiNumbox = function($dom) {
        $dom.each(function() {
            var that = $(this);
            var $input = that.find('input.mui-numbox-input');
            var $mins = that.find('button.mui-numbox-btn-minus');
            var $plus = that.find('button.mui-numbox-btn-plus');

            if (!$input.val()) {
                $input.val(0);
            }

            var min = that.attr('data-numbox-min');
            var max = that.attr('data-numbox-max');
            var step = that.attr('data-numbox-step');
            min = parseInt(min, 10);
            max = parseInt(max, 10);
            step = parseInt(step, 10);

            $mins.on('tap', function() {
                var value = $input.val();
                value = parseInt(value, 10);
                if (value - step >= min) {
                    value -= step;
                    $input.val(value);

                    $input.trigger('change');
                }

            });
            $plus.on('tap', function() {
                var value = $input.val();
                value = parseInt(value, 10);
                if (value + step <= max) {
                    value += step;
                    $input.val(value);
                    $input.trigger('change');
                }

            });

        });
    }

    window.TV.UiNumbox = UiNumbox;
   



})(window,document.documentElement);