<?php
namespace NewdichControllerApp;
use NewdichApp\Command\InsertData;
use NewdichMiddleware\Index;
use NewdichDto\AnsofraDto;

$data = $_POST;
$mid = new Index();
$cleanData = [];

foreach($data as $key=>$val){
    if($key==="password"){
         $cleanData[$key]=$mid->hashData($val);
    }
    else{
        $cleanData[$key]=$mid->cleanData($val);
    }
}
$cleanData["key"] = $mid->otp();
$dto = new AnsofraDto($cleanData);
$logic = new InsertData($dto);
$log = $logic->process();
echo $log;
exit();

?>