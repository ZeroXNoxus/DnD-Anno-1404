$(document).ready(function(){
    $('.nav-close-btn>.btn').on('click', function(){
        if(!$('#navbar').hasClass('show')){
            $(this).addClass('btn-danger').removeClass('btn-primary');
            $(this).find('.fas').removeClass('fa-bars');
            $(this).find('.fas').addClass('fa-times-circle');
        } else {
            $(this).addClass('btn-primary').removeClass('btn-danger');
            $(this).find('.fas').removeClass('fa-times-circle');
            $(this).find('.fas').addClass('fa-bars');
        }
        $('#navbar').toggleClass('show');
        
    });

    $('.add_data').on('click', function(){
        $(".popup").show();
    });

    $(".label").on("click", function(){
        if($(this).hasClass('active')){
            return;
        }
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $('.resp-container').empty();
        
        var tab = this.id;
        $('.toolbar').removeClass('show');
        $.ajax({
            url: "test.php?table="+tab+"&where",
            context: document.body,
        }).done(function(r) {
            var response = JSON.parse(r);
            var table = "<table class='table table-striped table-bordered' data-page-length='25' width='min-width:1800px'>";
            var form = "<div class='row'><div class='col-12'><form data-tab='"+tab+"' method='post'><div class='form-group'><h4>Datensatz anlegen für Tabelle '"+tab+"'</h4><div class='row'>";
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
                    if(i == 0){
                        form += "<div class='col-6'><label for='"+x+"'>"+x+"</label><input type='text' class='form-control' id='"+x+"'></div>";
                    }
                    table += "</td>";
                }
                table += "</tr>";
                i++;
            }
            form += "</div><div class='pt-3'><button type='submit' class='btn btn-primary'>Submit</button></div></div></form></div></div>";
            table += "</tbody></table>";
            $('.resp-container').append(table);
            $('.popup-content').append(form);
            $('.toolbar').addClass('show');
            $('.resp-container table').DataTable({ paging: true, select: true, ordering: true });
            $('form').on('submit',function(e){
                e.stopPropagation();
                e.preventDefault();
                var input_elements = $(this).find('input');
                var i = 0;
                var param = "";
                while(i<input_elements.length){
                    param += (input_elements[i].id+"="+input_elements[i].value+"&");
                    i++;
                }
                console.log(param);
                $.ajax({
                    url: "add_row.php?table="+$(this).data('tab'),
                    data: param
                });
                $('.popup').hide();
            })
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