<?php
/* $where = explode(",", $_GET["where"]); */
$sql = "SELECT playerId, copper, silver, gold FROM ".$_GET["table"];
$sql_prikey = "SHOW KEYS FROM ".$_GET["table"]." WHERE Key_name = 'PRIMARY'";
fetch_result($sql, $sql_prikey);

function fetch_result($query, $query2) {
    $servername = "localhost";
    $username = "root";
    $password = "secret";
    $db = "dnd 5e anno 1404";
    
    // Create connection
    $conn = new mysqli($servername, $username, $password, $db);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $json = fill_array($conn, $query, $query2);
    echo $json;
}

function fill_array($conn, $query, $query2){
    $result = $conn->query($query2);
    $return_arr = [];
    while(($row =  mysqli_fetch_assoc($result))){
        array_push($return_arr,$row);
    }
    $return_arr_head = array('header' => $return_arr);
    // Fetch result of SQL query
    $result = $conn->query($query);

    $return_arr = [];
    // Fill array with table data
    while(($row =  mysqli_fetch_assoc($result))){
        array_push($return_arr,$row);
    }
    $return_arr_data = array('content' => $return_arr);
    $json = json_encode($return_arr_head + $return_arr_data);

    // Encode array to JSON and respond
    return $json;
}
?>