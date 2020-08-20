var x = document.cookie.split("=")[1];
if(x.length){
    $('body').addClass('dark');
    $('.onoffswitch-checkbox').click();
}
$(document).ready(function(){
    document.addEventListener('keydown', checkKey);
    x = document.cookie.split("=")[1];
    if(x.length){
        $('body').addClass('dark');
        $('.onoffswitch-checkbox').click();
    }
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
        var where = this.dataset.where;

        getTable(tab, where);
    });
    getTable("user", $('#user').data('where'));
    $('.label#user').addClass('active');
});

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
    $('.onoffswitch-checkbox').off('click');
    $('.onoffswitch-checkbox').on('click', function(e){
        if(this.checked){
            $('body').removeClass('dark');
            document.cookie = "darkmode=";
        } else{
            $('body').addClass('dark');
            document.cookie = "darkmode=dark";
        }
    });
    $('form#new_password_form').off('submit');
    $('form#new_password_form').on('submit', function(e){
        e.stopPropagation();
        e.preventDefault();
        var elem = $('input[type=password]');
        if(elem[0].value !== elem[1].value){ 
            $('.repass_ne_pass').removeClass('hidden');
            return;
         }
        var $this = $(this);
        var i = 0;
        var param = '';
        var seperator = '';
        var input = $this.find('input');
        while(i<input.length){
            param += seperator;
            param += $(input[i]).data('name')+"="+$(input[i]).val();
            seperator = '&';
            i++;
        }
        $('.load-dialog').show();
        $.ajax({
            url: "php/set_password.php?table=user",
            data: param,
            method: "POST"
        }).done(function(r){
            document.cookie = "qType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            var lang = $('.hidden span.language').text();
            if(lang == "en"){
                msg = "<div class='row'><div class='col-12 alert alert-success' role='alert'>Your new password was set successfully!</div></div>";
            } else if(lang == "de"){
                msg = "<div class='row'><div class='col-12 alert alert-success' role='alert'>Ihr neues Passwort wurde erfolgreich gespeichert!</div></div>";
            }
            getTable(tab, $('#user').data('where'), msg);
            $('.load-dialog').hide();
            $('.popup').hide();
        }).fail(function(r){
            var lang = $('.hidden span.language').text();
            if(lang == "en"){
                msg = "<div class='row'><div class='col-12 alert alert-danger' role='alert'>There was an error trying to set your new password. Please try again!</div></div>";
            } else if(lang == "de"){
                msg = "<div class='row'><div class='col-12 alert alert-danger' role='alert'>Beim setzen Ihres neuen Passwort ist ein Fehler aufgetreten. Bitte Versuchen Sie es erneut!</div></div>";
            }
            getTable(tab, $('#user').data('where'), msg);
            $('.load-dialog').hide();
            $('.popup').hide();
        });
    });
    $('.mass-edit-btn').off('click');
    $('.mass-edit-btn').on('click', function(){
        if($(this).hasClass('btn-primary')){
            $(this).removeClass('btn-primary');
            $(this).addClass('btn-success');
            $('.resp-container table div.tab-val').addClass('hidden');
            $('.resp-container table input.tab-val').removeClass('hidden');
        } else if($(this).hasClass('btn-success')){
            $(this).removeClass('btn-success');
            $(this).addClass('btn-primary');
            $('.resp-container table div.tab-val').removeClass('hidden');
            $('.resp-container table input.tab-val').addClass('hidden');

        }
        
    });
    $('.resp-container input:not(.is_pri)').off('change');
    $('.resp-container input:not(.is_pri)').on('change', function(e){
        if($(this).parents('form').length > 0){ return; }
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

        $(this).siblings(":not(label)").text(new_val);
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
    var x = document.cookie.split("=")[1];
    if(x.length){
        $('body').addClass('dark');
        $('.onoffswitch-checkbox').click();
    }
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

function getTable(tab, where = "", msg = ""){
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
        handle_response(r, tab, msg);
    }).fail(function(r){
        console.log(r);
        alert(r.responseText);
        window.location = '/';
    });
};
