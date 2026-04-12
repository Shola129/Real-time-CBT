<?php
namespace NewdichControllerApp;
use NewdichApp\command\Result;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;

$data = json_decode(file_get_contents("php://input"), true);
$subject_score = $data["subjectAndScore"];
$mid = new Index();
$cleanData = [];

foreach($data as $key=>$val){
  if($key==="subjectAndScore"){
    $cleanData[$key]=$subject_score;
  }
  else{
      $cleanData[$key]=$mid->cleanData($val);
  }
}

$dto = new AnsofraDto($cleanData);
$logic = new Result($dto);
$log = $logic->process();
echo $log;
exit();
?>