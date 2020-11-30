$('#login a').click(function (e) {
    const url = '/login';
    e.preventDefault();
    $.get(url, function(data) {
        $('#content').html(data);
    })
})

$('#register a').click(function (e) {
    const url = '/register';
    e.preventDefault();
    $.get(url, function(data) {
        $('#content').html(data);
    })
})

$('#pageOne a').click(function (e){
    const url = '/pageOne';
    //prevents browsers default task and does not override your code.
    e.preventDefault(); 
    $.ajax({
        url: url,
        type:'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + window.getCookie("accessToken"));
        },
        success : function(data){
            $('#content').html(data);
        },
        error : function(data){
            updateAccessToken();
        }
    });
});

$('#sendEmail a').click(function (e){
    const url = '/sendEmail';
    //prevents browsers default task and does not override your code.
    e.preventDefault(); 
    $.ajax({
        url: url,
        type:'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + getCookie("accessToken"));
        },
        success : function(data){
            $('#content').html(data);
        },
        error : function(data){
                //try to update accesstoken with refresh token
                if(data.statusText === 'Unauthorized') {
                    updateAccessToken();
                }
        }
    });
});

updateAccessToken = function() {
    const url = '/token';
    const refreshToken = getCookie("refreshToken");
    const data = {
        "token": refreshToken
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
            $('#content').html("refreshToken is not known / please register/login");
        }
        
    })
}
getCookie = function(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if(match) return match[2];
}
