<?php
namespace NewdichControllerApp;
use NewdichApp\Query\GetSchedule;
use NewdichMiddleware\Index;
use NewdichDto\AnsofraDto;

$data = json_decode(file_get_contents("php://input"), true);
$mid = new Index();
$cleanData = [];

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new GetSchedule($dto);
$log = $logic->process();
echo $log;
exit();
?>