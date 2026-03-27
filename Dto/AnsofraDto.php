<?php
namespace NewdichDto;
use NewdichMiddleware\Index;

class AnsofraDto{
    public $email;
    public $password;
    public $fullname;
    public $username;
    public $phone;
    public $country;
    public $region;
    public $city;
    public $address;
    public $zip_code;
    public $date_created;
    public $last_seen;
    public $picture;
    public $role;
    public $database_name;
    public $otpCode;
    public $ID;
    public $otp;

    public function __construct(array $inData){
        $allProp = get_object_vars($this);
        foreach($allProp as $k => $v){
            $this->$k = isset($inData[$k]) ? $inData[$k] : '';
        }
    }
}
?>