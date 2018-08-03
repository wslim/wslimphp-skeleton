/**
 * app level, first load require
 */
// slide common
require(['SuperSlide'], function(){
	jQuery(".slidebox").slide({
		titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
		mainCell:".bd ul",
		autoPlay:true,
		autoPage:true,
		effect:"leftLoop",
		startFun:function(i){
			jQuery(".ifocus_tx ul li").eq(i).show().siblings().hide();
		}
	});
})

require(['jquery'], function ($) {
	// goto-top
	$(".goto-top").click(function(){
		$('html,body').animate({scrollTop:0},700);
	});
	
	// menu
    $('.menu li').mouseover(function(){
        $(this).children('ul').show();
    }).mouseout(function(){
        $(this).children('ul').hide(); //fadeOut(1600, "linear");
    });

    // visit-mobile
    $(".visit-mobile").on('click', function(e){
    	url = $(this).attr('data-url');
    	if (!url) url = $(this).attr('href'); 
    	delcookie('forcetype');
    	location.href = url;
    	return false;
    });
});

// lazyload
require(['jquery', 'lazyload'], function ($) {
	//图片预加载
	$("img.lazy").lazyload({effect:"fadeIn",failurelimit:100,skip_invisible:false,placeholder: rootUrl + "/images/nopic.gif"});

});

