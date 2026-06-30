<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Query\SearchDepName;

$data = json_decode(file_get_contents("php://input"), true);
$mid = new Index();
$cleandata = [];

foreach($data as $key=>$val){
    $cleandata[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleandata);
$logic = new SearchDepName($dto);
$log = $logic->process();
echo $log;
exit();
?>