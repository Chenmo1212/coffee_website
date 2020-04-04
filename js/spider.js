
// 轮播图js
window.onload = function() {

    var lb_box = this.document.getElementsByClassName("lb_imgleft")[0];

    //初始化默认宽度
    var lb_boxwidth = this.document.body.clientWidth;

    var lb_imglist = this.document.getElementsByClassName("lb_li").length;

    var lbtn = this.document.getElementsByClassName("lb_btnl")[0];

    var rbtn = this.document.getElementsByClassName("lb_btnr")[0];

    var lb_pointlist = this.document.getElementsByClassName("lb_olli");

    var num = 0;
    var newwidth = 0;
    //监听屏幕宽度响应轮播图宽度li大小缩放产生的偏移量
    window.onresize = function() {
        var leftsize = document.body.clientWidth;
        if (leftsize != lb_boxwidth && num > 0) {
            lb_box.style.transition = "none";
            lb_box.style.left = -leftsize + "px";
        }
    }

    //点击事件
    rbtn.onclick = function() {

        num++;
        //获取自适应屏幕改变后宽度
        newwidth = document.body.clientWidth;
        if (num > lb_imglist - 1) {
            num = 2;
        }
        left(newwidth);
        //到最后一张的时候，快速切换到第一张，需要加延时等到倒数第二张切换到最后
        //一张的动作结束才执行，否则立即执行会有左滑效果，延时时间等于动画时间
        if (num == lb_imglist - 1) {
            setTimeout(function del() {
                //清除切换样式，无感知最后一张到第一张
                lb_box.style.transition = "none";
                lb_box.style.left = -newwidth + "px";
            }, 300);
        }
    }

    lbtn.onclick = function() {
        num--;
        newwidth = document.body.clientWidth;;
        if (num < 0) {
            num = lb_imglist - 1;
        }
        left(newwidth);
        if (num == 1) {
            setTimeout(function del() {
                lb_box.style.transition = "none";
                lb_box.style.left = -newwidth * (lb_imglist - 1) + "px";
                num = lb_imglist - 1;
            }, 300);
        }
    }

    //下标被点击：获取点击位置，切换到点击页面
    for (var i = 0; i < lb_pointlist.length; i++) {
        //设定下标索引
        lb_pointlist[i].setAttribute("p_index", i);
        lb_pointlist[i].onclick = function() {
            num = this.getAttribute("p_index");
            newwidth = document.body.clientWidth;;
            left(newwidth);
        }
    }


    //自动轮播，模拟点击
    var timer = setInterval(function() {
        rbtn.onclick();
    }, 4000);
    //鼠标移入暂停，移入鼠标清除自动定时器
    var lb_box_f = document.getElementsByClassName("lb_box")[0];
    lb_box_f.onmouseenter = function() {
        clearInterval(timer);
    }
    //移除鼠标继续定时器
    lb_box_f.onmouseleave = function() {
        timer = setInterval(function() {
            rbtn.onclick();
        }, 4000);
    }

    function left(newwidth) {
        lb_box.style.transition = "left 0.3s linear";
        //如果屏幕宽度改变，偏移量按照改变后的宽度设定
        if (0 < newwidth && newwidth != lb_boxwidth) {
            lb_box.style.left = -newwidth * num + "px";
        } else {
            lb_box.style.left = -lb_boxwidth * num + "px";
        }

        //小圆点
        for (var i = 0; i < lb_pointlist.length; i++) {
            lb_pointlist[i].style.backgroundColor = "transparent";
            if (num < 4) {
                lb_pointlist[num].style.backgroundColor = "snow";
            } else {

                lb_pointlist[num - 4].style.backgroundColor = "snow";
            }
        }
    }

}