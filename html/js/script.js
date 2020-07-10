$(document).ready(function(){
    $(".label").on("click", function(){
        var id = this.id;
        $.ajax({
            url: "test.php?table="+id+"",
            context: document.body,
            complete: function(e){
                var response = e.responseText; //estimated response = 'Hallo'
            }
        }).done(function(e) {
            $( this ).addClass( "done" );
        });
    });
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