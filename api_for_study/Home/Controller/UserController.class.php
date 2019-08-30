<?php
namespace Home\Controller;
use Think\Controller;

header("Access-Control-Allow-Origin: *");

class UserController extends Controller {
	public function verify() {
		ob_clean();
		$Verify = new \Think\Verify();
		$Verify -> fontSize = 14;
		$Verify -> length = 4;
		$Verify -> useNoise = true;
		$Verify -> codeSet = 'abcdefghijklmnopqrstuvwxyz';
		$Verify -> imageW = 100;
		$Verify -> imageH = 42;
		$Verify -> fontttf = '5.ttf';
		$Verify -> bg = array(255, 255, 255);
		$Verify -> useCurve = false;
		$Verify-> expire = 600;
		$Verify -> entry();
	}

	public function login(){
		$username = trim_space(I('post.username'));
		$password = trim_space(I('post.password'));
		$isPersistedLogin = I('post.isPersistedLogin');

		if(mb_strlen($username, "utf-8") < 6 || mb_strlen($username, "utf-8") > 20){
			$this -> ajaxReturn(
        [
          "error_code" => '1001',
          "error_msg" => 'Invalid username length'
        ]
			);
		}

		if(mb_strlen($password, "utf-8") < 6 || mb_strlen($password, "utf-8") > 20){
			$this -> ajaxReturn(
        [
          "error_code" => '1002',
          "error_msg" => 'Invalid password length'
        ]
			);
		}

		$users = D('Users');

		$this -> ajaxReturn($users -> loginAction($username, $password, $isPersistedLogin)); 
	}

	public function sendTelCode(){
		$pNumber = trim_space(I('post.pNumber'));

		if (strlen($pNumber) !== 11) {
			$this -> ajaxReturn([
         'error_code' => '1008',
         'error_msg' => 'Invalid phone number form'
			]);

			// data = {
			// 	error_code: '1008',
			// 	error_img: 'Invalid phone number form'
			// }
			return;
		}

		$usersDB = D('Users');
		$this -> ajaxReturn($usersDB -> checkPhoneNumber($pNumber));
	}

	public function register(){
		$pNumber = trim_space(I('post.pNumber'));
		$password = trim_space(I('post.password'));
		$telcode = trim_space(I('post.telcode'));
		$passcode = trim_space(I('post.passcode'));

		if (strlen($pNumber) !== 11) {
			$this -> ajaxReturn([
         'error_code' => '1008',
         'error_msg' => 'invalid phone number form'
			]);
			return;
		}

		if (mb_strlen($password, 'UTF8') < 6 || mb_strlen($password, 'UTF8') > 20) {
			$this -> ajaxReturn([
        "error_code" => '1002',
        "error_msg" => 'Invalid password length'
      ]);
			return;
		}

		if (!check_verify($passcode)) {
			$this -> ajaxReturn([
        "error_code" => '1009',
        "error_msg" => 'Invalid passcode'
      ]);
			return;
		}

		if ($pNumber != session('tel')) {
			$this -> ajaxReturn([
        "error_code" => '1010',
        "error_msg" => 'Different phone number'
      ]);
			return;
		}

		if ($telcode != session('telcode')) {
			$this -> ajaxReturn([
        "error_code" => '1011',
        "error_msg" => 'Invalid telcode'
      ]);
			return;
		}

		$users = D('Users');

		$this -> ajaxReturn($users -> regAction($pNumber, $password));
	}

	public function checkAuth(){
		$auth = I('post.auth');

		$arr = explode(':', $auth);
		$ident_code = $arr[0];
		$token = $arr[1];

		$users = D('Users');

		$this -> ajaxReturn($users -> checkAuth($ident_code, $token));
	}

	public function logout(){

		setcookie('auth', '', time() - 3600, '/');
        setcookie('nickname', '', time() - 3600, '/');

		header('Location: http://localhost/login/index.html');
	}

	public function flogout(){
		setcookie('auth', '', time() - 3600, '/');
        setcookie('nickname', '', time() - 3600, '/');

		header('Location: http://localhost/reg_login/index.html');
	}
}