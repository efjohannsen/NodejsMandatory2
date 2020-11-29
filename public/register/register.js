$("form").on("submit", function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    const url = "/register"
    $.ajax({
        url: url,
        type:'POST',
        data: formValues,
        success : function(data){    
            $('body').html(data);
        },
        error : function(data){
            $('#showErrorHere').append('<br>' + data.statusText);
        }
    });
});