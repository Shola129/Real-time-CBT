<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\SeacrhQues;

$data = json_decode(file_get_contents("php://input"), true);
$mid = new Index;
$cleanData = [];

foreach($data as $key=>$value){
    $cleanData[$key]=$mid->cleanData($value);
}

$dto = new AnsofraDto($cleanData);
$logic = new SeacrhQues($dto);
$log = $logic->process();
echo $log;
exit();
?>