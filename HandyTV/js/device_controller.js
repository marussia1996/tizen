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

/*global ui_controller, device_discover_manager, msf, app_store*/
/*jslint unparam: true */

(function() {
    "use strict";
    var 
    	device_id = null,
    	device = null,
    	tv = null,
    	app = null,
        channel_name = "com.samsung.multiscreen.MultiScreenSimple",
        remote_application_name = "demoapp013.MultiScreen",
       // remote_application_name = "Lwikkq9zPT.HTML5Player",
        own_name = "Handy TV Controller";

       
	// loader
	function device_controller() {
	    return {
	    	set_device : set_device,
	    	verify_device : verify_device,
	    	publish : publish,
	    	volume_up : volume_up,
	    	volume_down : volume_down,
	    	channel_up : channel_up,
	    	channel_down : channel_down,
	    	playpause : playpause,
	    	set_working_device:set_working_device,
	    	no_working_device:no_working_device,
	    	reconnect : reconnect
	    };
	    
	}
	
	function set_working_device(ip, port, description){
		var id = device_discover_manager.add_device(ip, port, description);
		set_device(id);
		ui_controller.set_device_indirect();
	}
	
	function  no_working_device(){
		
	}
	
	// implementation
	function set_device(id)
	{
		console.log("[device_controller::set_device] - device " + id + " was set as current");
		device_id = id;
		device = device_discover_manager.get_device_info(id);
		
		if (device){
	        msf.remote('http://' + device.ip + ':' + device.port +'/api/v2/', function (error, tv) {
			        if (error) {
			            console.log("Error occurred while connecting: " + error.message);
			            device = null;
			            device_id = null;
			            tv = null;
			        } else {
			        	console.log(tv);
			            init(tv);
			        }
		        }
	        );
		}
	}
	

	function channelOnMessage(msg, client)
	{
		var splitted_query = msg.split(' '), cmd = splitted_query[0];
		
		if (cmd === "volume"){
			ui_controller.set_visible_volume(parseInt(splitted_query[1]));
		} else if (cmd === "state") {
			switch (splitted_query[1]) {
			case 'paused': case 'stopped':
				ui_controller.set_button_playpause(0);
				break;
			case 'playing':
				ui_controller.set_button_playpause(1);
				break;
			default:;
			}
			
		}
		console.log("Message from " + client.attributes.name + (client.isHost ? " (the host)" : "") +": " + msg);
	}
	
	function channelOnConnect()
	{
		console.log("Connnected !");
		app_store.save_new_record(1, {device_ip:device.ip, device_port:device.port, device_description:"TV" });
	}
	
	function onConnectCallback (err, client) {
		if (err && err.code == "404") {
        	console.log("Error connecting to application.");
        	app = null;
        	//setTimeout(channelOnDisconnect, 1000);
        } else if (err) {
        	console.log("An error occurred: " + err.message);
        	//setTimeout(channelOnDisconnect, 1000);
        } else {
        	console.log("Client connected.");
        }
	}

	function channelOnDisconnect()
	{
		console.log("Disconnnected !");
        app.connect({name:own_name}, function(err, client){
        	onConnectCallback(err, client);
        });		
	}

	
    function init(remote_device) {
        console.log("Connected to device: " + device.description);
        tv = remote_device;
        app = remote_device.application(remote_application_name, channel_name);
        app.on("say", channelOnMessage);           // this call could be chained with subsequent calls
        app.on("connect", channelOnConnect);       // but the API is not properly implemented at the moment,
        app.on("disconnect", channelOnDisconnect); // because .on returns undefined instead of EventEmitter instance.
        reconnect();
    }
    
    function reconnect(callwhenready) {
    	if (app && !app.isConnected) {
	    	console.log("Connecting to application...");
	        app.connect({name:own_name}, function(err, client){
	            if (err && err.code == "404") {
	            	console.log("Error connecting to application.");
	            	app = null;
	            	callwhenready(false);
	            } else if (err) {
	            	console.log("An error occurred: " + err.message);
	            	callwhenready(false);
	            } else {
	            	console.log("Client connected.");
	            	if (callwhenready) {
	            		callwhenready(true);
	            	}
	            }
	        });
    	}
    }
	
	function verify_device(ip)
	{
		console.log("[device_controller::verify_device] - testing sevice with ip=" + ip);
		return true;
	}
	
	function publish(event, message) {
		if (app){
			if (!app.isConnected) {
				reconnect(function(connected){
					if (connected) {
						app.publish(event, message);
					}
				});
			} else {
				app.publish(event, message);
			}
		}
	}
	
	function volume_up(power)
	{
		console.log("[device_controller::volume_up] - at " + power);
        publish("say", "volume_up 1");
	}

	function volume_down(power)
	{
		console.log("[device_controller::volume_down] - at " + power);
		publish("say", "volume_down 1");
	}
	
	function channel_up(power)
	{
		console.log("[device_controller::channel_up] - at " + power);
        publish("say", "channel_up 1");
	}

	function channel_down(power)
	{
		console.log("[device_controller::channel_down] - at " + power);
        publish("say", "channel_down 1");		
	}
	
	function playpause(play)
	{
		console.log("[device_controller::playpause]");
		if (play)
			publish("say", "video_play 1");
		else
			publish("say", "video_pause 1");		
	}	


	window.device_controller = device_controller();
}());




