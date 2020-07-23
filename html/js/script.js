$(document).ready(function(){
    document.addEventListener('keydown', checkKey);
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
    $(".label:not(.btn-label)").off("click");
    $(".label:not(.btn-label)").on("click", function(){
        if($(this).hasClass('active')){
            return;
        }
        $('#navbar .label').removeClass('active');
        $(this).addClass('active');
        $('.label#'+this.id).addClass('active');
        if($(this).hasClass('dropdown-item')){
            var target = $(this).parent('.dropdown-menu')[0].getAttribute("aria-labelledby");
            $('#'+target).addClass('active');
        }
        var tab = this.id;

        getTable(tab, this);
    });
});

var loc_arr = {
    "userId":{ "de":"Benutzer-ID", "en":"User-ID" },
    "characterId":{ "de":"Charakter-ID", "en":"Character-ID" }, 
    "resourceId":{ "de":"Ressourcen-ID", "en":"Resource-ID" },
    "orgId":{ "de":"Unternehmens-ID", "en":"Organisation-ID" },
    "cityId":{ "de":"Stadt-ID", "en":"City-ID" },
    "orgName":{ "de":"Unternehmensname", "en":"Organisation-Name" },
    "definition":{ "de":"Definition", "en":"Definition" },
    "name":{ "de":"Name", "en":"Name" },
    "weight":{ "de":"Gewicht", "en":"Weight" },
    "population":{ "de":"Einwohnerzahl", "en":"Population" }, 
    "tax":{ "de":"Steuer", "en":"Tax" }, 
    "copper":{ "de":"Kupfer", "en":"Copper" },
    "silver":{ "de":"Silber", "en":"Silver" },
    "gold":{ "de":"Gold", "en":"Gold" },
    "cp_value":{ "de":"Kupferwert", "en":"Copper-Value" },
    "count":{ "de":"Anzahl", "en":"Count" }
}

