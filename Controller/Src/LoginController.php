<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Query\Login;

$data = $_POST;
$mid = new Index();
$cleanData = [];
foreach($data as $key=>$val){
    if($key==="password"){
        $cleanData["key"]=$mid->hashData($val);
    }
    else{
        $cleanData["key"]=$mid->cleanData($val);
    }
}

$dto = new AnsofraDto($cleanData);
$logic = new Login($dto);
$log = $logic->process();
$decode = json_decode($log, true);
if($decode["status"]==="success"){
    $response = $decode["response"][0];
    $pass  = $response["password"];
    $password = $cleanData["password"];
    if($pass === $password){
        echo json_encode([
            'status'=>'success',
            'response'=>'verification successful'
        ], JSON_PRETTY_PRINT);
        exit();
    }
    else{
        echo  json_encode([
            'status'=>'failed',
            'response'=>'incorrect password'
        ], JSON_PRETTY_PRINT);
        exit();
    }
}
else{
    echo json_encode([
        'status'=>'failed',
        'response'=>'email or ID not found'
    ], JSON_PRETTY_PRINT);
    exit();
}
exit();

?>