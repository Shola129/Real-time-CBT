<?php
namespace NewdichSrc\Command;
use NewdichSchema\Platform;
use NewdichSrc\Migration;
use NewdichDto\AnsofraDto;


class PubSingleResult{
    private $dto;
    private $table = Platform::RESULT_TABLE;
    private $table2 = Platform::SAVESCORE_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $data = [
            "publish"=>"Active"
        ];

        $where = [
            "regNum"=>$this->dto->regNum
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->edit($data, $where);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]==="success"){
            $data = [
            "publish"=>"Active"
            ];

            $where = [
                "regNum"=>$this->dto->regNum
            ];
            $newMig2 = new Migration(null, $this->table2);
            $mig2 = $newMig2->edit($data, $where);
            return $mig2;
        }else{
            return $mig;
        }
    }
}
?>