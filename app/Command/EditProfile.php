<?php
namespace NewdichApp\Command;
use NewdichDto\AnsofraDto;
use NewdichSchema\Platform;
use NewdichSchema\Migration;

class EditProfile{
    private $dto;
    private $table = Platform::USERS_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process(){
        $date = [
            "email"=>$this->dto->email,
            "fullname"=>$this->dto->fullname,
            // "password"=>$this->dto->password,
            // "role"=>'ue',
            // "department"=>$this->dto->department,
            // "date_created"=>$this->dto->date_created,
            // "regNum"=>$this->dto->regNum,
            // "result"=>$this->dto->result ?? '',
            // 'state'=>$this->dto->state,
            // "gender"=>$this->dto->gender,
            // "year"=>$this->dto->year,
            // "dob"=>$this->dto->dob,
            "phone"=>$this->dto->phone,
            // "organization_code"=>$this->dto->organization_code,
            // "status"=>"active",
            // "organization_name"=>$this->dto->organization_name
        ];

        $where = [
            "regNum"=>$this->dto->regNum,
            "organization_code"=>$this->dto->organization_code,
            "users_id"=>$this->dto->ID
        ];

        $newMig = new Migration(null, $this->table);
        $mig = $newMig->edit($date, $where);
        return $mig;
    }
}
?>