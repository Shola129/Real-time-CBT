<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Command\EditQuestion;

$data = $_POST;
$file = $_FILES["medial"] ?? "null";
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new EditQuestion($dto);
$media = $logic->upload($file);
$log = $logic->process();
echo $log;
exit();
?>