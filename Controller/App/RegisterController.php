<?php
namespace NewdichControllerApp;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichApp\Query\VerifyEmail;

$data = $_POST;
$mid = new Index();
$cleanData = [];

foreach($data as $key=>$val){
    $cleanData[$key]=$mid->cleanData($val);
}
$cleanData['otp'] = $mid->otp();
$dto = new AnsofraDto($cleanData);
$logic = new VerifyEmail($dto);
$log = $logic->process();
echo $log;
exit();

?>