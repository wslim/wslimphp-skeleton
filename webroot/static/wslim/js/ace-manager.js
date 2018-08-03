/**
 * manager page js expect for login/index
 * ace-datatables has performance problem
 */
/*
require(['ace-datatables'], function(){
	var oTable1 = $('#main-list-table').dataTable( {
		"info": true,
		"paginate": false,
		"filter": true,
	} ); 
});
*/
require(['ace', 'util'], function(){
	// tabpage
	util.tabpage.listen();
	
	// listen ajax
	util.listenAjaxConfirm();
});

jQuery(function () {
	// image
	$(".pic-wrap").on('mouseover', function(){
		$(this).find('img').show();
	}).on('mouseout', function(){
		$(this).find('img').hide();
	});
	
	// tab-content
	$(".nav-tabs").find("li").first().addClass("active");
    $(".tab-content").find(".tab-pane").first().addClass("active").addClass("in");
	
	//filter-data
	$(".filter-data select").on('change', function(){
		var url = changeUrlParam(null, $(this).attr("name"), $(this).val());
		location.href = changeUrlParam(url, 'page', 1);
	});
	$(".filter-data-change").on('change', "input[type=hidden]", function(){
		var url = changeUrlParam(null, $(this).prop("name"), $(this).val());;
		location.href = changeUrlParam(url, 'page', 1);
	});
	$(".filter-data a").on("click", function(){
		var name = $(this).attr("data-name");
		if (name) {
			var url = changeUrlParam(null, name, $(this).attr("data-id"));
			if (location.href != url) location.href = url;
		}
	});
	$(".filter-data a").each(function(){
		var cname = $(this).attr("data-name") + '-' + $(this).attr("data-id");
	    if ($(this).hasClass(cname)) {
	    	$(this).parent("li").addClass("active").siblings(".filter-data").removeClass("active");
		}
	});
	
	// search submit
	$(".btn-search").on('click', function(){
	    var url = changeUrlParam(null, $('input[name=q]').attr("name"), $('input[name=q]').val());
	    url = changeUrlParam(url, 'page', 1);
	    location.href = url;
	});
	$('input[name=q]').on('keydown', function (e){
	    if (e.keyCode == 13) {
	        location.href = changeUrlParam(null, $('input[name=q]').attr("name"), $('input[name=q]').val());
	        return false;
	    }
	});
	
	// checkbox cbx-check-all
	$("input.cbx-check-all").on("click", function (e) {
		var inputs = $(this).attr("data-input");
		if (inputs) {
			$(inputs).prop("checked", $(this).prop("checked"));
		}
	});
	
	// show-type, class="show-type-wrap show-type-xxx" remember last value
	$("select[name=_show_type]").on("change", function () {
		var val = $(this).val() || "default";
		localStorage.setItem("$wslim_show_type", val);
		$(".show-type-wrap").hide();
		$(".show-type-" + val).show();
	});
	var _show_type = localStorage.getItem("$wslim_show_type");
	if (_show_type && _show_type != $("select[name=_show_type]").val()) {
		$("select[name=_show_type]").val(_show_type);
		$("select[name=_show_type]").trigger("change");
	}
	
	// get pinyin
    $("input[name=btn_get_pinyin]").on("click", function () {
    	var fromstr = $($(this).attr("data-from")).val();
    	var input = $($(this).attr("data-input"));
    	if (!fromstr) return;
    	
    	var url = rootUrl + "/api/common/getPinyin";
    	var data = {
    		    _form_token: $("input[name=_form_token]").val(),
    		    data:  fromstr
  		    };
    	var _self = $(this);
    	$.get(url, data, function(res){
            if (res.pinyin) {
            	if (!$(input).val()) {
            		$(input).val(res.pinyin);
            	} else {
            		var node = _self.next("label");
            		if (node.length <=0) {
            			node = _self.parent().append("<label></label>");
            		}
            		node.text(res.pinyin);
            	}
            }
            if (res.errcode) {
            	alert(res.errmsg + "[" + res.errcode + "]");
            }
        });
    });
    
    // print, use jquery.printThis plugin
    // <a class="print" data-print="#printElement">print</a>
    var peles = $(".print[data-print]");
    if (peles.length > 0) {
    	require(["jquery.printThis"], function (){
    		$(".print").on("click", function (){
    			var ele = $(this).attr("data-print");
    			var title = $(this).attr("data-print-title");
    			title = title || "";
    			if (ele && $(ele).length > 0) {
    				$(ele).printThis({
    			          debug: false,               // show the iframe for debugging
    			          importCSS: true,            // import page CSS
    			          importStyle: true,         // import style tags
    			          printContainer: true,       // grab outer container as well as the contents of the selector
    			          loadCSS: rootUrl + "/static/jquery.printThis.css",  // path to additional css file - use an array [] for multiple
    			          pageTitle: title,           // add title to print page
    			          removeInline: false,        // remove all inline styles from print elements
    			          printDelay: 333,            // variable print delay
    			          header: null,               // prefix to html
    			          footer: null,               // postfix to html
    			          base: false ,               // preserve the BASE tag, or accept a string for the URL
    			          formValues: true,           // preserve input/form values
    			          canvas: false,              // copy canvas elements (experimental)
    			          doctypeString: "",       // enter a different doctype for older markup
    			          removeScripts: false,       // remove script tags from print content
    			          copyTagClasses: false       // copy classes from the html & body tag
    			    });
    			}
    		});
    	});
    }

});



