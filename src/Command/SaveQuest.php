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
    // private $table3 = Platform::DEPARTMENT_TABLE;

    public function __construct(AnsofraDto $dto){
        $this->dto=$dto;
    }

    public function process($media='null'){
        $where = [
            'department'=>$this->dto->department,
            'subject'=>$this->dto->subject,
            'organization_code'=>$this->dto->organization_code
        ];

        $newMig = new Migration(null, $this->table2);
        $mig = $newMig->get($where,0,1);
        $decodeMig = json_decode($mig, true);
        if($decodeMig["status"]==='success'){
            $newFile = new Upload($media);
            $file = $newFile->process();
            $decodeFile = json_decode($file, true);
            $dragram  = $decodeFile['response'][0] ?? '';
            $data = [
                'department'=>$this->dto->department,
                'subject'=>$this->dto->subject,
                'dragram'=>$dragram ?? '',
                'questionID'=>'QUES/'. substr($this->dto->otp, 0, 2),
                'questiontext'=>$this->dto->questiontext,
                'optionA'=>$this->dto->optionA,
                'optionB'=>$this->dto->optionB,
                'optionC'=>$this->dto->optionC,
                'optionD'=>$this->dto->optionD,
                'optionE'=>$this->dto->optionE ?? '',
                'correctOtp'=>$this->dto->correctOtp ?? 'null',
                'correctAss'=>$this->dto->correctAss,
                'role'=>'set',
                'organization_code'=>$this->dto->organization_code
            ];

            // return json_encode([
            //     "status"=>"failed",
            //     "response"=>$data
            // ], JSON_PRETTY_PRINT);
            $newMig2 = new Migration(null, $this->table);
            $mig2 = $newMig2->save($data);
            return $mig2;
        } 
        else{
            return $mig;
        //    return  json_encode([
        //         'status'=>'failed',
        //         'response'=>'subject is yet to be set'
        //    ], JSON_PRETTY_PRINT);
        }
    }
}

?>