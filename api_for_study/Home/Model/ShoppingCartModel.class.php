<?php
namespace Home\Model;
use Think\Model\RelationModel;

class ShoppingCartModel extends RelationModel {
  protected $_link = array(
    'mobile_phone' => array(
      'mapping_type' => self::BELONGS_TO, 
      'class_name' => 'mobile_phone', 
      'foreign_key' => 'goods_id', 
      'mapping_name' => 'goods_name,price,img_url,limitation', 
      'as_fields' => 'goods_name,price,img_url,limitation'
    )
  );

  function updateShoppingCart($uid, $goods_id, $goodsDetail) {
    $map['uid'] = $uid;
    $map['goods_id'] = $goods_id;

    $check = $this -> where($map) -> find();

    if($goodsDetail['limitation'] != 0 && $check['total_num'] >= $goodsDetail['limitation']) {
      return [
        'error_code' => '1003',
        'error_msg' => 'Total number you can Adding to shopping cart is up to limitation'
      ];
    }

    $data['add_time'] = strtotime(date('Y-m-d H:i:s'));

    if($check && $check['status'] == 1) {
      $data['total_num'] = $check['total_num'] + 1;
      $data['num'] = $check['num'] + 1;
      $data['total_price'] = $data['num'] * $goodsDetail['price'];
    
      $action = $this -> data($data) -> where($map) -> save();
    } else if($check && $check['status'] == 0) {
      if ($check['total_num'] >= $goodsDetail['limitation']) {
        return [
          'error_code' => '1003',
          'error_msg' => 'Total number you can Adding to shopping cart is up to limitation'
        ];
      }
      $data['total_num'] = $check['total_num'] + 1;
      $data['num'] = 1;
      $data['total_price'] = $data['num'] * $goodsDetail['price'];
      $data['status'] = 1;

      $action = $this -> data($data) -> where($map) -> save();
    } else {
      $data['uid'] = $uid;
      $data['goods_id'] = $goods_id;
      $data['total_num'] = 1;
      $data['num'] = 1;
      $data['total_price'] = $goodsDetail['price'];

      $action = $this -> data($data) -> add();
    }

    if($action) {
      return [
        'error_code' => '200',
        'error_msg' => 'ok'
      ];
    } else {
      return [
        'error_code' => '1002',
        'error_msg' => 'Adding to shopping cart is failed'
      ];
    }
  }

  function getCartList($uid) {
    $map['uid'] = $uid;
    $map['status'] = 1;

    $check = $this -> where($map) -> find();

    if(!$check) {
      return [
        'error_code' => '1004',
        'error_msg' => 'Not exist'
      ];
    } else {
      $res = $this -> where($map) -> order('id desc') -> relation(true) -> select();

      for ($i = 0; $i < count($res); $i++) {
        $total_price += $res[$i]['total_price'];
      }

      return [
        'res' => $res,
        'total_price' => $total_price
      ];
    }
  }

  function updateCartNum($id, $num) {
    $map['id'] = $id;

    $data['num'] = $num;

    $s_res = $this -> where($map) -> relation(true) -> find();

    $price = $s_res['price'];
    
    $data['total_num'] = $num;
    $data['total_price'] = $price * $num;

    $action = $this -> data($data) -> where($map) -> save();

    if ($action) {
      $map_s['status'] = 1;
      $res = $this -> where($map_s) -> select();

      for ($i = 0; $i < count($res); $i++) {
        $total_price += $res[$i]['total_price'];
      }

      return $total_price;
    }
  }

  function removeCartItem($id) {
    $map['id'] = $id;

    $data['status'] = 0;

    $action = $this -> data($data) -> where($map) -> save();

    if ($action) {
      return [
        'msg' => 'ok',
        'msg_code' => '200'
      ];
    } else {
      return [
        'msg' => 'remove failed',
        'msg_code' => '1007'
      ];
    }
  }

  function purchaseCart($uid, $gids) {
    $map['uid'] = $uid;
    $data['status'] = 0;

    $gidArr = explode(',', $gids);

    for ($i = 0; $i < count($gidArr); $i++) {
      $map['id'] = $gidArr[$i];
      $action = $this -> data($data) -> where($map) -> save();
    }

    return [
      'msg' => 'ok',
      'msg_code' => '200'
    ];
  }
}











