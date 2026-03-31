<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Command\SetDept;

$data = $_POST;
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$cleanData["otp"] = $mid->otp();

$dto = new AnsofraDto($cleanData);
$logic = new SetDept($dto);
$log = $logic->process();
echo $log;
exit();
?>