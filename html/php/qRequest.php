<?php
$qType = "";

if(isset($_COOKIE["qType"])){
    $qType = $_COOKIE["qType"];
}
switch ($qType) {
    case "DELETE":
        qDelete();
        break;
    case "INSERT":
        qInsert();
        break;
    case "UPDATE":
        qUpdate();
        break;
    default:
        qSelect();
        break;
}
function qDelete(){
    $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $sql = "DELETE FROM ";
    $keywords = explode("?", $actual_link);
    $keywords = explode("&", $keywords[1]);
    $seperator = "";
    for ($i = 0; $i < count($keywords); $i++) {
        $seperated = explode("=", $keywords[$i]);
        if($i == 0){
            $sql .= $seperated[1];
            $sql .= ' WHERE ';
        } else {
            $sql .= $seperator;
            $sql .= $seperated[0];
            $sql .= ' = ';
            $sql .= "'".$seperated[1]."'";
            $seperator = ", ";
        }
    }
    fetch_result($sql);
}
function qInsert(){
    $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $sql = "INSERT INTO ";
    $rows = " (";
    $values = "VALUES (";
    $keywords = explode("?", $actual_link);
    $keywords = explode("&", $keywords[1]);
    
    $seperator = "";
    for ($i = 0; $i < count($keywords); $i++) {
        $seperated = explode("=", $keywords[$i]);
        if($i == 0){
            $sql .= $seperated[1];
        } else {
            $rows .= $seperator;
            $rows .= $seperated[0];
            $values .= $seperator;
            if($seperated[1]){
                $values .= "'".$seperated[1]."'";
            } else{
                $values .= "DEFAULT";
            }
            $seperator = ", ";
        }
    }
    $rows .= ") ";
    $values .= ");";
    $sql .= $rows.$values;
    fetch_result($sql);
}
function qUpdate(){
    $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $sql = "UPDATE ";
    $set = " SET ";
    $where = " WHERE ";
    
    $keywords = explode("?", $actual_link);
    $keywords = explode("&", $keywords[1]);

    $seperator = "";
    for ($i = 0; $i < count($keywords); $i++) {
        $seperated = explode("=", $keywords[$i]);
        if($i == 0){
            $sql .= $seperated[1];
        } else if($i == 1) {
            $where .= $seperated[0]." = '".$seperated[1]."';";
        } else{
            $set .= $seperator;
            $set .= $seperated[0]." = '".$seperated[1]."'";
            $seperator = ", ";
        }
    }
    $sql .= $set.$where;
    fetch_result($sql);
}
function qSelect(){
    $sql = "SELECT * FROM ".$_GET["table"];
    $sql_prikey = "SHOW KEYS FROM ".$_GET["table"]." WHERE Key_name = 'PRIMARY'";
    fetch_results($sql, $sql_prikey);
}

function getConnection(){
    $servername = "localhost";
    $db = "dnd 5e anno 1404";
    $username = $_COOKIE["Username"];
    $password = $_COOKIE["Password"];
    try {
        $conn = new PDO('mysql:host='.$servername.';dbname='.$db.';charset=utf8mb4', $username, $password);
    } catch(PDOException $e){
        echo 'Connection failed: ' . $e->getMessage();
        exit;
    }
    return $conn;
}


function fetch_result($query) {    
    $servername = "localhost";
    $db = "dnd 5e anno 1404";
    $username = $_COOKIE["Username"];
    $password = $_COOKIE["Password"];
    // Create connection
    $conn = getConnection();
    //$conn = new mysqli($servername, $username, $password, $db);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $json = handleQuerry($conn, $query);
    echo $json;
}

function fetch_results($query, $query2) {    
    $servername = "localhost";
    $db = "dnd 5e anno 1404";
    $username = $_COOKIE["Username"];
    $password = $_COOKIE["Password"];
    // Create connection
    $conn = getConnection();
    //$conn = new mysqli($servername, $username, $password, $db);

    $json = fill_array($conn, $query, $query2);
    $conn=null;
    return $json;
}

function handleQuerry($conn, $query){
    $result = $conn->prepare($query);
    $result->execute();
    $json = json_encode($result);

    $conn=null;
    // Encode array to JSON and respond
    echo $json;
}

function fill_array($conn, $query, $query2){
    $return_arr = [];
    if($query2){
        $result = $conn->prepare($query2);
        $result->execute();
    }
    $return_arr = $result->fetchAll(PDO::FETCH_ASSOC);
    $result = null;
/*     while(($row =  mysqli_fetch_assoc($result))){
        array_push($return_arr,$row);
    } */
    $return_arr_head = array('header' => $return_arr);
    $return_arr = [];
    // Fetch result of SQL query
    $result = $conn->prepare($query);
    $result->execute();
    $return_arr = $result->fetchAll(PDO::FETCH_ASSOC);
    $result = null;
    // Fill array with table data
    /* while(($row =  mysqli_fetch_assoc($result))){
        array_push($return_arr,$row);
    } */
    $return_arr_data = array('content' => $return_arr);
    $json = json_encode($return_arr_head + $return_arr_data);

    $conn=null;
    // Encode array to JSON and respond
    echo $json;
}
?>