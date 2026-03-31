<?php
namespace NewdichControllerSrc;
use NewdichSrc\Command\EditDepartment;
use NewdichMiddleware\Index;
use NewdichDto\AnsofraDto;

$data = $_POST;
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new EditDepartment();
$log = $logic->process();
echo $log;
exit();

?>