<?php
namespace NewdichControllerSrc;
use NewdichSrc\Query\validateEmail;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;

$data = json_decode(file_get_contents('php://input'), true);
$mid = new Index();
$cleanData = [];

foreach($data as$key=>$value){
    $cleanData[$key]=$mid->cleanData($value);
}

$cleanData["otp"] = $mid->otp();

$dto = new AnsofraDto($cleanData);
$log = new validateEmail($dto);
$logic = $log->process();
echo $logic;
?>