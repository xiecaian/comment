var xhr = (function(){
	var o = window.XMLHttpRequest ? new XMLHttpRequest 
								  : new ActiveXObject('Micrsoft.XMLHTTP');
	function _doAjax(opt){
		var opt = opt || {},
			transferType = (opt.type || 'GET').toUpperCase(),
			asyncTrue = opt.async || true,
			url = opt.url,
            data = opt.data,
            timeout = opt.timeout || 30000,
            t = null,
			error = opt.error || function(){},
			success = opt.success || function(){},
			complete = opt.complete || function(){};
			if(!url){
				throw new Error('您没有输入URL');
			}
			o.open(transferType,url,asyncTrue);
			transferType === 'POST' && o.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			o.send(transferType === 'GET' ? null
										  : formatDatas(data));
			o.onreadystatechange = function(){
				if(o.readyState == 4 && o.status == 200){
					/*服务器请求已完成，且响应已就绪 且服务器响应OK*/
					success(o.responseText);
				}
				if(o.status == 404){
					error();
				}
				complete();
			}
	}	
	/*
	* @目的： 将传入的
	*opt{a：1，
	*	b:2} 
	*转换成字符串“a = 1&b=2”
	*/
	function formatDatas(opt){
		var str = '';
		for(var key in opt){
			str += key + '=' + opt[key] + '&';
		}
		return str.replace(/&$/,'');
	}
	
	return {
		ajax: function(obj){
			_doAjax(obj);
		},
		post: function(url,data,callBackFunction){
			_doAjax({
				url: url,
				type: 'POST',
				data:data,
				success : callBackFunction
			});
		},
		get: function(url,callBackFunction){
			_doAjax({			
				url : url,
				type: 'get',
				success: callBackFunction 
			})
		}
	}
})();

/**在tpl的模块中用opt中的数据替换掉符合tpl中符合正则表达式的数据 */
function setTplToHTML(tpl,regExp,opt){
    return tpl.replace(regExp(),function(node,key){
        return opt[key];
    });
}

/** 正则表达式*/
function regTpl(){
    return new RegExp(/{{(.*?)}}/,'gim');
}

/**替换掉空格 */
function regRemoveTab(string){
	return string.replace(/\s+/gim,'');
}

/*事件监听函数*/
;(function(){
	function addEvent(el,type,fn){
		if(addEventListener){
			el.addEventListener(type,fn,false);
		}
		else if(el.attachEvent){
			el.attachEvent('on' + type,function(){
				fn.call(el);/*attachEvent默认是指向window，需要改*/
			});
		}
		else{
			el['on'+type] = fn;
		}
	}
	window.addEvent = addEvent;
})();

/*取消事件监听函数 */
;(function(){
	function removeEvent(el,type,fn){
		if(el.addEventListener){
			el.removeEventListener(type,fn,false);
		}
		else if(el.attachEvent){
			el.detachEvent('on' +type,fn);
		}
		else{
			el['on'+'type'] = null;
		}
	}
	window.removeEvent = removeEvent;
})();


/** 
 * @ target : 将时间戳变成xxxx-xx-xx-xx-xx-xx
*/

;(function(){
	function setTimeFormat(timestamp){
		var time = new Date(timestamp);
		console.log(time);
		console.log(time.getFullYear());
		console.log(time.getTime());
		return time.getFullYear() + '-'+time.getMonth()+'-'+time.getDate() +'-'+ time.getHours() + '-'+time.getMinutes() + '-'+time.getSeconds();
		
	};
	window.setTimeFormat = setTimeFormat;
})();

;getDateTime = (function(){
    function _getDateTime(ts, type){
        var len = ts.toString().length;
    
        if(len === 10){
        ts = ts * 1000;
        }
    
        var dt = new Date(ts),
            y = dt.getFullYear(),
            m = addZero(dt.getMonth() + 1),
            d = addZero(dt.getDate()),
            h = addZero(dt.getHours()),
            i = addZero(dt.getMinutes()),
            s = addZero(dt.getSeconds());
    
        switch(type){
        case 'date': 
            return y + '-' + m + '-' + d;
            break;
        case 'time':
            return h + ':' + i + ':' + s;
            break;
        case 'dateTime':
            return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
            break;
        default:
            return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
        }
    
        function addZero(num){
        return num < 10 ? ('0' + num) : num;
        }
    }
    return _getDateTime;
})()

