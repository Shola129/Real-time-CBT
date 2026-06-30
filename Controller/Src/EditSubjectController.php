<?php
namespace NewdichControllerSrc;
use NewdichSrc\Command\EditSubject;
use NewdichMiddleware\Index;
use NewdichDto\AnsofraDto;

$data = json_decode(file_get_contents("php://input"), true);
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new EditSubject($dto);
$log = $logic->process();
echo $log;
exit();

?>