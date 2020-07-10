$(document).ready(function(){
    $(".label").on("click", function(){
        var id = this.id;
        $.ajax({
            url: "test.php?table="+id+"&where",
            context: document.body,
        }).done(function(r) {
            var response = JSON.parse(r);

            while(i<response.length){
                response[i]; //Current Object from Response
                if(i===0){
                    var n = 0;
                    var substr = "";
                    for(x in response[i]){
                        substr += response[i][x]+"</div>";
                        n++;
                    }
                    var str = "<div class='row'><div class='col-"+Math.floor(12/n)+"'>"+substr;
                }
                i++;
            }



            var str = "";
            var title = "";
            var col_count = 0;
            while (i < response.length) {
                var substr = "";
                for(x in response[i]){
                    if(i === 0){
                        col_count++;
                        substr += "</div>";
                    }
                    console.log(x);
                }
                title = "<div class='row'><div class='col-"+(col_count)+" header'>"+substr+"</div>";
                i++;

              }
            //$('#response-container-1').append(title);
            console.log(r);
        });
    });
});