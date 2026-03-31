<?php
namespace NewdichControllerSrc;
use NewdichMiddleware\Index;
use NewdichDto\AnsofraDto;
use NewdichSrc\Query\GetAllSub;

$data = json_decode(file_get_contents('php://input'), true);
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new GetAllSub($dto);
$log = $logic->process();
echo $log;
exit();
?>