<?php
namespace NewdichControllerApp;
use NewdichApp\command\SaveQuestionATT;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;

$data = json_decode(file_get_contents("php://input"), true);
$mid = new Index();
$cleanData = [];

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new SaveQuestionATT($dto);
$log = $logic->process();
echo $log;
exit();
?>