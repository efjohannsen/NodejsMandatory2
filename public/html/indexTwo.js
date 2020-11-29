//LOGIN FORM
$("form").on("submit", function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    const url = "http://localhost:8080/login"
    $.ajax({
        url: url,
        type:'POST',
        data: formValues,
        success : function(data){    
            $('form').html(data);
        },
        error : function(data){
            $('#showErrorHere').append('<br>' + data.statusText);
        }
    });
});




/*


window.getCookie = function(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if(match) return match[2];
}
*/