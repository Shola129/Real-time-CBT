<?php
namespace NewdichControllerApp;
use NewdichApp\Command\SaveQuestionATT;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;

$data = json_decode(file_get_contents("php://input"), true);
$qestionToSave = $data['questionToSave'];
$mid = new Index();
$cleanData = [];

foreach($data as $key=>$val){
  if($key==="questionToSave"){
    $cleanData[$key]=$qestionToSave;
  }
  else{
      $cleanData[$key]=$mid->cleanData($val);
  }
}
$cleanData["otp"] = $mid->otp();
$dto = new AnsofraDto($cleanData);
$logic = new SaveQuestionATT($dto);
$log = $logic->process();
echo $log;
exit();
?>