
$('#login a').click(function (e) {
    const url = '/login';
    e.preventDefault();
    $.get(url, function(data) {
        $('#content').html(data);
    });
});


$('#register a').click(function (e) {
    const url = '/register';
    e.preventDefault();
    $.get(url, function(data) {
        $('#content').html(data);
    })
})

$('#logout a').click(function (e) {
    const url = '/logout';
    e.preventDefault();
    alert("logged out");
    //refresh token skal slettes på serveren
    //fjern cookies lokalt.
})

$('#pageOne a').click(function (e){
    const url = '/pageOne';
    e.preventDefault(); 
    getAuthPage(url); 
});

$('#contactForm a').click(function (e){
    e.preventDefault();
    const url = '/contactForm';
    $.get(url, function(data) {
        $('#content').html(data);
    });
});


function getAuthPage(url) {
    $.ajax({
        url: url,
        type:'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + getCookie("accessToken"));
        },
        success : function(data){
            $('#content').html(data);
        },
        error : function(){
                //try to update accesstoken with refresh token
                updateAccessToken();            
        }
    });
}

getCookie = function(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if(match) return match[2];
}

updateAccessToken = function() {
    const url = '/token';
    const refreshToken = getCookie("refreshToken");
    const userId = getCookie("userId");
    const data = {
        "token": refreshToken,
        "userId": userId
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        ContentType: "application/json",
        success : function(data){
            $('#content').html(data);
        },
        error : function(data){
            $('#content').html(data.responseText);
        }
    });
}
