$("form").on("submit", function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    const url = "/register"
    $.ajax({
        url: url,
        type:'POST',
        data: formValues,
        success : function(data){    
            $('#content').html(data);
        },
        error : function(data){
            $('#showErrorHere').html(data.responseText);
        }
    });
});