/*
* @target :分页模板
* @传入值 Elem 代表的是需要将分页的挂在哪个元素上
*		  pages:代表是当前总页，curPages代表的是当前页
*/
var InitPagingBtns = (function(){
	
	var PagingBtn = function(){
		var _self = this;
		this.btnGroup = '';
	}

	PagingBtn.prototype = {
		init : function(pages,curPage){
			var _self = this;
				this.pages = pages;
			return _self.render(curPage,pages,_self.btnGroup);
		},
		pagingBtnTpl : function(type,curPage,num,pages){
			switch(type){
				case 'btn':
					if(num === curPage){
						return '<span class = "page-btn page-btn-cur">'+num+'</span>'
					}else{
						return '<a href="javascript:;" class="page-btn" data-page="'+ num +'" data-field="btn">'+ num +'</a>';
					}
					break;
				case 'prev':
					if(curPage == 1){
						return '<span class="dir-btn prev-btn disabled"><i class="fa fa-angle-left"></i></span>';
					}else{
						return '<a href="javascript:;" class="dir-btn prev-btn" data-field="prev"><i class="fa fa-angle-left" data-field="prev"></i></a>';
					}
					break;
				case  'next':
				  if(curPage == pages){
					return '<span class="dir-btn next-btn disabled"><i class="fa fa-angle-right"></i></span>';
				  }else{
					return '<a href="javascript:;" class="dir-btn next-btn" data-field="next"><i class="fa fa-angle-right" data-field="next"></i></a>';
				  }
				  break;
				case 'points':
				  return '<span class="points">...</span>';
				  break;
				default:
					return '分页时输入type有问题'
			}
		},

		/* 制作从start到end的btn模板*/
		makePagingGroup: function(start,end,curPage){
			var tpl = '';
			for(var i = start;i <= end;i++){
				tpl += this.pagingBtnTpl('btn',curPage,i);
			}
			return tpl;
		},

		/**点击时变化当前页 */
		clickPagingChange: function(curPage,e){
            var event = e || window.event,
                tar = event.target || event.srcElement,
				tarClassName = tar.className,
				_self = this;
                dataField = tar.getAttribute('data-field');
                if('pageBtn' == tarClassName){
                    curPage = parseInt(tar.FindsiblingNode(-1).value) || 1;
                }else if('rowsBtn' == tar.className){
                    curPage =  parseInt(tar.FindsiblingNode(-1).value) || 1;
                }else if('btn' == dataField){
                    curPage = parseInt(tar.innerHTML);
                }else if('prev' == dataField ){
					console.log(56);
                    curPage -= 1;
                }else if('next' == dataField ){
					console.log(88);
                    curPage += 1;
				}
				return curPage;
        },

		render: function(curPage,pages,btnGroup){
			btnGroup += this.pagingBtnTpl('prev',curPage,pages);/**最开始的左按钮 */
			if(pages > 7){
				if(curPage <= 4){
					btnGroup += this.makePagingGroup(1,curPage+1,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(pages-1,pages,curPage);
				}else if(curPage > 4 && curPage <= pages-4){
					btnGroup += this.makePagingGroup(1,2,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(curPage-1,curPage+1,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(pages-1,pages,curPage);
				}else if(curPage > pages-4 && curPage < pages){
					btnGroup += this.makePagingGroup(1,2,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(curPage-1,pages,curPage);
				}else{
					btnGroup += this.makePagingGroup(1,2,curPage);
					btnGroup += this.pagingBtnTpl('points');
					btnGroup += this.makePagingGroup(curPage-2,pages,curPage);

				}
			}else{
				btnGroup += this.makePagingGroup(1,pages,curPage);
			}
			btnGroup += this.pagingBtnTpl('next',curPage,pages);/**最开始的右按钮 */
			return btnGroup;
			
		}
	}

	return  new PagingBtn; 
})()	 



/** 找到当前元素Elem的N级的父元素*/
;(function(){

	var findParents = function(Elem,N){
		if(N <= 0){
			return ;
		}
		while(N){
			Elem = Elem.parentNode;
			N--;
		}
		return Elem;
		
	}
	window.findParents = findParents;
})();

/** 
 * @ target： 找到兄弟节点
*/
Element.prototype.FindsiblingNode = function(num){
	var elem = this;
	while(num){
		if(num>0){
			elem = elem.nextSibling;
			while(elem && 1 !== elem.nodeType){
				elem = elem.nextSibling;
			}
			num--;
		}
		else if(num<0){
			elem = elem.previousSibling;
			while(elem && 1 !== elem.nodeType){
				elem = elem.previousSibling;
			}
			num++;
		}
	}
	return elem;
};

