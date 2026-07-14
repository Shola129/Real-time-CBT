<?php
namespace NewdichControllerApp;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichApp\Query\GetAvailableOrg;

$data = json_decode(file_get_contents("php://input"), true);
$mid = new Index();
$cleanData = [];


foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new GetAvailableOrg($dto);
$log = $logic->process();
echo $log;
exit();

?>