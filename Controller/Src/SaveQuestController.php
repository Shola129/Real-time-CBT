<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Command\SaveQuest;

$data = $_POST;
$media = $_FILES['media'] ?? [];
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($data);
$logic = new SaveQuest($dto);
$log = $logic->process($media);
echo $log;
exit();
?>