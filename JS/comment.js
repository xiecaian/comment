;(function(document,comment){
    var JOpenBtn = document.getElementsByClassName('J_openBtn')[0],
        JCloseBtn = document.getElementsByClassName('J_closeBtn')[0],
        showList = document.getElementsByClassName('show-list')[0],
        commentInput = document.getElementsByClassName('comment')[0],
        JStars = document.getElementsByClassName('J_stars')[0],
        JSubmitBtn = document.getElementsByClassName('J_submitBtn')[0];
        pagingWarp = document.getElementsByClassName('pagingWarp')[0]; 
    var userId = 8;

    var init = function(){
        bindEvent();
    };

    function bindEvent(){
        addEvent(JOpenBtn,'click',comment.openBoard.bind(comment));/** 打开评论*/
       // JCloseBtn.addEventListener('click',comment.closeBoard.bind(comment),false);
        addEvent(JCloseBtn,'click',comment.closeBoard.bind(comment));/** 关闭评论*/
        /**评论类型切换 */
        addEvent(showList,'click',comment.listTabClick.bind(comment));
        /**五星评论的 */
        addEvent(JStars,'mouseover',comment.starsHover.bind(comment));
        /**输入框的 */
        addEvent(commentInput,'input',comment.commentInput.bind(comment));
        /**提交数据的 */
        addEvent(JSubmitBtn,'click',comment.submitComment.bind(comment,userId));
        /**分页的 */
        addEvent(pagingWarp,'click',comment.getCurPage.bind(comment));
    };
    init();

})(document,new Initcommentmodule(document,InitPagingBtns));