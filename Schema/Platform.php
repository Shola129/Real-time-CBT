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
        "department VARCHAR(1000) NOT NULL",
        "role VARCHAR(255) NOT NULL"
    ];

    public const SETSUBJECTS_TABLE = "subject_sets";
    public const SETSUBJECTS_TABLE_COLUMNS = [
        "subject_sets_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "department VARCHAR(2550) NOT NULL",
        "subject VARCHAR(2550) NOT NULL",
        "subjectID VARCHAR(255) NOT NULL",
        "role VARCHAR(255) NOT NULL",
    ];

    public const QUESTIONS_TABLE = "questions";
    public const QUESTIONS_TABLE_COLUMNS = [
        "subject_sets_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
        "department VARCHAR(2550) NOT NULL",
        "subject VARCHAR(2550) NOT NULL",
        "questionID VARCHAR(255) NOT NULL",
        "questiontext TEXT NOT NULL",
        "optionA VARCHAR(255) NOT NULL",
        "optionB VARCHAR(255) NOT NULL",
        "optionC VARCHAR(255) NOT NULL",
        "optionD VARCHAR(255) NOT NULL",
        "optionE VARCHAR(255) NOT NULL",
        "correctAss VARCHAR(255) NOT NULL",
        "role VARCHAR(255) NOT NULL"
    ];

    //you can have as many tables as you want
}
?>