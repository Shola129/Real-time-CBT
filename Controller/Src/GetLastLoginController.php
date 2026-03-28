<?php
namespace NewdichControllerSrc;
use NewdichSrc\Query\GetLastLogin;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;

$data = $_POST;
$mid = new Index();
$cleanData = [];

foreach($data as $key=>$value){
    $cleanData[$key]=$mid->cleanData($value);
}

$dto =new AnsofraDto($cleanData);
$logic = new GetLastLogin($dto);
$log = $logic->process();
echo $log;
exit();

?>
