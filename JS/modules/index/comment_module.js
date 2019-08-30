var initPageBtns = function(pages, curPage){
  var btnGroup = '',
      oBtnBox = $get('.J_btnBox')[0];

  render();

  function pageBtnTpl(type, num){
    switch(type){
      case 'btn':
        if(curPage == num){
          return '<span class="page-btn page-btn-cur">'+ num +'</span>';
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
    }
  }

  function makeBtnGroup(start, end){
    for(var i = start; i <= end; i++){
      btnGroup += pageBtnTpl('btn', i, curPage);
    }
  }

  function render(){
    btnGroup += pageBtnTpl('prev', pages, curPage);
    if(pages > 7){
      if(curPage < 3){
        makeBtnGroup(1, 3, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(pages - 1, pages, curPage);
      }else if(curPage >= 3 && curPage < 5){
        makeBtnGroup(1, curPage + 1, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(pages - 1, pages, curPage);
      }else if(curPage >= 5 && curPage < pages - 3){
        makeBtnGroup(1, 2, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(curPage - 1, curPage + 1, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(pages - 1, pages, curPage);
      }else if(curPage >= pages - 4 && curPage <= pages - 1){
        makeBtnGroup(1, 2, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(curPage - 1, pages, curPage);
      }else if(curPage == pages){
        makeBtnGroup(1, 2, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(curPage - 2, pages, curPage);
      }
    }else{
      makeBtnGroup(1, pages, curPage);
    }
    btnGroup += pageBtnTpl('next', pages, curPage);
    
    oBtnBox.innerHTML = btnGroup;
  }
}

var initCommentModule = (function(document, initPageBtns){
  var oCommentEditBoard = $get('.J_commentEditBoard')[0],
      oStarTip = $get('.J_starTip')[0],
      oStarItems = $get('.J_hoverStar'),
      oTxtCount = $get('.J_txtCount')[0],
      oSubmitBtn = $get('.J_submitBtn')[0],
      oEditTxt = $get('.J_editTxt')[0],
      oRadioTabItems = $get('.tab-radio'),
      oLoading = $get('.J_loading')[0],
      oCommentList = $get('.J_commentList')[0],
      oStatisticsNum = $get('.J_statisticsNum')[0],
      oBtnBox = $get('.J_btnBox')[0],

      warningTip = $get('#J_warningTip').innerHTML,
      itemTpl = $get('#J_itemTpl').innerHTML,
      addCommentTpl = $get('#J_addCommentTpl').innerHTML,
    
      t = null,
      starNum = 5,
      delayTime = 300,
      fieldId = 0,
      curPage = 1,
      pages = 0;

  var APIs = {
    submitComment: 'http://localhost/api_for_study/index.php/Comment/submitComment',
    getComments: 'http://localhost/api_for_study/index.php/Comment/getComments'
  }
  
  return {
  	openBoard: function(){
      oCommentEditBoard.style.display = 'block';
  	},

  	closeBoard: function(){
  		oCommentEditBoard.style.display = 'none';
      this._restoreBoardStatus();
  	},

  	starsHover: function(e){
      var e = e || window.event,
          tar = e.target || e.srcElement,
          tagName = tar.tagName.toLowerCase();

      if(tagName === 'i'){
      	var thisIdx = [].indexOf.call(oStarItems, tar),
      	    thisStarItem = oStarItems[thisIdx],
      	    len = oStarItems.length,
      	    item;

      	oStarTip.innerHTML = thisStarItem.getAttribute('data-title');
        starNum = thisStarItem.getAttribute('data-count');

      	for(var i = 0; i < len; i++){
      		item = oStarItems[i];

          if(i <= thisIdx){
            if(item.className.indexOf('active') === -1){
              item.className += ' active';
            }
          }else{
            item.className = 'fa fa-star J_hoverStar';
          }
      	}
      }
  	},

    editInput: function(){
    	var val = trimSpace(oEditTxt.value),
    	    valLen = val.length;
 
      oTxtCount.innerHTML = valLen;

      if(valLen >= 15 && valLen <= 1000){
        this.submitBtnChange({
          txtChange: false,
          isDisabled: false
        });
      }else{
      	this.submitBtnChange({
          txtChange: false,
          isDisabled: true
        });
      }
    },

    getComments: function(opt){
      var _self = this,
          fieldId = opt.fieldId,
          pageNum = opt.pageNum;

      xhr.ajax({
        url: APIs.getComments,
        type: 'POST',
        data: {
          field: fieldId,
          page: curPage - 1
        },
        success: function(data){
          var num = data.num,
              res = data.res,
              len = data.length;

          pages = data.pages;
          console.log(res);
          oLoading.style.display = 'block';

          t = setTimeout(function(){
            _self.setTabStarNum(num);
            oLoading.style.display = 'none';
            oCommentList.innerHTML = '';
            clearTimeout(t);

            if(len <= 0){
              _self._setWarningTip('暂无评论');
              return;
            }

            if(pages > 1){
              initPageBtns(pages, curPage);
            }else{
              oBtnBox.innerHTML = '';
            }

            oCommentList.appendChild(_self.renderList(res));
          }, delayTime);
        },

        error: function(){
          _self.setWarningTip('获取评论列表失败');
        }
      })
    },

    submitComment: function(userId){
    	var val = oEditTxt.value,
          len = trimSpace(val).length,
          _self = this;

      if(len >= 15 && len <= 1000){
        xhr.ajax({
          url: APIs.submitComment,
          type: 'POST',
          data: {
            userId: userId,
            starNum: starNum,
            comment: val
          },
          success: function(data){
            var errorCode = data.error_code,
                oFirstCommentItem = oCommentList.getElementsByClassName('comment-item')[0];

            _self.submitBtnChange({
              txtChange: true,
              isDisabled: true
            });
  
            t = setTimeout(function(){
              _self.submitBtnChange({
                txtChange: false,
                isDisabled: false
              });

              clearTimeout(t);

              if(errorCode === '10010'){
                alert('您已对该课程做了评价，感谢您。');
                return;
              }

              if(data.res.is_add_comment == '0'){
                if(oFirstCommentItem){
                  oCommentList.insertBefore(_self._makeItem(data.res), oFirstCommentItem);
                }else{
                  oCommentList.innerHTML = '';
                  oCommentList.appendChild(_self._makeItem(data.res));
                }
              }else if(data.res.is_add_comment == '1'){
                _self._appendAddComment(data.res);
              }

              _self.setTabStarNum(data.num);
              _self._restoreBoardStatus();
              _self.closeBoard();
            }, delayTime);
          },

          error: function(){
            alert('对不起，提交评论失败，请重试');
          }
        });
      }
    },

    renderList: function(data){
      var frag = document.createDocumentFragment(),
          _self = this;

      data.forEach(function(elem){
        frag.appendChild(_self._makeItem(elem));
      });
      
      return frag;
    },

    _makeItem: function(data){
      var dom = document.createElement('div'),
          starNum = data.star_num,
          count = 0;

      dom.className = 'comment-item';
      dom.setAttribute('data-id', data.id);

      dom.innerHTML = itemTpl.replace(/{{(.*?)}}/gim, function(node, key){
        key === 'isActive' && count++;

        return {
          avatar: data.avatar,
          nickname: data.nickname,
          comment: data.comment,
          isActive: starNum >= count ? 'active' : '',
          uptime: getDateTime(data.uptime, 'date')
        }[key];
      });

      if(data.add_comment){
        dom.innerHTML += addCommentTpl.replace(/{{(.*?)}}/gim, function(node, key){
          return {
            comment: data.add_comment.comment,
            uptime: getDateTime(data.add_comment.uptime, 'date')
          }[key];
        });
      }
      console.log(dom);
      return dom;
    },

    _appendAddComment: function(data){
      var oCommentItems = $get('.comment-item'),
          itemLen = oCommentItems.length,
          item,
          dataId;

      for(var i = 0; i < itemLen; i++){
        item = oCommentItems[i];
        dataId = item.getAttribute('data-id');

        if(dataId == data.add_id){
          item.innerHTML += addCommentTpl.replace(/{{(.*?)}}/gim, function(node, key){
          return {
            comment: data.comment,
            uptime: getDateTime(data.uptime, 'date')
          }[key];
        });
        }
      }
    },

    _restoreBoardStatus: function(){
      var starLen = oStarItems.length,
          item;
      
      for(var i = 0; i < starLen; i++){
        item = oStarItems[i];
        item.className += ' active';
      }
      
      oStarTip.innerHTML = oStarItems[4].getAttribute('data-title');
      starNum = oStarItems[4].getAttribute('data-count');

      oEditTxt.value = '';
      oTxtCount.innerHTML = '0';
      oSubmitBtn.innerHTML = '提交评论';
      this.submitBtnChange({
        txtChange: false,
        isDisabled: true
      });
    },

    radioTabClick: function(e){
      var e = e || window.event,
          tar = e.target || e.srcElement,
          className = tar.className;

      if(className == 'radio-txt' || className == 'radio-icon'){
        var oParent = tar.parentNode,
            len = oRadioTabItems.length,
            item;

        fieldId = oParent.getAttribute('data-id');

        for(var i = 0; i < len; i++){
          item = oRadioTabItems[i];
          item.className = 'tab-radio';
        }

        oParent.className += ' cur';
        curPage = 1;
        this.getComments({
          fieldId: fieldId, 
          page: curPage - 1
        });
      }
    },

    pageBtnClick: function(e){
      var e = e || window.event,
          tar = e.target || e.srcElement,
          field = tar.getAttribute('data-field');

      if(field){
        switch(field){
          case 'btn':
            curPage = parseInt(tar.getAttribute('data-page'));
            break;
          case 'prev':
            curPage -= 1;
            break;
          case 'next':

            curPage += 1;
            break;
        }
        this.getComments({
          fieldId: fieldId,
          page: curPage - 1
        });
      }
    },

    submitBtnChange: function(opt){
      var txtChange = opt.txtChange,
          isDisabled = opt.isDisabled;

      if(txtChange){
        oSubmitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
      }else{
        oSubmitBtn.innerHTML = '提交评论';
      }
      
      if(isDisabled){
        oSubmitBtn.className += ' disabled';
        oSubmitBtn.setAttribute('disabled', 'disabled');
      }else{
        oSubmitBtn.className = 'comment-btn submit J_submitBtn';
        oSubmitBtn.removeAttribute('disabled');
      }
    },

    setTabStarNum: function(arr){
      var oRadioCount = null;

      arr.forEach(function(elem, idx){
        oRadioCount = oRadioTabItems[idx].getElementsByClassName('radio-count')[0];
        oRadioCount.innerHTML = elem;
      });

      oStatisticsNum.innerHTML = arr[0] === '0' 
                               ? '-' 
                               : Math.ceil(arr[1] / arr[0] * 100) + '%';
    },

    _setWarningTip: function(text){
      oCommentList.innerHTML = warningTip.replace(/{{(.*?)}}/gim, text);
    }
  }
})(document, initPageBtns);











