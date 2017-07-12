/*
 * Copyright (c) 2016 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global tau, ui_controller, device_discover_manager, device_controller, app_store */
/*jslint unparam: true */

(function() {
	
    window.addEventListener('tizenhwkey', function(ev) {
        if (ev.keyName === "back") {
            var page = document.getElementsByClassName('ui-page-active')[0],
                pageid = page ? page.id : "";
            
            ui_controller.on_back();
         }
    });


    /**
    * Initiate function for binding event listener
    * If you execute 'alarm' application, this function will be called at first.
     */
    window.onload = function load(){
   	
    	ui_controller.startApp();
    	app_store.load(device_controller);
    	device_discover_manager.set_discover_callback(
    			function(id, description){ 
    		    	console.log("found device " + description);
    		    	ui_controller.add_discovered_device(id, description);    		    	
    	});
    	device_discover_manager.set_discover_completed_callback(function(){
    		ui_controller.discover_finished();
    	});

    	function onScreenStateChanged(previousState, changedState) {
    		console.log("Screen state changed from " + previousState + " to " + changedState);
    		if (changedState === 'SCREEN_NORMAL') {
    			device_controller.reconnect();
    		}
 		 }
		tizen.power.setScreenStateChangeListener(onScreenStateChanged);
		
    	console.log("Load finished ");
    };
    
}());
