$(document).ready(function(){
    $(".label:not(.active)").on("click", function(){
        if($(this).hasClass('active')){ $('.resp-container').empty(); };
        $(this).addClass('active');
        var id = this.id;
        $.ajax({
            url: "test.php?table="+id+"&where",
            context: document.body,
        }).done(function(r) {
            var response = JSON.parse(r);
            var table = "<table class='table table-striped table-bordered' data-page-length='25'>";
            var i = 0;
            while(i<response.length){
                if(i===0){
                    table += "<thead>";
                    for(x in response[i]){
                        table += "<th>";
                        table += x;
                        table += "</th>";
                    }
                    table += "</thead>";
                    table += "<tbody>";
                }
                table += "<tr>";
                for(x in response[i]){
                    table += "<td>";
                    table += response[i][x];
                    table += "</td>";
                }
                table += "</tr>";
                i++;
            }
            table += "</tbody></table>";
            $('.resp-container').append(table);
            $('.resp-container table').DataTable({ paging: true });
        });
    });
});