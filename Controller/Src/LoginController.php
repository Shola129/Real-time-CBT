<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Query\Login;
use NewdichAuth\Authentication;
$data = $_POST;
$mid = new Index();
$cleanData = [];
foreach($data as $key=>$val){
    if($key==="password"){
        $cleanData[$key]=$mid->hashData($val);
    }
    else{
        $cleanData[$key]=$mid->cleanData($val);
    }
}

$dto = new AnsofraDto($cleanData);
$logic = new Login($dto);
$log = $logic->process();
$decodelog = json_decode($log, true);
if($decodelog["status"]==="success"){
    $newAuth = new Authentication();
    $auth = $newAuth->auth($cleanData["email"], "admin");
    $decode = json_decode($auth, true);
    if($decode["status"]==="success"){
        echo json_encode([
            "status"=>"success", 
            "response"=>$decodelog["response"], 
            "res"=>$decode["response"],
            ], JSON_PRETTY_PRINT);
        exit();
    }else{
        echo json_encode([
            "status"=>"failed",
            "response"=>"error occur at our hand"
        ], JSON_PRETTY_PRINT);
        exit();
    }
    // $response = $decode["response"][0];
    // $pass  = $response["password"];
    // $password = $cleanData["password"];
    // if($pass === $password){
    //     echo json_encode([
    //         'status'=>'success',
    //         'response'=>'verification successful'
    //     ], JSON_PRETTY_PRINT);
    //     exit();
    // }
    // else{
    //     echo  json_encode([
    //         'status'=>'failed',
    //         'response'=>'incorrect password'
    //     ], JSON_PRETTY_PRINT);
    //     exit();
    // }
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