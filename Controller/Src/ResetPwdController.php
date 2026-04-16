<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Query\ResetPwd;

$data = json_decode(file_get_contents("php://input"), true);
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}
$cleanData["otp"]=$mid->otp();
$dto = new AnsofraDto($cleanData);
$logic = new ResetPwd($dto);
$log = $logic->process();
echo $log;

?>