( function () {
    window.addEventListener( 'tizenhwkey', function( ev ) {
        if( ev.keyName === "back" ) {
            var activePopup = document.querySelector( '.ui-popup-active' ),
                page = document.getElementsByClassName( 'ui-page-active' )[0],
                pageid = page ? page.id : "";

            if( pageid === "one" && !activePopup ) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
                window.history.back();
            }
        }
    } );
    $("#two .ui-content").css("color", "white");
    
    document.querySelector('#rasm').addEventListener("click", function(){
        var contentText = document.querySelector('#content-text');
        contentText.innerHTML = 'Разрешение экрана: <b>'+screen.width+'X'+ screen.height+'</b>';
        contentText.style.display = (contentText.style.display === "block") ? "none" : "block";
        });
        
        document.querySelector('#show').addEventListener("click", function(){
        	var contentText = document.querySelector('.ima');
        	contentText.style.display = "block";
        });
        document.querySelector('#hide').addEventListener("click", function(){
        	var contentText = document.querySelector('.ima');
        	contentText.style.display = "none";
        });
} () );