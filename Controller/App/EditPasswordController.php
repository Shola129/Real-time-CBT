<?php
namespace NewdichControllerApp;
use NewdichApp\Command\EditPassword;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;

$data = json_decode(file_get_contents("php://input"), true);
$cleanData = [];
$mid = new Index();

foreach($data as $key=>$val){
    if($cleanData["key"]==="password"){
        $cleanData[$key]=$mid->hashData($val);
    }elseif($cleanData["key"]==="old_password"){
        $cleanData[$key]=$mid->hashData($val);
    }
    $cleanData[$key]=$mid->cleanData($val);
}

$dto = new AnsofraDto($cleanData);
$logic = new EditPassword($dto);
$log = $logic->process();
echo $log;
exit();

?>