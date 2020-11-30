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

//
//$(document).ready(function(){
//    $('#navigation').load('../navigation/nav.html');
//});

//Page 1 - Authorization bearer
$('#pageOne a').click(function (e){
    var url = '/pageOne';
    //prevents browsers default task and does not override your code.
    e.preventDefault(); 
    $.ajax({
        url: url,
        type:'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + window.getCookie("accessToken"));
        },
        success : function(data){
            $('#content').html("");
            $('#content').html(data);
        },
        error : function(data){
            $('#content').html(data.statusText);
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
            $('#content').html("");
            $('#content').html(data);
        },
        error : function(data){
            $('#content').html(data.statusText);
        }
    });
});

window.getCookie = function(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if(match) return match[2];
}