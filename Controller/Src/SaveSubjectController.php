<?php
namespace NewdichControllerSrc;
use NewdichSrc\Command\SaveSubject;
use NewdichMiddleware\Index;
use NewdichDto\AnsofraDto;

$data = $_POST;
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$cleanData["otp"]=$mid->otp();
$dto = new AnsofraDto($cleanData);
$logic = new SaveSubject($dto);
$log = $logic->process();
echo $log;
exit();

?>