/**
 * util
 * util.dialog need dialog.js
 * dataTable 扩展设置，需要独立加载，不能异步加载
 */
//define(['jquery'], function($){

	var util = {};
	
	// form submit listen
	util.listenFormSubmit = function($configs){
		var initParams = {
			form: "mainform",
			close: false,
			redirect: true,
			showtip: true
		}
		initParams= $.extend(initParams, $configs);
		var form = $("#" + initParams['form']);
		if (form.length <= 0 ) form = $("form");
		if (form.length <= 0) return;
		
		// submit
		form.off('submit').on('submit', function(event) {
	    	event.preventDefault();
	    	
    		if (form.attr('action') && form.attr('action') != 'undefined') {
	    		initParams.url = form.attr('action');
	    	} else if (!initParams.url || initParams.url == 'undefined') { 
	    		initParams.url = window.location.href;
	    	}
	    	
	    	$.ajax({
	    	    type: 'post',
	    	    url: initParams.url,
	    	    dataType: 'json',
	    	    //data: $(this).serialize(),
	    	    data: $(this).serializeArray(),
	    	    success: function(res) {
	    	    	if (typeof res.errcode == "undefined") {
	    	    		util.dialog.alert("服务未响应，待会重试");
	    	    	} else if (!res.errcode || res.errcode == '0') {
    	        		if (!res.errmsg) {
    	        			res.errmsg = "操作完成";
        	        	}
    	        		
    	        		util.dialog.alert(res.errmsg, function(){
    	        			
    	        			if (initParams.close) {
    	        				util.tabpage.close();
    	        			}
    	        			if (initParams.redirect) {
    	        				if (res.url) {
    	        					initParams.redirect = res.url;
    	    	        		}
    	        				
     	        				window.location.href = initParams.redirect == true ? initParams.url : initParams.redirect;
     	        			}
    	        		});
        			} else {
        				util.dialog.alert(res.errmsg + "[" + res.errcode + "]");
        			}
    	        	
	    	        return false;
	    	    }
	    	});
	        return false;
	    });
	};
		
	// data-op=confirm 属性元素监听
	util.listenAjaxConfirm = function() {
		if ($("[data-op=confirm]").length <= 0) return;
		
		util.listenFormSubmit({
			redirect: location.href
			,showtip: true
		});
		
		//listen confirm element click event
		$("[data-op=confirm]").off('click').on('click', function(event) {
			var result = confirm($(this).attr('data-title'));
			if (result) {
				var form = $("form");
				var element = form.find("input[name=data-id]");
				if (element.length == 0) {
					element = document.createElement("input");
					element.name = "data-id";
					element.setAttribute('type', 'hidden');
					element.setAttribute('value', $(this).attr('data-id'));
					//element="<input type='text' name='data-id' value='" + $(this).attr('data-id') + "'>";
					form.append(element);
				} else {
					element.val($(this).attr('data-id'));
				}
				form.attr('action', $(this).attr('data-url'));
			    form.submit();
			    form.attr('action', '');
			}
		    if (event.isDefaultPrevented()) {
		    	event.preventDefault();
		    }
		});
	};
		
	// dataTable 扩展默认配置，需要在dom前加载
	if ($.fn.dataTable) {
		$.extend( true, $.fn.dataTable.defaults, {
		    "searching": true,
		    "ordering": false,
		    "autoWidth": false,
		    //'language': {'url': 'lang/zh-cn/jquery.dataTables.json'},	//http run, path parse problem?
		    "language": {
		        "sProcessing": "处理中...",
		        "sLengthMenu": "显示_MENU_项结果",
		        "sZeroRecords": "没有匹配结果",
		        "sInfo": "显示第_START_至_END_项结果，共_TOTAL_项",
		        "sInfoEmpty": "显示第0至0项结果，共0项",
		        "sInfoFiltered": "(由_MAX_项结果过滤)",
		        "sInfoPostFix": "",
		        "sSearch": "搜索:",
		        "sUrl": "", 
		        "sEmptyTable": "表中数据为空",
		        "sLoadingRecords": "载入中...",
		        "sInfoThousands": ",",
		        "oPaginate":{
		            "sFirst": "首页",
		            "sPrevious": "上页",
		            "sNext": "下页",
		            "sLast": "末页"
		        },
		        "oAria":{
		            "sSortAscending" : ":以升序排列此列",
		            "sSortDescending" : ":以降序排列此列"
		        }
		    }
		    ,"fnDrawCallback" : function(){
			    //alert('finish');
			    listenConfirm();
			    resizeSelfIframe();
			}
		} );
	};
	
	// placeholder 属性扩展
	(function(t) {
	    t.fn.nc_placeholder = function() {
	        var a = "placeholder" in document.createElement("input");
	        return this.each(function() {
	            if (!a) {
	                $el = t(this);
	                $el.focus(function() {
	                    if ($el.attr("placeholder") === $el.val()) {
	                        $el.val("");
	                        $el.attr("data-placeholder", "")
	                    }
	                }).blur(function() {
	                    if ($el.val() === "") {
	                        $el.val($el.attr("placeholder"));
	                        $el.attr("data-placeholder", "placeholder")
	                    }
	                }).blur()
	            }
	        })
	    }
	})(jQuery);

	// util.page
	util.page = function(pageSize,currentPage,totalCount,displayNum,params) {
        var defaultParams={
            hint:'<span class="pageHint">总共<span class="totalPage">{totalPage}</span>页,共<span class="totalCount">{totalCount}</span>条记录</span>'
        };
        if (params) {
            defaultParams= $.extend(defaultParams,params);
        }
        if(!totalCount||totalCount==0)
            return '';

        displayNum=!displayNum?6:displayNum;
        var totalPage=Math.ceil(totalCount/pageSize);
        var html="<div class='pageContainer'><span class='pagePart'>";
        if(currentPage<=1) {
            html+='<span class="firstPage short" title="第一页"></span>';
            html+='<span class="prevPage short" title="上一页"></span>';
        }
        else {
            html+='<a href="javascript:;" class="firstPage short" title="第一页" page="1"></a>';
            var prevPage=parseInt(currentPage)-1;
            html+='<a  href="javascript:;" class="prevPage short" title="上一页" page="'+prevPage+'"></a>';
        }
        var flowNum=Math.floor(displayNum/2);
        var leftTicks=displayNum%2==0?flowNum:flowNum;
        var rightTicks=displayNum%2==0?flowNum-1:flowNum;

        var minPage=1;
        var maxPage=totalPage;
        if(currentPage>(leftTicks+1)&&totalPage>displayNum)
        {
            minPage=currentPage-leftTicks;
            maxPage=minPage+displayNum-1;
        }
        if(currentPage>totalPage-rightTicks&&totalPage>displayNum)
        {
            maxPage=totalPage;
            minPage=totalPage-displayNum+1;
        }
        if(currentPage<=leftTicks+1&&totalPage>displayNum)
        {
            maxPage=displayNum;
        }
        if(minPage>1)
        {
            html+='<span class="more floor">...</span>';
        }
        for(var i=minPage;i<=maxPage;i++)
        {
            if(i==currentPage)
            {
                html+='<span class="current floor">'+i+'</span>';
                continue;
            }
            html+='<a href="javascript:;" class="pageable floor" page="'+i+'">'+i+'</a>';
        }
        if(maxPage<totalPage)
        {
            html+='<span class="more floor">...</span>';
        }
        if(currentPage!=totalPage)
        {
            var nextPage=parseInt(currentPage)+1;
            html+='<a href="javascript:;" title="下一页" class="nextPage short" page="'+nextPage+'"></a>';
            html+='<a href="javascript:;" title="最后一页" class="lastPage short" page="'+totalPage+'"></a>';
        }
        else
        {
            html+='<span class="nextPage short" title="下一页"></span>';
            html+='<span class="lastPage short" title="最后一页"></span>';
        }
        html+='</span>';
        var hint=defaultParams['hint'].replace('{totalPage}',totalPage);
        hint=hint.replace('{totalCount}',totalCount);
        html+=hint;
        html+='</div>';
        return html;
    };
        
    var insertContent = function(myValue, obj,t) {
        var $t = obj[0];
        if (document.selection) { // ie
            this.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
            this.focus();
            sel.moveStart('character', -l);
            var wee = sel.text.length;
            if (arguments.length == 2) {
                var l = $t.value.length;
                sel.moveEnd("character", wee + t);
                t <= 0 ? sel.moveStart("character", wee - 2 * t
                - myValue.length) : sel.moveStart(
                    "character", wee - t - myValue.length);
                sel.select();
            }
        } else if ($t.selectionStart
            || $t.selectionStart == '0') {
            var startPos = $t.selectionStart;
            var endPos = $t.selectionEnd;
            var scrollTop = $t.scrollTop;
            $t.value = $t.value.substring(0, startPos)
            + myValue
            + $t.value.substring(endPos,
                $t.value.length);
            this.focus();
            $t.selectionStart = startPos + myValue.length;
            $t.selectionEnd = startPos + myValue.length;
            $t.scrollTop = scrollTop;
            if (arguments.length == 2) {
                $t.setSelectionRange(startPos - t,
                    $t.selectionEnd + t);
                this.focus();
            }
        } else {
            this.value += myValue;
            this.focus();
        }
    };
    util.insertContent = insertContent;
    
    //验证码URL添加随机数
    var captcha = function captcha(url) {
        var path = url.split('?');
        return path[0] + '?' + Math.random() * 10000;
    };
    util.captcha = captcha;
    
    util.math = {
        add:function(a, b) {
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
        },
        sub:function(a, b) {
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
        },
        mul:function(a, b) {
            var c = 0,
                d = a.toString(),
                e = b.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) {}
            try {
                c += e.split(".")[1].length;
            } catch (f) {}
            return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        },
        div: function(a, b){
            var c, d, e = 0,
                f = 0;
            try {
                e = a.toString().split(".")[1].length;
            } catch (g) {}
            try {
                f = b.toString().split(".")[1].length;
            } catch (g) {}
            return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
        }
    };

    
    /**
     * tabpage
     * 
     * usage: 用于管理tab页，菜单<a>或页面内的<a>可以打开tab页；要求<a>符合一定的元素设置；
     *      脚本位于页面底部，使得可以监听菜单<a>和打开的tab的关闭按钮；
     * 
     * 1. open tabpage:
     * data-tab=1 表示优先以tabpage方式打开链接
     * <a href="test.php" data-tab="1" title="测试页面">
     *     <i class="fa-text-width"></i>
     *     <span class="menu-text"> 测试页面 </span>
     * </a>
     * 
     * 2. tabpage headers: container of all tabpage header 
     *   li 需要设置 tab-id, 和 content 的 div#id对应;
     *   li a 需要设置 href,data-toggle. href='#tab-id', role/aria-controls 可选;
     *   li a i 用于关闭标签页，class="tabpage-close" 
     * <ul class="tabpage-headers">
     *     <li class="active" tab-id="home-test" role="presentation">
     *         <a href="#home-test" data-toggle="tab" role="tab" aria-controls="home-test">
     *         测试页面 
     *         <i class="fa-remove tabpage-close"></i>
     *         </a>
     *     </li>
     * </ul>
     * 
     * tab content 需要结构如下:
     *   div 所有标签页容器，class='tab-content tabpage-contents'; tab-content 自动使用 bootstrap 机制来切换标签
     *   div 各个标签页容器，设置 id/class/role, class='tab-pane' 自动使用 bootstrap 机制来切换标签
     * <div class="tab-content tabpage-contents">
     *     <div id="tab-id" class="tab-pane" role="tabpanel">
     *         <iframe ... ></iframe>
     *         // or other <div>
     *     </div>
     * </div>
     */
	var tabpage = {
		headersContainer  : null
		,contentsContainer : null
		,_init: function () {
			var cDocument = $(document);
			// 支持iframe页面内在父窗口打开 tabpage
			if (window.parent == window.self) {
				cDocument = $(document);
			} else if (window.parent) {
				cDocument = $(window.parent.document);
			}
			
			this.headersContainer = cDocument.find(".tabpage-headers");
			
			if (this.headersContainer.find("ul").length > 0) {
				this.headersContainer = this.headersContainer.find("ul");
			}
			this.contentsContainer = cDocument.find(".tabpage-contents");
			
		}
		,open : function (options) {
			var self = this;
			self._init();
			
			options.close = true;
			var url = window.location.protocol + '//' + window.location.host;
			options.url = options.url;
			var id = options.id;
			if (!options.id) id = options.url;
			//if (id.indexOf("=") >= 0) id = id.substr(0, id.indexOf("="));
			id = id.replace(/[^a-zA-Z0-9\-\_]/g,'-');// 转化特殊字符为-
			
			if (self.headersContainer.length < 1) {
				location.href = options.url;
				return false;
			}
			
			if (options.title.indexOf("-") > 0) options.title = options.title.substr(0, options.title.indexOf("-"));
			options.title = options.title.substr(0, 6);
			
			// hidden other tabs
			self.headersContainer.find(".tab-header.active").removeClass("active");
			self.contentsContainer.find(".tab-pane.active").removeClass('active');
			
			// create tab by id
			if (self.contentsContainer.find("#" + id).length < 1) {
				var header = '<li class="tab-header" role="presentation" tab-id="' + id + '">'
						+ '<a href="#' + id + '" aria-controls="' + id + '" role="tab" data-toggle="tab">' 
						+ options.title;
				// if set close
				if (options.close) {
					header += ' <i class="fa fa-remove tabpage-close"></i>';
				}
				header += '</a></li>';
				
				var content = '<div class="tab-pane" id="'+ id + '" role="tabpanel">';
				
				// if tab has content add it, then add iframe
				if (options.content) {
					content += options.content;
				} else {
					// fix iframe height
					mainHeight = $(document).height() - 30;	//jquery.2.2.x 不能在这儿获取 $(document.body)
					content += '<iframe id="iframe-' + id +'" src="' + options.url + '" width="100%" height="800px"' 
							+ ' onload="javascript:util.tabpage.resizeIframe(\'iframe-'+id+'\')" frameborder="no" border="0" '
							+ ' style="min-height:' + mainHeight + 'px" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>';
				}
				content += '</div>';
				
				self.headersContainer.append(header);
				self.contentsContainer.append(content);
			}
			
			// active tab
			self.headersContainer.find("[tab-id=" + id + "]").addClass('active');
			self.contentsContainer.find("#" + id).addClass("active");
		}
	
		,close : function (id) {
			var self = this;
			self._init();
			
			if (!id) {
				var tab = self.headersContainer.find(".tab-header.active");
				if (tab.length > 0) { 
					id = tab.attr('tab-id');
				}
			}
			if (id) {
				//如果关闭的是当前激活的TAB，激活他的前一个TAB
			    if (self.headersContainer.find("[tab-id=" + id + "]").hasClass('active') ) {
			    	self.headersContainer.find("[tab-id=" + id + "]").prev().addClass('active');
			    	self.contentsContainer.find("#" + id).prev().addClass('active');
			    }
			    // close tab
			    self.headersContainer.find("[tab-id=" + id + "]").remove();
			    self.contentsContainer.find("#" + id).remove();
			} else {
				window.close();
				return false;
			}
		}
		,resizeIframe : window.resizeIframe
		,listen : function() {
			var self = this;
			self._init();
			
			mainHeight = $(document.body).height() - 45;
		    $('.main-left, .main-right').height(mainHeight);
		    
		    // 可打开 tabpage 的元素的事件监听
		    $("[data-tab]").off("click").on("click", function () { 
		    	var url = $(this).attr("url");
		    	if (url == "" || (typeof url) == "undefined") url = $(this).attr("href");
		    	tabpage.open({ title: $(this).attr('title'), url: url, close: true });
		        return false;
		    });
		    
		    // 关闭按钮的事件监听
		    self.headersContainer.on("click", ".tabpage-close", function (e) {
		    	e.preventDefault();
		    	var header = $(this).parent("[tab-id]"); 
		    	if (header) {
		    		tabpage.close(header.attr("tab-id"));
		    	}
		    	return false;
		    });
		    
		}
	};
	util.tabpage = tabpage;
	
	util.dialog = {
    	_tmpl: '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'
            + '    <div class="modal-dialog" role="document">'
            + '        <div class="modal-content">'
            + '            <div class="modal-header">'
            + '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            + '                <h4 class="modal-title" id="myModalLabel">提示</h4>'
            + '            </div>'
            + '            <div class="modal-body">'
            + '                ...'
            + '            </div>'
            + '            <div class="modal-footer btn-group-sm">'
            + '                <input type="hidden" name="_modal_value">'
            + '                <button type="button" class="btn btn-default btn-modal-cancel" data-dismiss="modal">cancel</button>'
            + '                <button type="button" class="btn btn-primary btn-modal-ok">ok</button>'
            + '            </div>'
            + '        </div>'
            + '    </div>'
            + '</div>'
        ,data: function () {
        	var dialog = this.get();
        	
        	var data = null;
        	
        	if (dialog.find("iframe").length > 0 ) {
        		data = dialog.find("iframe").get(0).contentWindow.returnValue;
        	}
        	
        	return data;
        }
		,close:function(result)
	    {
			var dialog = this.get();
			
			console.log('close', this.data());
			
	        //dialog.modal('hide');
	        dialog.find(".modal-header button.close").click();
	        
	        return false;
	    }
		,get:function()
        {
			var doc = $(document);
            var dialog = doc.find(".modal"); 
            if (dialog.length < 1) {
            	doc.find('body').append(this._tmpl);
            	dialog = doc.find(".modal");
            } else {
            	dialog = dialog.first();
            }
            
            return dialog;
        }
        ,alert: function(content, okfun)
        {
        	var config = {
                content: content,
                cancelTip: true,		// if false hide righttop close button
                cancelDisplay: false,	// if null hide cancel button
                width:  300,
                height: 50
            };
        	if (okfun) {
        		config.ok = okfun;
        	}
            this.show(config);
        }
        ,show:function(configs)
        {
        	var dialog = this.get();
        	
        	dialog.find("input[name=_modal_value]").val("")
        	
        	var self = this;
            var initParams = {
                id:  'wlimModal',
                title: '提示',
                cancelTip: true,
                content: '',
                url: '',
                okValue: '确 定',
                ok: function () {
                	return false;
                },
                cancelValue: '关闭',
                cancelDisplay: false,
                width: null,
                height: null
            }
            
            initParams= $.extend(initParams, configs);
            
            dialog.attr('id', initParams.id);
            dialog.find('.modal-title').html(initParams.title);
            dialog.find('.btn-modal-ok').html(initParams.okValue);
            dialog.find('.btn-modal-cancel').html(initParams.cancelValue);
            if (!initParams.cancelTip) {
            	dialog.find('.modal-header .close').hide();
            }
            if (!initParams.cancelDisplay) {
            	dialog.find('.modal-footer .btn-modal-cancel').hide();
            }
            if (initParams.width) {
            	dialog.find(".modal-dialog").width(initParams.width);
            }
            if (initParams.height) {
            	dialog.find(".modal-body").height(initParams.height);
            }
            
            if (!initParams.url) {
                dialog.find('.modal-body').html(initParams.content);
            } else {
            	var content = '<iframe id="modal-iframe" src="' + initParams.url + '" style="width:100%;height:100%;" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"'
            	//+ ' onload="javascript:util.dialog.resize(\'modal-iframe\')"'
            	+ '>';
            	dialog.find('.modal-body').html(content);
            	//dialog.find('.modal-footer').hide();
            }
            
            dialog.find('.btn-modal-ok').off('click').on('click', function () {
            	
            	if ($.isFunction(initParams.ok)) {
            		initParams.ok(self);
            		
            		self.close();
            	}
            });
            
            dialog.modal({
            	backdrop: 'static',
           		keyboard: true,
            });
            
            dialog.modal('show');
            dialog.modal("handleUpdate");
            
            return dialog;
        }
        ,resize: window.resizeIframe
        ,prevent: function(e, ele)
        {
            var evt = e ? e : window.event;
            if (evt.stopPropagation) {
                evt.stopPropagation();
            }
            else {
                evt.cancelBubble = true;
            }
        }
    };
	
//});

