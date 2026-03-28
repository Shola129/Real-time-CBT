<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Query\TotalStudents;

$data = $_POST;
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$value){
    $cleanData[$key]=$mid->cleanData($value);
}

$dto = new AnsofraDto($cleanData);
$logic = new TotalStudents($dto);
$log = $logic->process();
echo $log;
exit();

?>