<?php
namespace Home\Controller;
use Think\Controller;

header("Access-Control-Allow-Origin: *");

class ListController extends Controller {
  public function getCourseListForManage(){
  	$pageNum = I('post.pageNum');
  	$field = I('post.field');

    $courseDB = D('Course');
    
    $this -> ajaxReturn($courseDB -> getCourseList($field, $pageNum));
  }

  public function getSearchListForManage(){
  	$keyword = I('post.keyword');

  	$courseDB = D('Course');

  	$this -> ajaxReturn($courseDB -> getSearchList($keyword));
  }

  public function doListItemForManage(){
    $type = I('post.type');
    $pageNum = I('post.pageNum');
    $itemId = I('post.itemId');

    $courseDB = D('Course');

    $this -> ajaxReturn($courseDB -> doListItem($type, $pageNum, $itemId));
  }

  public function updateCourseNameForManage(){
    $itemId = I('post.itemId');
    $newVal = I('post.newVal');

    $courseDB = D('Course');

    $this -> ajaxReturn($courseDB -> updateCourseName($itemId, $newVal));
  }
}