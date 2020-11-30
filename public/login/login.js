//LOGIN FORM ON SUBMIT
$("form").on("submit", function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    const url = "/login"
    $.ajax({
        url: url,
        type:'POST',
        data: formValues,
        success : function(data){    
            $('#content').html(data);
        },
        error : function(data){
            $('#showErrorHere').append('<br>' + data.statusText);
        }
    });
});
