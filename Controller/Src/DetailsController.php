<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Query\Details;

$data = $_POST;
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$value){
    $cleanData[$key] = $mid->cleanData($value);
}

$dto = new AnsofraDto($cleanData);
$logic = new Details($dto);
$log = $logic->process();
echo $log;
exit();

?>