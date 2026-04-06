<?php
namespace NewdichApp\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class InsertData{
    private $dto;
    private $table = Platform::USERS_TABLE;
    private $table2 = Platform::DEPARTMENT_TABLE;
    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $where = [
            'department'=>$this->dto->department
            ];
        $newMig = new Migration(null, $this->table2);
        $mig = $newMig->get($where);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]==="success"){
            $col = "email";
            $val = $this->dto->email;
            $regNum = "2026/EXAM/".$this->dto->otp;
            $data = [
                "email"=>$this->dto->email,
                "fullname"=>$this->dto->fullname,
                "password"=>$this->dto->password,
                "role"=>"USER",
                "department"=>$this->dto->department,
                "date_created"=>$this->dto->date_created,
                "regNum"=>$regNum,
                "result"=>$this->dto->result ?? '',
                'state'=>$this->dto->state ?? '',
                "gender"=>$this->dto->gender ?? '',
                "year"=>$this->dto->year ?? '',
                "dob"=>$this->dto->dob,
                "phone"=>$this->dto->phone
            ];

            $newMig2 = new Migration(null, $this->table);
            $mig2 = $newMig2->saveUnique($col, $val, $data);
            return $mig2;
        }
        else{
            return json_encode([
                'status'=>'fail',
                'response'=>'department picked is not available'
            ], JSON_PRETTY_PRINT);
        }
    }

}

?>