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
            $sql .= urldecode($seperated[1]);
            $sql .= ' WHERE ';
        } else {
            $sql .= $seperator;
            $sql .= urldecode($seperated[0]);
            $sql .= ' = ';
            $sql .= "'".urldecode($seperated[1])."'";
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
            $sql .= '`dnd 5e anno 1404`.'.urldecode($seperated[1]).'`';
        } else {
            $rows .= $seperator;
            $rows .= urldecode($seperated[0]);
            $values .= $seperator;
            if($seperated[1]){
                $values .= "'".urldecode($seperated[1])."'";
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
            $sql .= '`dnd 5e anno 1404`.`'.urldecode($seperated[1]).'`';
        } else if($i == 1) {
            $where .= urldecode($seperated[0])." = '".urldecode($seperated[1])."';";
        } else{
            $set .= $seperator;
            $set .= urldecode($seperated[0])." = '".urldecode($seperated[1])."'";
            $seperator = ", ";
        }
    }
    $sql .= $set.$where;
    fetch_result($sql);
}
function qSelect(){
    $sql = "SELECT * FROM `dnd 5e anno 1404`.`".$_GET["table"]."`";
    $sql_prikey = "SHOW KEYS FROM `dnd 5e anno 1404`.`".$_GET["table"]."` WHERE Key_name = 'PRIMARY'";
    $sql_seckey = "SHOW KEYS FROM `dnd 5e anno 1404`.`".$_GET["table"]."` WHERE Key_name REGEXP '_idx'";
    fetch_results($sql, $sql_prikey, $sql_seckey);
}

function getConnection(){
    // Create connection
    $servername = "localhost";
    $db = "dnd 5e anno 1404";
    $username = $_COOKIE["Username"];
    $password = $_COOKIE["Password"];
    try {
        // Try establishing connection
        $conn = new PDO('mysql:host='.$servername.';dbname='.$db.';charset=utf8mb4', $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (Exception $e) {
        // Send error code and set http response code
        http_response_code(401);
        die("Connection failed: " . $e->getMessage());
    }

    return $conn;
}


function fetch_result($query) {    
    // Get connection
    $conn = getConnection();

    $json = handleQuerry($conn, $query);
    echo $json;
}

function fetch_results($query, $query2, $query3) {    
    // Get connection
    $conn = getConnection();

    $json = fill_array($conn, $query, $query2, $query3);
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

function fill_array($conn, $query, $query2, $query3){
    $return_arr = [];
    if($query2){
        $result = $conn->prepare($query2);
        $result->execute();
    }
    $return_arr = $result->fetchAll(PDO::FETCH_ASSOC);
    $result = null;

    $return_arr_pri = array('primary' => $return_arr);

    $return_arr = [];
    if($query3){
        $result = $conn->prepare($query3);
        $result->execute();
    }
    $return_arr = $result->fetchAll(PDO::FETCH_ASSOC);
    $result = null;

    $return_arr_sec = array('secondary' => $return_arr);

    $return_arr = [];
    // Fetch result of SQL query
    $result = $conn->prepare($query);
    $result->execute();
    $return_arr = $result->fetchAll(PDO::FETCH_ASSOC);
    $result = null;
    // Fill array with table data
    $return_arr_data = array('content' => $return_arr);
    $json = json_encode($return_arr_pri + $return_arr_sec + $return_arr_data);

    $conn=null;
    // Encode array to JSON and respond
    echo $json;
}

set_error_handler("myErrorHandler");
function myErrorHandler($errno, $errstr, $errfile, $errline)
{
    error_log("$errstr in $errfile:$errline");
    header('HTTP/1.1 500 Internal Server Error', TRUE, 500);
    readfile("500.html");
    exit;
}

?>