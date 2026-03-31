<?php
namespace NewdichControllerSrc;
use NewdichSrc\Command\EditSubject;
use NewdichMiddleware\Index;
use NewdichDto\AnsofraDto;

$data = $_POST;
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new EditSubject();
$log = $logic->process();
echo $log;
exit();

?>