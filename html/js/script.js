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

    $(".label").on("click", function(){
        if($(this).hasClass('active')){
            return;
        }
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var tab = this.id;

        getTable(tab);
    });
});

function bindEventAll(){
    $('form').off('submit');
    $('form').on('submit',function(e){
        e.stopPropagation();
        e.preventDefault();
        var tab = $(this).data('tab');
        var input_elements = $(this).find('input');
        var i = 0;
        var param = "";
        var seperator = "";
        while(i<input_elements.length){
            param += (seperator+input_elements[i].id+"="+input_elements[i].value);
            seperator = "&";
            i++;
        }
        $('.load-dialog').show();
        document.cookie = "qType=INSERT; path=/";
        $.ajax({
            url: "php/qRequest.php?table="+$(this).data('tab'),
            data: param
        }).done(function(r){
            document.cookie = "qType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            getTable(tab);
            $('.load-dialog').hide();
            $('.popup').hide();
        });
        
    });
    $('.resp-container table input').off('change');
    $('.resp-container table input:not(.is_pri)').on('change', function(e){
        console.log(e);
        var tab = e.currentTarget.dataset.tab;
        var name = e.currentTarget.dataset.name;
        var new_val = $(e.currentTarget).val();
        var index = $(e.currentTarget).parent().parent().find('.is_pri')[0].value;
        var index_name = $(e.currentTarget).parent().parent().find('.is_pri')[0].dataset.name;
        document.cookie = "qType=UPDATE; path=/";
        $.ajax({
            url: "php/qRequest.php",
            data: "table="+tab+"&"+index_name+"="+index+"&"+name+"="+new_val
        }).done(function(r){
            document.cookie = "qType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            getTable(tab);
        })
    });
    $('.add_data').off('click');
    $('.add_data').on('click', function(){
        $(".popup").show();
    });
    $('.popup').off('click');
    $('.popup').on('click', function(){
        $(this).hide();
    });
    $('.popup-content').off('click');
    $('.popup-content').on('click', function(e){
        e.stopPropagation();
    });
}

function getTable(tab){
    $('.resp-container').empty();
    $('.popup-content').empty();
    $('.toolbar').removeClass('show');
    $.ajax({
        url: "php/qRequest.php?table="+tab+"&where",
        context: document.body,
    }).done(function(r) {
        var response = JSON.parse(r);
        var table = "<table class='table table-striped table-bordered' data-page-length='25' width='min-width:1800px'>";
        var form = "<div class='row'><div class='col-12'><form class='dialog-form' data-tab='"+tab+"' method='post'><div class='form-group'><h4>Datensatz anlegen für Tabelle '"+tab+"'</h4><div class='row'>";
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
                if(response.header[0]){ if(response.header[0].Column_name == x){ is_pri = true; } }
                table += "<td>";
                if(is_pri){
                    table += "<input type='text' class='is_pri' data-tab='"+tab+"' data-name='"+x+"' value='"+response.content[i][x]+"' />";
                } else{ 
                    table += "<input type='text' data-tab='"+tab+"' data-name='"+x+"' value='"+response.content[i][x]+"' />";
                }
                if(i == 0){
                    if(is_pri){
                        form += "<div class='col-6'><label for='"+x+"'>"+x+"</label><input type='text' class='form-control is_pri disabled' id='"+x+"'></div>";
                    } else{
                        form += "<div class='col-6'><label for='"+x+"'>"+x+"</label><input type='text' class='form-control' id='"+x+"'></div>";
                    }
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
        $('.resp-container table').DataTable({ paging: true });
        bindEventAll();
    });
};