//LOGIN FORM
$("form").on("submit", function(event) {
    event.preventDefault();
    const formValues = $(this).serialize();
    const url = "/login"
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

//Page 1 - Authorization bearer
$('#page1 a').click(function (e){
    var url = '/page1';
    //prevents browsers default task and does not override your code.
    e.preventDefault(); 
    $.ajax({
        url: url,
        type:'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + window.getCookie("accessToken"));
        },
        success : function(data){
            $('#showErrorHere').html("");    
            $('body').html(data);
        },
        error : function(data){
            $('#showErrorHere').html(data.statusText);
        }
    });
});

$('#sendEmail a').click(function (e){
    var url = '/sendEmail';
    //prevents browsers default task and does not override your code.
    e.preventDefault(); 
    $.ajax({
        url: url,
        type:'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + window.getCookie("accessToken"));
        },
        success : function(data){
            $('#showErrorHere').html("");    
            $('body').html(data);
        },
        error : function(data){
            $('#showErrorHere').html(data.statusText);
        }
    });
});

window.getCookie = function(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if(match) return match[2];
}
