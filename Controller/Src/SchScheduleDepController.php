<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Query\SchScheduleDep;

$data = json_decode(file_get_contents("php://input"), true);
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new SchScheduleDep($dto);
$log = $logic->process();
echo $log;
exit();
?>