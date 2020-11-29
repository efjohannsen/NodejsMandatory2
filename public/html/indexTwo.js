$('#myBtn a').click(function (e){
    alert("hello")
    //prevents browsers default task and does not override your code.
    e.preventDefault(); 
});

/*

$('#submitLogin').submit(function ( e ) {
    e.preventDefault();
    console.log("GOT HERE");
});


window.getCookie = function(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if(match) return match[2];
}
*/