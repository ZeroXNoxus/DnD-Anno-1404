<?php
    $sql = "UPDATE `dnd 5e anno 1404`.`user`";
    $set = " SET ";
    $where = " WHERE ";
    $userId = $_POST["userId"];
    $password = $_POST["password"];
    $re_password = $_POST["re_pass"];
    $table = $_POST["table"];
    if($password == $re_password){
        $hashed_password = hash('sha512', $password);
    }  else{
        http_response_code(400);
        die("Password invalid");
    } 
    $set .= '`hashed_pw` = "'.$hashed_password.'"';
    $where .= '`userId` = "'.$userId.'";';
    $servername = "localhost";
    $db = "dnd 5e anno 1404";
    $server_user = "DnD";
    $server_pw = "TiamatIsALittleBitch";
    try{
        $conn = new PDO('mysql:host='.$servername.';dbname='.$db.';charset=utf8mb4', $server_user, $server_pw);
    } catch (Exception $e){
        http_response_code(401);
        die("Connection failed");
    }
    $sql .= $set.$where;
    try{
        $result = $conn->prepare($sql);
        $result->execute();
    } catch (Exception $e){
        http_response_code(400);
        die("Querry invalid");
    }
    $json = json_encode($result);

    $conn=null;
    echo $sql;
    return $json;
?>