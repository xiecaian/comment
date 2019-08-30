var Initcommentmodule = (function(){
    
    var CommentModule = function(document,initPagingBtns){
        var _self = this;
        this.commentWrap = document.getElementsByClassName('commentwrap')[0];
        this.radioIcon = document.getElementsByClassName('radio-icon');
        this.JHoverStars = document.getElementsByClassName('J_hoverStar');
        this.JStarTip = document.getElementsByClassName('J_starTip')[0];
        this.commentText = document.getElementsByClassName('comment')[0];
        this.textNum = document.getElementsByClassName('textNum')[0];
        this.JSubmitBtn = document.getElementsByClassName('J_submitBtn')[0];
        this.dataCount = this.JHoverStars[4].getAttribute('data-count');
        this.pagingWarp = document.getElementsByClassName('pagingWarp')[0];
        this.fieldId = 0; /**一开始认为是全部评论 */
        this.pages = 5 /**总页数 */
        this.curPage = 1; /**当前页数 */
        this.initPagingBtns = initPagingBtns;
       
        this.fristCommentTpl = document.getElementById("J_firstComment").innerHTML;
        this.secondCommentTpl = document.getElementById("J_secondComment").innerHTML;
        this.commentNumShow = document.getElementsByClassName('num');
        this.goodCommentPercent = document.getElementsByClassName('percent')[0];
        this.warningWarp = document.getElementsByClassName('warningWarp')[0];
        
        this.commmonShowWarp = document.getElementsByClassName('commmonShowWarp')[0];
        this.APIS = {
            setSubmitComment: 'http://localhost/api_for_study/index.php/Comment/submitComment',
            getComments:'http://localhost/api_for_study/index.php/Comment/getComments'
        }

        _self.showComment({
            field: _self.fieldId,  /**当前的好评评论类型 */
            page:  _self.curPage -1    /**当前页数 */
        });
       

    };

    CommentModule.prototype = {
      
        openBoard: function(){
            this.commentWrap.style.display = 'block';
        },

        closeBoard: function(){
            this.commentWrap.style.display = 'none';
        },

        listTabClick: function(e){
            var event = e || window.event,
                tar = event.target || event.srcElement,
                tarClassName = tar.className,
                tarParent,
                radioLen = this.radioIcon.length,
                radioItem,
                _self = this;
               
                _self.curPage = 1;
            if('radio-icon' == tarClassName){
                tarParent = tar.parentNode;
                _self.fieldId = tarParent.getAttribute('data-id');
                for(var i = 0; i < radioLen ;i++){
                    radioItem = this.radioIcon[i];
                    radioItem.className = 'radio-icon';
                }
                tar.className += ' cur';
                _self.showComment({
                    field: _self.fieldId,  /**当前的好评评论类型 */
                    page:  _self.curPage -1    /**当前页数 */
                });
            }
           
           
        },

        starsHover : function(e){
            var event = e || window.event,
                tar = event.target || event.srcElement,
                StarsLen = this.JHoverStars.length,
                tarTagName = tar.tagName.toLowerCase(),
                dataTitle = tar.getAttribute('data-title');
                this.dataCount = tar.getAttribute('data-count');
                if('i' == tarTagName){
                    console.log(1);
                    for(var i = 0;i < StarsLen; i++){
                        star = this.JHoverStars[i];
                        star.className = i < this.dataCount ? 'fa fa-star J_hoverStar active'
                                                       : 'fa fa-star J_hoverStar';
                        this.JStarTip.innerHTML = dataTitle;
                    }
                }
        },

        commentInput : function(){
            var value = regRemoveTab(this.commentText.value);
                valueLen = value.length;
                this.textNum.innerHTML = valueLen;
                if(valueLen>=15 && valueLen<=1000){
                    /**可提交 */
                    this._submitBtnChange({
                        'textChange':false,
                        'isDisable': false
                    });
                }else{
                    this._submitBtnChange({
                        'textChange':false,
                        'isDisable': true
                    });
                }

        },
        getCurPage: function(e){
            var _self = this,
                e = e || window.event;
                _self.curPage = _self.initPagingBtns.clickPagingChange(_self.curPage,e);
               // _self.pagingWarp.innerHTML = _self.initPagingBtns.init(_self.pages,_self.curPage);
                _self.showComment({
                    field: _self.fieldId,  /**当前的好评评论类型 */
                    page:  _self.curPage -1   /**当前页数 */
                });
        },
        submitComment: function(userId){
            var val = this.commentText.value,
                valLen = regRemoveTab(val).length,
                _self = this;
            if(valLen >= 15 && valLen <= 1000){
                xhr.ajax({
                    url:this.APIS.setSubmitComment,
                    type: 'POST',
                    data: {
                        userId: userId,
                        starNum: _self.dataCount,
                        comment: val
                    },
                    success: function(data){
                       _self._success(data);
                            
                    },
                    error: function(){
                        console.log('error');
                    } 
                    
                });
                
                
            }
          
        },

        showComment: function(opt){
            var _self = this;
            xhr.ajax({
                url: this.APIS.getComments,
                type: 'POST',
                data: {
                    field: opt.field,  /**当前的好评评论类型 */
                    page:  opt.page     /**当前的页数 */
                },
                success: function(data){
                    var jsonData = JSON.parse(data),
                        resData = jsonData.res,
                        page = jsonData.pages,
                        varLen = resData.length,
                        num = jsonData.num,
                        timeOut = 500,
                        errorCode = data.error_code,
                        t;
                        console.log(jsonData);
                        _self._setCommentNum(num);
                        _self.commmonShowWarp.innerHTML = '';
                        _self.pagingWarp.innerHTML = '';
                        _self.warningWarp.style.display = 'block';
                        
                        t = setTimeout(function(){

                            clearTimeout(t);
                            _self._submitBtnChange({
                                textChange: false,
                                isDisable: false
                            });
                            _self.warningWarp.style.display = 'none';
                            if(varLen <= 0){
                                _self.commmonShowWarp.innerHTML = '暂无评价';
                            }
                            if(page > 1){
                                _self.pagingWarp.innerHTML = _self.initPagingBtns.init(page,_self.curPage);
                            }
                            else{
                                _self.pagingWarp.innerHTML = '';
                            }
                            
                        _self.commmonShowWarp.appendChild( _self. _render(resData));
                    },timeOut);
                            
                },
                error: function(){
                    console.log(error);
                }


            });

        },

        _setCommentNum: function(data){
            var _self = this;

            data.forEach(function(arr,index){
                _self.commentNumShow[index].innerHTML = arr;
            });
            this.goodCommentPercent.innerHTML = data[0] === 0 ? '-'
                                                        : Math.ceil(data[1]/data[0]*100)+'%';

            
        },
        _render: function(data){
            var _self = this,
                 frag = document.createDocumentFragment(),
                 count ,
                 userId,
                tpl = '',
                dom;
                //这个使用是用元素加上的appendChild(_render（）)不方便
            data.forEach(function(val,index,array){
                   
                    //tpl += dom;用了这个会将dom节点变成字符串object HTMLDivElement输出
                    frag.appendChild(_self._maketpl(val));
                   
            })
            return frag;
            
        },
        
        _maketpl: function(val){
            var _self = this,
            count ,
            dom;
            dom = document.createElement('div');
            dom.className = 'firstCommentWarp';
            count = 0;
            dom.setAttribute('user_id',val.user_id);
            dom.innerHTML += _self.fristCommentTpl.replace(/{{(.*?)}}/gim,function(node,key){
                    key === 'isActive' && count++;/**这个函数是只要满足正则表达式就会执行，故因为isActive的那个{{}}会会满足5次，即因为这个就至少执行5次，即每次都会去将返回值中的相对于的isACTIVE中的值去替换 */
                return{
                    avatar: val.avatar,
                    nickname: val.nickname,
                    comment: val.comment,
                    isActive: val.star_num >= count ? 'active': '',         //上面的只要 key === 'isActive'即count加一，即相当于第一个isActive的count就是1，依次类推
                    time: getDateTime(val.uptime,'dateTime')
                    }[key];
                })
            
            if(val.add_comment){
                dom.innerHTML+=  _self.secondCommentTpl.replace(/{{(.*?)}}/gim,function(node,key){
                    return {
                        addComment: val.add_comment.comment,
                        time: getDateTime(val.add_comment.uptime,'dateTime')
                    }[key];
            });
            }
            return dom;
        },

        _appendAddComment: function(val){
            var tpl = '',
                _self = this,
                firstCommentWarps = document.getElementsByClassName('firstCommentWarp'),
                firstCommentWarpsLen = firstCommentWarps.length,
                firstCommentWarp,
                commentUserId
                console.log(firstCommentWarps);
                for(var i = 0;i < firstCommentWarpsLen;i++){
                    firstCommentWarp = firstCommentWarps[i];
                    commentUserId = firstCommentWarp.getAttribute('user_id');
                    if(val.user_id === commentUserId){
                        firstCommentWarp.innerHTML += _self.secondCommentTpl.replace(/{{(.*?)}}/gim,function(node,key){
                            return {
                                addComment: val.comment,
                                time: getDateTime(val.uptime,'dateTime')
                            }[key];
                    });
                    }
                }
           
        },
/* 用字符串的形式不好的地方是因为最外层还需要再加一个包含的元素firstCommentWarp，这个是包含了第一次和追加的，如果直接用innerHTML会导致最终的commmonShowWarp会显示[object DocumentFragment]
        _render: function(data){
            var _self = this,
                tpl = '';
                data.forEach(function(arr,index,array){
                    tpl += _self.fristCommentTpl.replace(/{{(.*?)}}/gim,function(node,key)  {
                            return{
                                avatar: val.avatar,
                                nickname: val.nickname,
                                comment: val.comment,
                                time: getDateTime(val.uptime,'dateTime')
                            }[key];
                    })
                    if(val.add_comment){
                        dom.innerHTML+= _self.secondCommentTpl.replace(/{{(.*?)}}/gim,function(node,key){
                            return {
                                addComment: val.add_comment.comment,
                                time: getDateTime(val.add_comment.uptime,'dateTime')
                            }[key];
                        })
                    }
                });

                return tpl;
        },
    */
        _success: function(data){
            var jsonData = JSON.parse(data),
            resData = jsonData.res,
            page = jsonData.pages,
            oFirstCommentItem = document.getElementsByClassName('firstCommentWarp')[0],
            //varLen = resData.length,
            num = jsonData.num,
            _self =this,
            timeOut = 500,
            errorCode = jsonData.error_code,
            t;
            console.log(resData);
            console.log(jsonData);
           
         
            _self.pagingWarp.innerHTML = '';
            _self.warningWarp.style.display = 'block';
            
            t = setTimeout(function(){

                clearTimeout(t);
                _self._submitBtnChange({
                    textChange: false,
                    isDisable: false
                });
                _self.warningWarp.style.display = 'none';
                if(errorCode === '10010'){
                    alert('您已对该课程做了评价，感谢您。');
                    return;
                }
                _self._setCommentNum(num);
                if(resData.is_add_comment == '0'){
                    if(oFirstCommentItem){
                        console.log(_self._maketpl(resData));
                        console.log(oFirstCommentItem);
                        console.log(_self.commmonShowWarp);
                        _self.commmonShowWarp.insertBefore(_self._maketpl(resData), oFirstCommentItem);
                    }else{
                        _self.commmonShowWarp.innerHTML = '';
                        _self.commmonShowWarp.appendChild(_self._maketpl(resData));
                    }
                  }else if(resData.is_add_comment == '1'){
                      console.log(resData);
                    _self._appendAddComment(resData);
                  }
    
                
                if(page > 1){
                    _self.pagingWarp.innerHTML = _self.initPagingBtns.init(page,_self.curPage);
                }
                else{
                    _self.pagingWarp.innerHTML = '';
                }
                _self._restoreBoardStatus();
                _self.closeBoard();
            
        },timeOut);
        
                         
        },

        setTabStarNum: function(){

        },
        _restoreBoardStatus: function(){
            var JHoverStars = this.JHoverStars,
                StarsLen = JHoverStars.length,
                JHoverStar;
            this.JStarTip.innerHTML = JHoverStars[4].getAttribute('data-title');
            
            for(var i = 0; i < StarsLen; i++){
                JHoverStar = JHoverStars[i];
                console.log(JHoverStar);
                JHoverStar.className += ' active';
            }
            console.log(3);
            this.commentText.value = '';
            this.textNum.innerHTML = 0;
            this._submitBtnChange({
                textChange:false,
                isDisable: true
            })

        },
        _submitBtnChange: function(opt){
            var textChange = opt.textChange, /** 点击框的内容是提交还是一个等待符号，true就代表改变说明是等待*/
                isDisable = opt.isDisable;   /** true： 不能显示 */
            console.log(isDisable);
            if(textChange){
                this.JSubmitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            }else{
                this.JSubmitBtn.innerHTML = '提交评论';
            }

            if(isDisable){
                this.JSubmitBtn.className += " disabled";
                this.JSubmitBtn.setAttribute('disabled','disabled');
                
            }else{
                this.JSubmitBtn.className = "comment-btn submit J_submitBtn";
                this.JSubmitBtn.removeAttribute('disabled');
            }
        }
    }
    return CommentModule;
})();

