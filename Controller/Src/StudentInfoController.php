<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Query\StudentInfo;

$data = $_POST;
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new StudentInfo($dto);
$log = $logic->process();
echo $log;
exit();
?>