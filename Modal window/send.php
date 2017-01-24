<?php 
$res = array(
	'status'  => 'ok',
	'data' => array(
		'get' => print_r($_GET, true),
		'post' => print_r($_POST, true),
		'json' => print_r(json_decode(file_get_contents('php://input'), true), true),
		),
	'greetings' => 'Hello, dear friends!',
	);
if ($_GET['status'] == '404') {
	header("HTTP/1.0 404 Not Found");
	$res['status'] = 'not ok';
	$res['greetings'] = 'Don\'t do what you do anymore :(';
}
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
echo json_encode($res);