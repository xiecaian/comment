<?php
namespace Home\Model;
use Think\Model;

class MobilePhoneModel extends Model {
	function getPhonesList() {
    $map['status'] = 1;

		$res = $this -> where($map) -> order('id desc') -> select();
		return $res;
	}

	function getGoodsDetail($id) {
    $map['id'] = $id;
    $res = $this -> where($map) -> find();

    if($res) {
    	return $res;
    } else {
    	return [
	      'error_code' => '1001',
	      'error_msg' => 'The goods for this ID(' . $id . ') is not exists'
	    ];
    }
	}
}