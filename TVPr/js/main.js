
//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log('init() called');
    
  tizen.systeminfo.getPropertyValue("BUILD",
			function(e){
		$("#modeltv").text(e.model);
		$("#version").text(e.buildVersion);
	});
	
	tizen.systeminfo.getPropertyValue("ETHERNET_NETWORK",
			function(e){
		$("#ip").text(e.ipAddress);
	});
	
	tizen.tvaudiocontrol.setVolumeChangeListener(function(a){
		$("#volume").text(a);
	});
	
	
	fileEnumerator.init(function() {
    	changeSource(0);
    });
    fileEnumerator.listFiles();
    
    
    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		$("#button").text('LEFT arrow');
    		break;
    	case 38: //UP arrow
    		$("#button").text('UP arrow');
    		break;
    	case 39: //RIGHT arrow
    		$("#button").text('RIGHT arrow');
    		break;
    	case 40: //DOWN arrow
    		$("#button").text('DOWN arrow');
    		break;
    	case 13: //OK button
    		$("#button").text('OK');
    		break;
    	case 10009: //RETURN button
		tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
};
// window.onload can work without <body onload="">
window.onload = init;



var fileEnumerator = {
		
    	onFilesListed : null,
    	
		_onListFilesError : function (error) {
            console.log("Error " + error.message + " occurred when listing the files in the selected folder");
        },
        

        _onListFilesSuccess : function (files) {
        	var names = [];
        	var paths = [];
            for (var i = 0; i < files.length; i++) {
            	names[names.length] = files[i].name;
            	paths[paths.length] = files[i].fullPath;
            	
            }
            for (var i = 0; i < names.length; i++) {
            	if (names[i].match(/.*\.(mp4|avi|mkv)$/i)) {
            		console.log('List: ' + names[i]);
            		var index = sources.length;
            		             
                    sources[index] = paths[i];
                    $("#2").attr("src",sources[index]);
                    
                    console.log('Video added: ' + names[i]);
                } else 
           
                    console.log('Image added: ' + names[i]);
            		$("#image").attr("src",files[i].fullPath);
            }
                
        },

        _listStoragesCallback : function (storages) {
        	sources = [];
        	posters = [];
            for (var i = 0; i < storages.length; i++) {
            	console.log('Storage found: ' + storages[i].label);
                if (storages[i].type != "EXTERNAL")
                    continue;

                console.log("Drive:" + storages[i].label);

                tizen.filesystem.resolve(
                    storages[i].label,
                    function(dir) {
                        dir.listFiles(fileEnumerator._onListFilesSuccess, fileEnumerator._onListFilesError);
                    },
                    function(e) {
                        console.log("Error:" + e.message);
                    }, "r"
                );
            }
        },
                
    	_onStorageStateChanged : function (storage) {
            if (storage.state === "MOUNTED") {
                console.log("Storage " + storage.label + " was added!");
                fileEnumerator.listFiles();
                
            }
        },
        init : function(cb) {
        	watchID = tizen.filesystem.addStorageStateChangeListener(this._onStorageStateChanged);
        	this.onFilesListed = cb;
        },
        
        listFiles : function() {
        	tizen.filesystem.listStorages(this._listStoragesCallback);
        }

        
    };
