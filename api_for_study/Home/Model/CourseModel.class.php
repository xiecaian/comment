<?php
namespace Home\Model;
use Think\Model;

class CourseModel extends Model {
	function getCourseList($field, $pageNum){
		$map['status'] = $field === 'trash' ? 0 : 1;

    $count = $this -> where($map) -> count();

    $pages = ceil($count / 6);

		$from = $pageNum * 6;

		$res = $this -> where($map) -> limit($from, '6') -> select();
		return [
      'res' => $res,
      'pages' => $pages
		];
	}

	function getSearchList($keyword){
		$map['course'] = array('like', '%' . $keyword . '%');
		$map['status'] = 1;

		$res = $this -> where($map) -> order('id') -> select();

		return [
      'res' => $res,
      'pages' => $pages
		];
	}

	function doListItem($type, $pageNum, $itemId){
		$map['id'] = $itemId;

		if($type == 'delete'){
			$data['status'] = 0;
			$condition['status'] = 1;
		}else if($type == 'regain'){
      $data['status'] = 1;
      $condition['status'] = 0;
		}else{
			$data['status'] = 0;
			$condition['status'] = 1;
		}

		$action = $this -> where($map) -> data($data) -> filter('strip_tags') -> save();
    
    $count = $this -> where($condition) -> count();

    $pages = ceil($count / 6);

    $res = $this -> where($condition) -> limit(0, '6') -> select();
		return [
      'res' => $res,
      'pages' => $pages
		];
	}

	function updateCourseName($itemId, $newVal){
		$map['id'] = $itemId;

		$data['course'] = $newVal;

		$action = $this -> where($map) -> data($data) -> filter('strip_tags') -> save();

		if($action){
			return 'success';
		}else{
			return 'failed';
		}
	}
}