function bindEventAll(tab){
    var form = $('form');
    form.off('submit');
    form.on('submit',function(e){
        e.stopPropagation();
        e.preventDefault();
        var input_elements = $(this).find('input');
        var i = 0;
        var param = "";
        var seperator = "";
        $('.load-dialog').show();
        while(i<input_elements.length){
            var str = input_elements[i].id;
            str = str.split(".")[0];
            param += (seperator+str+"="+input_elements[i].value);
            seperator = "&";
            i++;
        }
        if($(this).hasClass('insert-form')){
            document.cookie = "qType=INSERT; path=/";
        } else if($(this).hasClass('update-form')){
            document.cookie = "qType=UPDATE; path=/";
        }
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
    $('.mass-edit-btn').off('click');
    $('.mass-edit-btn').on('click', function(){
        if($(this).hasClass('btn-primary')){
            $(this).removeClass('btn-primary');
            $(this).addClass('btn-success');
        } else if($(this).hasClass('btn-success')){
            $(this).removeClass('btn-success');
            $(this).addClass('btn-primary');

        }
        $('.resp-container table .tab-val').toggleClass('hidden');
    });
    $('.resp-container table input:not(.is_pri)').off('change');
    $('.resp-container table input:not(.is_pri)').on('change', function(e){
        var target = e.currentTarget;
        var tab = target.dataset.tab;
        var name = target.dataset.name;
        var new_val = decodeURI($(target).val());
        var selection = $(target).parent().parent().find('.is_pri');
        var index, index_name;
        if(selection.length){
            index = selection.val();
            index_name = selection.data('name');
        } else {
            selection = $(target).parent().siblings().first().find('input');
            index = selection.val();
            index_name = selection.data('name');
        }

        $(this).siblings().text(new_val);
        document.cookie = "qType=UPDATE; path=/";
        $.ajax({
            url: "php/qRequest.php",
            data: "table="+tab+"&"+index_name+"="+index+"&"+name+"="+new_val,
            context: document.body
        }).done(function(r){
            document.cookie = "qType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        })
    });
    $('.insert-btn').off('click');
    $('.insert-btn').on('click', function(){
        $("#popup-insert").show().focus();
    });
    $('.popup').off('click');
    $('.popup').on('click', function(){
        $(this).hide();
    });
    $('.popup>div').off('click');
    $('.popup>div').on('click', function(e){
        e.stopPropagation();
    });
    $('.edit-btn').off('click');
    $('.edit-btn').on('click', function(){
        if($('.mass-edit-btn.btn-success').length != 0){
            alert("Bitte schalten Sie zuerst den Massen-Bearbeitungs-Modus aus!");
            return;
        }
        var selected = $('.dataTable tr.selected input');
        var i = 0;
        while(i<selected.length){ 
            if($(selected[i]).hasClass('is_pri')){ 
                $('span.titleId').text(selected[i].value)
            } 
            $('.update-form input#'+selected[i].dataset.name+"\\.2").val(selected[i].value); 
            i++; 
        }
        $('#popup-update').show().focus();
    });
    $('.delete-btn').off('click');
    $('.delete-btn').on('click', function(){
        var selected = $('.dataTable tr.selected input.is_pri');
        if(confirm("Sind Sie sicher, dass sie den Eintrag der Tabelle '"+tab+"' mit der ID: '"+selected.val()+"' löschen möchten?")){
            document.cookie = "qType=DELETE; path=/";
            $.ajax({
                url: "php/qRequest.php?table="+tab,
                data: selected.data('name')+"="+selected.val(),
                context: document.body
            }).done(function(r){
                document.cookie = "qType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
                getTable(tab);
            });
        } else{ return; }
    });
    $('.paginate_button').on('click', function(){
        bindRowEvent();
    });
    bindRowEvent();
};

function checkKey(e){
    if(e.keyCode == 27){
        $('.popup').hide();
        if($('.mass-edit-btn').hasClass('btn-success')){
            $('.mass-edit-btn').removeClass('btn-success').addClass('btn-primary');
            $('.tab-val').toggleClass('hidden');
        }
    } else if(e.keyCode == 13){
        $('button[type=submit]:visible').click();
    }
}

function bindRowEvent(){
    $('.edit-btn, .delete-btn').addClass('disabled');
    $('div.tab-val:not(.pri)').off('dblclick');
    $('div.tab-val:not(.pri)').on('dblclick', function(){
        var btn = $('.mass-edit-btn');
        if(btn.hasClass('btn-primary')){
            btn.removeClass('btn-primary');
            btn.addClass('btn-success');
        } else if(btn.hasClass('btn-success')){
            btn.removeClass('btn-success');
            btn.addClass('btn-primary');
        }
        $('.resp-container table .tab-val').toggleClass('hidden');
        $(this).siblings().focus();
    });
    $('.dataTable tbody>tr').off('click');
    $('.dataTable tbody>tr').on('click', function(e){
        $('.dataTable tbody>tr.selected').removeClass('selected');
        $(this).addClass('selected');
        $('.edit-btn, .delete-btn').removeClass('disabled');
    });
};

function getTable(tab, obj){
    var where = "";
    if(obj.dataset.where){
        var where = obj.dataset.where;
    }
    $('.resp-container').empty();
    $('.popup-content').empty();
    $('.toolbar').removeClass('show');
    $('.load-dialog').show();
    var link = '';
    link = "php/qRequest.php?table="+tab;
    if(where !== ""){
        link += "&where="+where
    }
    $.ajax({
        url: link,
        context: document.body,
    }).done(function(r) {
        if(r){
            var response = JSON.parse(r);
            if(response.content.length){
                var table = "<table class='table table-striped table-bordered' data-page-length='25' width=''>";
                var form = "<div class='row'><div class='col-12'><form class='popup-form' data-tab='"+tab+"' method='post'><div class='form-group col-12'><h4 class='header'>Datensatz anlegen für Tabelle '"+tab+"'</h4><div class='row'>";
                var alt_text = tab+" mit ID '<span class='titleId'></span>' bearbeiten";
                var i = 0;
                while(i<response.content.length){
                    var obj = response.content[i];
                    if(i===0){
                        table += "<thead>";
                        for(x in obj){
                            var loc_x = x;
                            if(loc_arr[x]){
                                loc_x = loc_arr[x][$('.hidden span.language').text()];
                            }
                            table += "<th>";
                            table += loc_x;
                            table += "</th>";
                        }
                        table += "</thead>";
                        table += "<tbody>";
                    }
                    table += "<tr>";
                    for(x in obj){
                        var loc_x = x;
                        if(loc_arr[x]){
                            loc_x = loc_arr[x][$('.hidden span.language').text()];
                        }
                        var value = obj[x];
                        var is_pri = false;
                        var is_sec = false;
                        if(response.primary.length){ if(response.primary[0].Column_name == x){ is_pri = true; } }
                        if(response.secondary.length){ 
                            count = 0;
                            while(count<response.secondary.length){
                                if(response.secondary[count].Column_name == x){ is_sec = true; count = response.secondary.length;} 
                                count++;
                            }
                        }
                        if(i == 0){
                            if(is_pri){
                                form += "<div class='col-6'><label for='"+x+"'>"+loc_x+"</label><input type='text' class='form-control is_pri disabled' id='"+x+"'></div>";
                            } else if(is_sec){
                                form += "<div class='col-6'><label for='"+x+"'>"+loc_x+"</label><input type='text' class='form-control is_sec' id='"+x+"'></div>";
                            } else{
                                form += "<div class='col-6'><label for='"+x+"'>"+loc_x+"</label><input type='text' class='form-control' id='"+x+"'></div>";
                            }
                        }
                        table += "<td>";
                        if(is_pri){
                            table += "<div class='tab-val pri' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"'>"+value+"</div><input type='text' class='hidden tab-val pri is_pri' data-tab='"+tab+"' data-name='"+x+"' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"' value='"+value+"' />";
                        } else if(is_sec){
                            table += "<div class='tab-val sec' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"'>"+value+"</div><input type='text' class='hidden tab-val is_sec' data-tab='"+tab+"' data-name='"+x+"' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"' value='"+value+"' />";
                        }else{ 
                            table += "<div class='tab-val' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"'>"+value+"</div><input type='text' class='hidden tab-val' data-tab='"+tab+"' data-name='"+x+"' data-title='"+loc_x+": "+value+"' title='"+loc_x+": "+value+"' value='"+value+"' />";
                        }
                        table += "</td>";
                    }
                    table += "</tr>";
                    i++;
                }
                form += "</div><div class='footer'><button type='submit' class='btn btn-primary'>Submit</button></div></div></form></div></div>";
                table += "</tbody></table>";
            } else{
                table = "<h4 class='text-danger'>Es wurden keine Daten f&uuml;r die Tabelle: '"+tab+"' gefunden!</h4>";
            }
        } else{
            table = "<h4 class='text-danger'>Es wurden keine Daten f&uuml;r die Tabelle: '"+tab+"' gefunden!</h4>";
        }
        $('.resp-container').append(table);
        $('.popup-insert').empty();
        $('.popup-insert').append(form);
        $('.popup-insert form').addClass('insert-form');
        $('.popup-update').empty();
        $('.popup-update').append(form);
        $('.popup-update form').addClass('update-form');
        var i = 0;
        var selector = $('.update-form input');
        while(i<selector.length){
            selector[i].id = selector[i].id+".2";
            i++;
        }
        $('.popup-update form h4').html(alt_text);
        $('.load-dialog').hide();
        $('.toolbar').addClass('show');
        $('.resp-container table').DataTable({ paging: true });
        bindEventAll(tab);
    }).fail(function(r){
        console.log(r);
        alert(r.responseText);
        window.location = '/';
    });
};
