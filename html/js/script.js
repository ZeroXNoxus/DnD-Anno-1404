$(document).ready(function(){
    $(".label").on("click", function(){
        var id = this.id;
        $.ajax({
            url: "file:///C:/Users/User/Documents/GitHub/DnD-Anno-1404/html/test.html",
            context: document.body,
            complete: function(e){
                console.log(e);
            }
        }).done(function(e) {
            $( this ).addClass( "done" );
        });
    })
});

/* $.ajax({
    url: "test.html",
    method: "POST",
    context: document.body,
    success: function(e){
        console.log(e);
    },
    complete: function(e){
        console.log(e);
    }
  }).done(function() { $( this ).addClass( "done" );
  }).fail(function() { }); */