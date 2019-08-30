<?php
namespace Home\Controller;
use Think\Controller;

header("Access-Control-Allow-Origin: *");

class ShoppingCartController extends Controller {
	public function getGoodsList() {
		$mobilePhoneDB = D('MobilePhone');
		$this -> ajaxReturn($mobilePhoneDB -> getPhonesList());
	}

	public function getGoodsDetail() {
		$id = I('post.id');
		$mobilePhoneDB = D('MobilePhone');
		$this -> ajaxReturn($mobilePhoneDB -> getGoodsDetail($id));
	}

	public function updateShoppingCart() {
		$uid = I('post.uid');
		$goods_id = I('post.goodsId');

		$mobilePhoneDB = D('MobilePhone');
		$goodsDetail = $mobilePhoneDB -> getGoodsDetail($goods_id);

		if($goodsDetail['error_code'] == '1001') {
			$this -> ajaxReturn($mobilePhoneDB -> getGoodsDetail($goods_id));
			return;
		}

		$shoppingCartDB = D('ShoppingCart');

		$this -> ajaxReturn($shoppingCartDB -> updateShoppingCart($uid, $goods_id, $goodsDetail));
	}

	public function getCartList() {
		$uid = I('post.uid');

		$shoppingCartDB = D('ShoppingCart');

		$this -> ajaxReturn($shoppingCartDB -> getCartList($uid));
	}

	public function updateCartNum () {
		$id = I('post.id');
		$num = I('post.num');

		$shoppingCartDB = D('ShoppingCart');

		$this -> ajaxReturn($shoppingCartDB -> updateCartNum($id, $num));
	}

	public function removeCartItem () {
		$id = I('post.id');

		$shoppingCartDB = D('ShoppingCart');

		$this -> ajaxReturn($shoppingCartDB -> removeCartItem($id));
	}

	public function purchaseCart () {
		$uid = I('post.uid');
		$gids = I('post.gids');

		$shoppingCartDB = D('ShoppingCart');

		$this -> ajaxReturn($shoppingCartDB -> purchaseCart($uid, $gids));
	}
}