<?php
namespace NewdichSrc\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Migration;
use NewdichSchema\Platform;
use NewdichFiles\Upload;

class SaveQuest{
    private $dto;
    private $table = Platform::QUESTIONS_TABLE;
    private $table2 = Platform::SETSUBJECTS_TABLE;
    private $table3 = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        
    }
}

?>