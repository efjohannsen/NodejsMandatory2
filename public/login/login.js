//LOGIN FORM ON SUBMIT
$("form").on("submit", function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    console.log(formValues);
    const url = "/login"
    
    $.ajax({
        url: url,
        type:'POST',
        data: formValues,
        success : function(data, status, xhr){    
            $('#showErrorHere').html("");        
            $('#content').html("Velkommen " + window.getCookie('username'));
            $('#content').append("<br>" + data);
        },
        error : function(data){
            $('#showErrorHere').html(data.responseText);
        }
    });
});

window.getCookie = function(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if(match) return match[2];
}