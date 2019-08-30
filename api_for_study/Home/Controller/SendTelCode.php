<?php
session_start();

include_once ("CCPRestSDK.php");

//主帐号
$accountSid = '8aaf070869c854f30169cea88d24028e';

//主帐号Token
$accountToken = 'aeb69be6199f453a8d7b4bd7433183bf';

//应用Id
$appId = '8a216da869c8398f0169d35fd5e8036c';

//请求地址，格式如下，不需要写https://
$serverIP = 'app.cloopen.com';

//请求端口
$serverPort = '8883';

//REST版本号
$softVersion = '2013-12-26';

/**
 * 发送模板短信
 * @param to 手机号码集合,用英文逗号分开
 * @param datas 内容数据 格式为数组 例如：array('Marry','Alon')，如不需替换请填 null
 * @param $tempId 模板Id
 */
function sendTemplateSMS($to, $datas, $tempId) {
	// 初始化REST SDK
	global $accountSid, $accountToken, $appId, $serverIP, $serverPort, $softVersion;
	$rest = new REST($serverIP, $serverPort, $softVersion);
	$rest -> setAccount($accountSid, $accountToken);
	$rest -> setAppId($appId);

	// 发送模板短信
	$result = $rest -> sendTemplateSMS($to, $datas, $tempId);
	if ($result == NULL) {
		return false;
	}
	if ($result -> statusCode != 0) {
		/*return false;*/
		echo "error code :" . $result->statusCode . "<br>";
        echo "error msg :" . $result->statusMsg . "<br>";
    if($result->statusCode ==160040){
    	echo 2;
    }
	} else {
		return true;
	}
}
//生成随机数
function Getrandom($len) {
	$chars_array = array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
	$charsLen = count($chars_array) - 1;
	$outputstr = "";
	for ($i = 0; $i < $len; $i++) {
		$outputstr .= $chars_array[mt_rand(0, $charsLen)];
	}
	return $outputstr;
}

$tel = trim($_POST['tel']);
$randcode = Getrandom(6);


//Demo调用,参数填入正确后，放开注释可以调用
$res = sendTemplateSMS($tel, array($randcode,'1'), "1");
if ($res) {
	echo $tel . ',' . $randcode;
} else {
	echo 0;
}
?>




















