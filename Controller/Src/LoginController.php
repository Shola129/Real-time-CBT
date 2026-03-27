<?php
namespace NewdichControllerSrc;
use NewdichDto\AnsofraDto;
use NewdichMiddleware\Index;
use NewdichSrc\Query\Login;

$data = $_POST;
$mid = new Index();
$dto = new AnsofraDto($data);
$logic = new Login($dto, $mid);
$log = $logic->process();
echo $log;
exit();

?>