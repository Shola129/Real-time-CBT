<?php
namespace NewdichControllerApp;
use NewdichApp\Command\InsertData;
use NewdichMiddleware\Index;
use NewdichDto\AnsofraDto;

$data = json_decode(file_get_contents("php://input"), true);
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
$cleanData["otp"] = $mid->otp();
$dto = new AnsofraDto($cleanData);
$logic = new InsertData($dto);
$log = $logic->process();
echo $log;
exit();

?>