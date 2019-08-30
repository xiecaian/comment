<?php

$salt = 'JS++';

function trim_space($str){
	$search = array(" ","　","\n","\r","\t");
    $replace = array("","","","","");
    return str_replace($search, $replace, $str);
}

function get_random($len) {
	$chars_array = array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", );
	$charsLen = count($chars_array) - 1;
	$outputstr = "";
	for ($i = 0; $i < $len; $i++) {
		$outputstr .= $chars_array[mt_rand(0, $charsLen)];
	}
	return $outputstr;
}

//生成随机数
function getRandomNum($len) {
	$chars_array = array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
	$charsLen = count($chars_array) - 1;
	$outputstr = "";
	for ($i = 0; $i < $len; $i++) {
		$outputstr .= $chars_array[mt_rand(0, $charsLen)];
	}
	return $outputstr;
}

function request_post($url = '', $param = '') {
    if (empty($url) || empty($param)) {
        return false;
    }
    
    $postUrl = $url;
    $curlPost = $param;
    $ch = curl_init();//初始化curl
    curl_setopt($ch, CURLOPT_URL,$postUrl);//抓取指定网页
    curl_setopt($ch, CURLOPT_HEADER, 0);//设置header
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
    curl_setopt($ch, CURLOPT_POST, 1);//post提交方式
    curl_setopt($ch, CURLOPT_POSTFIELDS, $curlPost);
    $data = curl_exec($ch);//运行curl
    curl_close($ch);
    
    return $data;
}

//验证码检查
function check_verify($code, $id = ''){
    $verify = new \Think\Verify();
    return $verify->check($code, $id);
}

function build_order_no() {
    return date('Ymd') . substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
}