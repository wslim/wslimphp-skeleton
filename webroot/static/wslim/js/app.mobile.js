/**
 * 应用程序级公共js
 */ 

// 轮播图
if (typeof require != 'undefined') {
	require(['TouchSlide'], function(){
		//轮播图通用js
		TouchSlide({
			slideCell:"#slidebox",
			titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
			mainCell:".bd ul", 
			effect:"leftLoop", 
			autoPage:true, //自动分页
			startFun:function(i){
				jQuery(".ifocus_tx ul li").eq(i).show().siblings().hide();
			}
		});
	});
}

//lazyload
require(['jquery', 'lazyload'], function ($) {
	// goto-top
	$(".goto-top").click(function(){
		$('html,body').animate({scrollTop:0},700);
	});
	
	//图片预加载
	$("img.lazy").lazyload({effect:"fadeIn",failurelimit:100,skip_invisible:false,placeholder: rootUrl + "/images/nopic.gif"});

});

// site-maps-switch
$('.site-maps-switch').click(function(e) {
	$('.site-maps').slideToggle();
});

