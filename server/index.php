<?php
require 'vendor/autoload.php';
$app = new \Slim\Slim();
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


$app->get('/sendtest', function () {

	$host = 'localhost';
	$dbname = 'stetro_pickmeapp';
	$user = 'stetro';
	$pass = '';	
	$DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
	$data = array( 'message' => 'Hello World!' );
	$STH = $DBH->query('SELECT * from regids');
	$STH->setFetchMode(PDO::FETCH_ASSOC);
	$ids = array( );
	while($row = $STH->fetch()) {
		$ids[] = $row['regid'];
	}
	sendGoogleCloudMessage(  $data, $ids );
});
$app->get('/',function(){
	echo "Server is running ...";
});

$app->run();

?>
