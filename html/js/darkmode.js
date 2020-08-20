
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