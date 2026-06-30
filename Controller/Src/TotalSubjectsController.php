<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichSrc\Query\TotalSubjects;
use NewdichMiddleware\Index;

$data = json_decode(file_get_contents("php://input"), true);
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$value){
    $cleanData[$key] = $mid->cleanData($value);
}

$dto = new AnsofraDto($cleanData);
$logic = new TotalSubjects($dto);
$log = $logic->process();
echo $log;
exit();

?>