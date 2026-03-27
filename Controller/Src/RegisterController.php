<?php
namespace NewdichControllerSrc;
use NewdichMiddleware\Index;
use NewdichDto\AnsofraDto;
use NewdichSrc\Command\Register;

$data = $_POST;
$mid =new Index();
$cleanData = [];

foreach($data as $key=>$val){
    if($key==='password'){
        $cleanData[$key]=$mid->hashData($val);
    }
    else{
        $cleanData[$key]=$mid->cleanData($val);
    }
}

$cleanData["otp"] = $mid->otp();

$dto = new AnsofraDto($cleanData);
$logic = new Register($dto);
$log = $logic->process();
echo $log;
exit();
?>