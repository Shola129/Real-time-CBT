<?php
namespace NewdichControllerApp;
use NewdichApp\Query\Login;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;

$data = json_decode(file_get_contents("php://input"), true);
$mid = new Index();
$dto = new AnsofraDto($data);

$logic = new Login($dto, $mid);
$log = $logic->process();
echo $log;
?>