  // 轮播图js
var src = window.location.href;
if (src.indexOf("index.html") >= 0){

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
          if (leftsize !== lb_boxwidth && num > 0) {
              lb_box.style.transition = "none";
              lb_box.style.left = -leftsize + "px";
          }
      };

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
          if (num === lb_imglist - 1) {
              setTimeout(function del() {
                  //清除切换样式，无感知最后一张到第一张
                  lb_box.style.transition = "none";
                  lb_box.style.left = -newwidth + "px";
              }, 300);
          }
      };

      lbtn.onclick = function() {
          num--;
          newwidth = document.body.clientWidth;
          if (num < 0) {
              num = lb_imglist - 1;
          }
          left(newwidth);
          if (num === 1) {
              setTimeout(function del() {
                  lb_box.style.transition = "none";
                  lb_box.style.left = -newwidth * (lb_imglist - 1) + "px";
                  num = lb_imglist - 1;
              }, 300);
          }
      };

      //下标被点击：获取点击位置，切换到点击页面
      for (var i = 0; i < lb_pointlist.length; i++) {
          //设定下标索引
          lb_pointlist[i].setAttribute("p_index", i);
          lb_pointlist[i].onclick = function() {
              num = this.getAttribute("p_index");
              newwidth = document.body.clientWidth;
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
      };
      //移除鼠标继续定时器
      lb_box_f.onmouseleave = function() {
          timer = setInterval(function() {
              rbtn.onclick();
          }, 4000);
      };

      function left(newwidth) {
          lb_box.style.transition = "left 0.3s linear";
          //如果屏幕宽度改变，偏移量按照改变后的宽度设定
          if (0 < newwidth && newwidth !== lb_boxwidth) {
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

  };
}




/**
 * CSS3 答题卡翻页效果
 */
$.fn.answerSheet = function (options) {
    var defaults = {mold: 'card',};
    var opts = $.extend({}, defaults, options);
    return $(this).each(function () {
        var obj = $(this).find('.card_cont');
        var _length = obj.length, _b = _length - 1, _len = _length - 1, _cont = '.card_cont';
        for (var a = 1; a <= _length; a++) {
            obj.eq(_b).css({'z-index': a});
            _b -= 1;
        }
        $(this).show();
        if (opts.mold === 'card') {
            obj.find('.op-list .next').click(function () {
                var _idx = $(this).parents(_cont).index(), _cards = obj, _cardcont = $(this).parents(_cont);
                if (_idx === _len) {
                    return
                } else {
                    setTimeout(function () {
                        _cardcont.addClass('cardn');
                        setTimeout(function () {
                            _cards.eq(_idx + 3).addClass('card3');
                            _cards.eq(_idx + 2).removeClass('card3').addClass('card2');
                            _cards.eq(_idx + 1).removeClass('card2').addClass('card1');
                            _cardcont.removeClass('card1');
                        }, 200);
                    }, 100);
                }
            });
            $('.op-list').find('.prev').click(function () {
                var _idx = $(this).parents(_cont).index();
                obj.eq(_idx + 2).removeClass('card3').removeClass('cardn');
                obj.eq(_idx + 1).removeClass('card2').removeClass('cardn').addClass('card3');
                obj.eq(_idx).removeClass('card1').removeClass('cardn').addClass('card2');
                setTimeout(function () {
                    obj.eq(_idx - 1).addClass('card1').removeClass('cardn');
                }, 200);
            })
        }
    });
};


/*
    Pinterest Grid Plugin
    Copyright 2014 Mediademons
    @author smm 16/04/2014

    usage:

     $(document).ready(function() {

        $('#blog-landing').pinterest_grid({
            no_columns: 4
        });

    });
*/
(function ($, window) {
    var pluginName = 'pinterest_grid',
        defaults = {
            padding_x: 10,
            padding_y: 10,
            no_columns: 3,
            margin_bottom: 50,
            single_column_breakpoint: 700
        },
        columns,
        $article,
        article_width;

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function () {
        var self = this,
            resize_finish;

        $(window).resize(function() {
            clearTimeout(resize_finish);
            resize_finish = setTimeout( function () {
                self.make_layout_change(self);
            }, 11);
        });

        self.make_layout_change(self);

        setTimeout(function() {
            $(window).resize();
        }, 500);
    };

    Plugin.prototype.calculate = function (single_column_mode) {
        var self = this,
            row = 0,
            $container = $(this.element);
        $article = $(this.element).children();

        if(single_column_mode === true) {
            article_width = $container.width() - self.options.padding_x;
        } else {
            article_width = ($container.width() - self.options.padding_x * self.options.no_columns) / self.options.no_columns;
        }

        $article.each(function() {
            $(this).css('width', article_width);
        });

        columns = self.options.no_columns;

        $article.each(function(index) {
            var current_column,
                left_out = 0,
                top = 0,
                $this = $(this),
                prevAll = $this.prevAll();

            if(single_column_mode === false) {
                current_column = (index % columns);
            } else {
                current_column = 0;
            }

            for(var t = 0; t < columns; t++) {
                $this.removeClass('c'+t);
            }

            if(index % columns === 0) {
                row++;
            }

            $this.addClass('c' + current_column);
            $this.addClass('r' + row);

            prevAll.each(function() {
                if($(this).hasClass('c' + current_column)) {
                    top += $(this).outerHeight() + self.options.padding_y;
                }
            });

            if(single_column_mode === true) {
                left_out = 0;
            } else {
                left_out = (index % columns) * (article_width + self.options.padding_x);
            }

            $this.css({
                'left': left_out,
                'top' : top
            });
        });

        this.tallest($container);
        $(window).resize();
    };

    Plugin.prototype.tallest = function (_container) {
        var column_heights = [];

        for(var z = 0; z < columns; z++) {
            var temp_height = 0;
            _container.find('.c'+z).each(function() {
                temp_height += $(this).outerHeight();
            });
            column_heights[z] = temp_height;
        }

        largest = Math.max.apply(Math, column_heights);
        _container.css('height', largest + (this.options.padding_y + this.options.margin_bottom));
    };

    Plugin.prototype.make_layout_change = function (_self) {
        if($(window).width() < _self.options.single_column_breakpoint) {
            _self.calculate(true);
        } else {
            _self.calculate(false);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);

function clickFooter(){
  $(".alert-box").css({
    display: ""
  });
  var timeId1 = setTimeout(function() {
    $(".alert-box").addClass('a-fadeout');
    var timeId2 = setTimeout(function() {
      $(".alert-box").css({
        display: "none"
      }).removeClass('a-fadeout');
      clearTimeout(timeId1);
      clearTimeout(timeId2);
    }, 1000)
  }, 3000)
}
function toAboutMe(){
  window.location.href = "./aboutMe.html"
}

// 移动端header菜单样式
$(document).ready(function(){
  $(".hamburger").click(function(){
      $(this).toggleClass("is-active");
  });
});