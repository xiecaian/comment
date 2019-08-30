;(function(document, Comment){

  var oOpenBtn = $get('.J_openBtn')[0],
      oCloseBtn = $get('.J_closeBtn')[0],
      oStars = $get('.J_stars')[0],
      oEditTxt = $get('.J_editTxt')[0],
      oSubmitBtn = $get('.J_submitBtn')[0],
      oRadioTabs = $get('.J_radioTabs')[0],
      oBtnBox = $get('.J_btnBox')[0];
  
  var userId = 20;

  var init = function(){
    Comment.getComments({
      fieldId: 0,
      pageNum: 0
    });
    bindEvent();
  }

  function bindEvent(){
    oOpenBtn.addEventListener('click', Comment.openBoard, false);
    oCloseBtn.addEventListener('click', Comment.closeBoard.bind(Comment), false);
    oStars.addEventListener('mouseover', Comment.starsHover, false);
    oEditTxt.addEventListener('input', Comment.editInput.bind(Comment), false);
    oSubmitBtn.addEventListener('click', Comment.submitComment.bind(Comment, userId), false);
    oRadioTabs.addEventListener('click', Comment.radioTabClick.bind(Comment), false);
    oBtnBox.addEventListener('click', Comment.pageBtnClick.bind(Comment), false);
  }
  
  init();

})(document, initCommentModule);












