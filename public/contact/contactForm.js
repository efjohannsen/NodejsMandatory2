//Contact FORM ON SUBMIT
$("form").on("submit", function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    const url = "/contactForm"
    
    $.ajax({
        url: url,
        type:'POST',
        data: formValues,
        success : function(data, status, xhr){    
            $('#showErrorHere').html("");        
            $('#content').html(data.responseText);
        },
        error : function(data){
            $('#showErrorHere').html(data.responseText);
        }
    });
});
