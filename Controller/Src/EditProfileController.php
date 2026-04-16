<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Command\EditProfile;

$data = json_decode(file_get_contents("php://input"), true);
$mid =new Index();
$cleanData = [];

foreach($data as $key=>$val){
    if($key==="password"){
        $cleanData[$key]=$mid->hashData($val);
    }else{
        $cleanData[$key]=$mid->cleanData($val);
    }
}

$dto = new AnsofraDto($cleanData);
$logic =  new EditProfile($dto);
$log = $logic->process();
echo $log;
exit();

?>