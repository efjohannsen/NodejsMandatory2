$(document).ready(function(){
    $('#navigation').load('../navigation/nav.html');
});

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
            $('#showErrorHere').html("");
            $('#content').html("");
            $('#content').html(data);
        },
        error : function(data){
            $('#showErrorHere').html(data.statusText);
        }
    });
});

$('#sendEmail a').click(function (e){
    alert("Send email clicked");
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