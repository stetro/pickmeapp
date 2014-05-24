<?php
require 'vendor/autoload.php';
$app = new \Slim\Slim();

header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: X-Requested-With');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Headers: Authorization');

$host = 'localhost';
$dbname = 'stetro_pickmeapp';
$user = 'stetro';
$pass = '';	
$DBH= new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);

function sendGoogleCloudMessage( $data, $ids )
{
	$url = 'https://android.googleapis.com/gcm/send';
	$apiKey = 'AIzaSyBcG_V2Aen_fw03WlMZqAo_SgFCpHIwd6U';
	$post = array(
	    'registration_ids'  => $ids,
	        'data'              => $data,
	    );
	$headers = array( 
		'Authorization: key=' . $apiKey,
		'Content-Type: application/json'
	);

	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_URL, $url );
	curl_setopt( $ch, CURLOPT_POST, true );
	curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $post ) );
	$result = curl_exec( $ch );
	if ( curl_errno( $ch ) )
	{
		echo 'GCM error: ' . curl_error( $ch );
	}
	curl_close( $ch );
	echo $result;
}


$app->get('/sendtest', function () use($DBH) {
	$data = array( 'message' => 'Hello World!' );
	$STH = $DBH->query('SELECT * from regids');
	$STH->setFetchMode(PDO::FETCH_ASSOC);
	$ids = array( );
	while($row = $STH->fetch()) {
		$ids[] = $row['regid'];
	}
	sendGoogleCloudMessage(  $data, $ids );
	echo json_encode($ids);
});

$app->get('/getnotification',function() use($app, $DBH){
	$STH = $DBH->prepare('SELECT * from notifications');
	$STH->execute();
	echo json_encode($STH->fetchAll(PDO::FETCH_ASSOC));
});
$app->get('/notification/', function() use ($app, $DBH){

});

$app->get('/registrationid/', function() use($app, $DBH){
	$STH = $DBH->prepare('SELECT * from regids');
	$STH->execute();
	$STH->setFetchMode(PDO::FETCH_ASSOC);
	echo json_encode($STH->fetchAll(PDO::FETCH_ASSOC));
});

$app->post('/registrationid/', function() use ($app, $DBH){
	$regid = $app->request->post('regid');
	$phonenumber = $app->request->post('phonenumber');

	$STH = $DBH->prepare('SELECT * from regids where regid = ?');
	$STH->bindValue(1, $regid,  PDO::PARAM_STR);
	$STH->execute();
	$STH->setFetchMode(PDO::FETCH_ASSOC);
	$result = $STH->fetch();
	if(empty($result)){
		$STH = $DBH->prepare('INSERT INTO regids (regid, phone) values (?, ?)');
		$STH->bindValue(1, $regid,  PDO::PARAM_STR);
		$STH->bindValue(2, $phonenumber,  PDO::PARAM_STR);
		$STH->execute();
		$STH = $DBH->prepare('SELECT * from regids where regid = ?');
		$STH->bindValue(1, $regid,  PDO::PARAM_STR);
		$STH->execute();
		$STH->setFetchMode(PDO::FETCH_ASSOC);
		$result = $STH->fetch();
		echo '{"id":"'.$result['id'].'", "regid":"'.$result['regid'].'", "phonenumber":"'.$result['phone'].'"}';
	}else{
		echo '{"id":"'.$result['id'].'", "regid":"'.$result['regid'].'", "phonenumber":"'.$result['phone'].'"}';
	}
});

$app->get('/',function(){
	echo "Server is running ...";
});

$app->run();

?>
