<?php
namespace NewdichControllerApp;
use NewdichApp\Command\SaveScore;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;

$data = json_decode(file_get_contents("php://input"), true);
$mid = new Index();
$cleanData = [];

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$cleanData["otp"] = $mid->otp();
$dto = new AnsofraDto($cleanData);
$logic = new SaveScore($dto);
$log = $logic->process();
echo $log;
exit();
?>