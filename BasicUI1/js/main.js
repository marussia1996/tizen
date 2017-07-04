window.onload = function() {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    // Sample code
   // var mainPage = document.querySelector('#main');

   // mainPage.addEventListener("click", function() {
    //    var contentText = document.querySelector('#content-text');

    //    contentText.innerHTML = (contentText.innerHTML === "Basic") ? "Tizen" : "Basic";
  //  });
    
   
    
    document.querySelector('#show').addEventListener("click", function(){
    	var contentText = document.querySelector('.ima');
    	contentText.style.display = "block";
    });
    document.querySelector('#hide').addEventListener("click", function(){
    	var contentText = document.querySelector('.ima');
    	contentText.style.display = "none";
    });
    document.querySelector('#rasm').addEventListener("click", function(){
        var contentText = document.querySelector('#content-text');
        contentText.innerHTML = 'Разрешение экрана: <b>'+screen.width+'X'+ screen.height+'</b>';
        contentText.style.display = (contentText.style.display === "block") ? "none" : "block";
        });
};