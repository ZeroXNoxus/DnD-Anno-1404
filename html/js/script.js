$(document).ready(function(){
    $(".label").on("mouseup", function(){
        if($(this).hasClass('active')){
            return;
        }
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $('.resp-container').empty();
        
        var tab = this.id;
        $.ajax({
            url: "test.php?table="+tab+"&where",
            context: document.body,
        }).done(function(r) {
            var response = JSON.parse(r);
            var table = "<table class='table table-striped table-bordered' data-page-length='25' width='min-width:1800px'>";
            var i = 0;
            while(i<response.content.length){
                if(i===0){
                    table += "<thead>";
                    for(x in response.content[i]){
                        table += "<th>";
                        table += x;
                        table += "</th>";
                    }
                    table += "</thead>";
                    table += "<tbody>";
                }
                table += "<tr>";
                for(x in response.content[i]){
                    var is_pri = false;
                    if(response.header[i]){ if(response.header[i].Column_name == x){ is_pri = true; } }
                    table += "<td>";
                    if(is_pri){
                        table += "<input type='text' class='is_pri' data-tab='"+tab+"' data-name='"+x+"' value='"+response.content[i][x]+"' />";
                    } else{ 
                        table += "<input type='text' data-tab='"+tab+"' data-name='"+x+"' value='"+response.content[i][x]+"' />";
                    }
                    table += "</td>";
                }
                table += "</tr>";
                i++;
            }
            table += "</tbody></table>";
            $('.resp-container').append(table);
            $('.resp-container table').DataTable({ paging: true, select: true, ordering: true });
            $('.resp-container table input').off('change');
            $('.resp-container table input:not(.is_pri)').on('change', function(e){
                console.log(e);
                var tab = e.currentTarget.dataset.tab;
                var name = e.currentTarget.dataset.name;
                var index = $(e.currentTarget).parent().parent().find('.is_pri')[0].value;
            })
        });
    });
});