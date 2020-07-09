$(".label").on("click", function(){
    var id = this.id;
    $.ajax({
        url: "test.html",
        context: document.body,
        complete: function(){
    
        }
    }).done(function() {
        $( this ).addClass( "done" );
    });
})

$.ajax({
    url: "test.html",
    context: document.body,
    complete: function(){

    }
  }).done(function() {
    $( this ).addClass( "done" );
  });