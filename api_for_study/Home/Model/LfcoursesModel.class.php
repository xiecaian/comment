<?php
namespace Home\Model;
use Think\Model\RelationModel;

class LfcoursesModel extends RelationModel {
	protected $_link = array(
    'Lecturer' => array(
      'mapping_type' => self::BELONGS_TO, 
      'class_name' => 'Lecturer', 
      'foreign_key' => 'lecturer', 
      'mapping_name' => 'name', 
      'as_fields' => 'name'
    )
  );
  function getCourses ($page) {
    $map['field'] = 'jap';
    $map['status'] = 1;
    $map['orders'] = 1;

    $count = $this -> where($map) -> count();

	$from = $page * 10;

	$res = $this -> where($map) -> limit($from, '10') -> select();
	return $res;
  }
}