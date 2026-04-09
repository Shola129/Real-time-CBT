<?php
namespace NewdichSchema;

class Platform{
    // public const USERS ="users";
    // public const USERS_COLUMNS =[
    //     "users_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    //     "email VARCHAR(255) NOT NULL",
    //     "fullname VARCHAR(255)",
    //     "password VARCHAR(255) NOT NULL",
    //     "country VARCHAR(255)",
    //     "region VARCHAR(255)",
    //     "city VARCHAR(255)",
    //     "address VARCHAR(255)",
    //     "zip_code VARCHAR(255)",
    //     "phone VARCHAR(255)",
    //     "date_created VARCHAR(255)", 
    //     "last_seen VARCHAR(255)",
    //     "picture TEXT",
    //     "username VARCHAR(255)",
    //     "account_type VARCHAR(255)",
    //     "nin VARCHAR(255)",
    //     "bvn VARCHAR(255)",
    //     "tax_id VARCHAR(255)"
    // ];

    public const ADMINS_TABLE ="admins";
    public const ADMINS_TABLE_COLUMNS =[
        "admins_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "email VARCHAR(255) NOT NULL",
        "fullname VARCHAR(255) NOT NULL",
        "password VARCHAR(255) NOT NULL",
        "ID VARCHAR(255)",
        "phone VARCHAR(255)",
        "date_created VARCHAR(255)", 
        "last_login VARCHAR(255)",
        "last_seen VARCHAR(255)",
        "username VARCHAR(255)",
        "role VARCHAR(255) NOT NULL"
    ];

    public const OTPDB_TABLE = "otp";
    public const OTPDB_TABLE_COLUMNS = [
        "otp_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "email VARCHAR(255) NOT NULL",
        "otp VARCHAR(255) NOT NULL"
    ];

    public const ADMINAPPROVE_TABLE = "ADMIN_otp";
    public const ADMINAPPROVE_TABLE_COLUMNS = [
        "ADMIN_otp_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "email VARCHAR(255) NOT NULL",
        "otp VARCHAR(255) NOT NULL",
        "fullname VARCHAR(255) NOT NULL"
    ];

    public const DEPARTMENT_TABLE = "department";
    public const DEPARTMENT_TABLE_COLUMNS = [
        "department_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "department VARCHAR(250) NOT NULL",
        "role VARCHAR(255) NOT NULL",
        "DepartmentCode VARCHAR(255) NOT NULL",
        "HeadOfDepartment  VARCHAR(255) NOT NULL",
        "Description  VARCHAR(255)",
        "Date_Created VARCHAR(255) NOT NULL",
        "departmentID VARCHAR(255) NOT NULL"
    ];

    public const SETSUBJECTS_TABLE = "subjects";
    public const SETSUBJECTS_TABLE_COLUMNS = [
        "subjects_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "department VARCHAR(2550) NOT NULL",
        "DepartmentCode VARCHAR(2550) NOT NULL",
        "subject VARCHAR(2550) NOT NULL",
        "subjectID VARCHAR(255) NOT NULL",
        "role VARCHAR(255) NOT NULL",
        "Date_Created VARCHAR(255) NOT NULL"
    ];

    public const QUESTIONS_TABLE = "questions";
    public const QUESTIONS_TABLE_COLUMNS = [
        "questions_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "department VARCHAR(2550) NOT NULL",
        "subject VARCHAR(2550) NOT NULL",
        "dragram VARCHAR(255) ",
        "questionID VARCHAR(255) NOT NULL",
        "questiontext VARCHAR(1550) NOT NULL",
        "optionA VARCHAR(255) NOT NULL",
        "optionB VARCHAR(255) NOT NULL",
        "optionC VARCHAR(255) NOT NULL",
        "optionD VARCHAR(255) ",
        "optionE VARCHAR(255) ",
        "correctOtp VARCHAR(255) NOT NULL",
        "correctAss VARCHAR(255) NOT NULL",
        "role VARCHAR(255) NOT NULL"
    ];

    public const USERS_TABLE = "users";
    public const USERS_TABLE_COLUMNS = [
        "users_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "email VARCHAR(255) NOT NULL",
        "fullname VARCHAR(255) NOT NULL",
        "password VARCHAR(255) NOT NULL",
        "regNum VARCHAR(255)",
        "phone VARCHAR(255)",
        "date_created VARCHAR(255)", 
        "role VARCHAR(255) NOT NULL",
        "department VARCHAR(255) NOT NULL",
        "result VARCHAR(255)",
        "dob VARCHAR(255) NOT NULL",
        "gender VARCHAR(255) NOT NULL",
        "state VARCHAR(255) NOT NULL",
        "year VARCHAR(255) NOT NULL",

    ];

    public const SETEXAMTIME_TABLE = 'exam_time_table';
    public const SETEXAMTIME_TABLE_COLUMNS = [
        'exam_time_table_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY',
        'department VARCHAR(255) NOT NULL',
        'DepartmentCode VARCHAR(255) NOT NULL',
        'timeID VARCHAR(255)',
        'date VARCHAR(255) NOT NULL',
        'start VARCHAR(255) NOT NULL',
        'end VARCHAR(255) NOT NULL',
        'duration VARCHAR(255) NOT NULL',
        'role VARCHAR(255) NOT NULL'
    ];

    public const QUESTIONATTEMPTS_TABLE = 'question_attempts';
    public const QUESTIONATTEMPTS_TABLE_COLUMNS = [
        "question_attempts_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "department VARCHAR(255) NOT NULL",
        "subject VARCHAR(255) NOT NULL",
        "regNum VARCHAR(255) NOT NULL",
        "question TEXT",
        "status VARCHAR(255) NOT NULL",
        "score VARCHAR(255) NOT NULL",
        "startedAt VARCHAR(255) NOT NULL"
    ];

    public const SAVEQUESTIONS_TABLE = "save_question_attempted";
    public const SAVEQUESTIONS_TABLE_COLUMNS = [
        "save_question_attempted_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "department VARCHAR(255) NOT NULL",
        "subject VARCHAR(255) NOT NULL",
        "regNum VARCHAR(255) NOT NULL",
        "questionID VARCHAR(255) NOT NULL",
        "correctOtp VARCHAR(255)",
        "correctAns VARCHAR(255)",
        "optionPicked VARCHAR(255)",
        "answerPicked VARCHAR(255)",
        "saveAt VARCHAR(255)",
        "savequestID VARCHAR(255) NOT NULL",
    ];

    public const SAVESCORE_TABLE = "save_scores";
    public const SAVESCORE_TABLE_COLUMNS = [
        "save_scores_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "score VARCHAR(255) NOT NULL",
        "OverAll VARCHAR(255) NOT NULL",
        "subject VARCHAR(255) NOT NULL",
        "department VARCHAR(255) NOT NULL",
        "regNum VARCHAR(255) NOT NULL",
        "saveAt VARCHAR(255) NOT NULL"
    ];

    //you can have as many tables as you want
}
?>