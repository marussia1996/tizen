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

/*global $, tau, StateMachine, device_controller, device_discover_manager*/
/*jslint unparam: true */

(function() {
    "use strict";

    
    // states:
   
    /*
     * intro_state
     * searching_state
     * no_device_state
     * select_device_state
     * workflow_state
     * tune_volume_state
     * select_channel_state
     * fin_state
     */
    
    var fsm = StateMachine.create({
  	  initial: 'intro_state',
  	  events: [
	  	    { name: 'event_init',  from: 'intro_state',  to: 'searching_state' },
	  	    { name: 'event_set_device_indirect', from: ['intro_state', 'searching_state', 'select_device_state'], to:'workflow_state' },
	  	    { name: 'event_discover_ok', from: 'searching_state', to: 'select_device_state'},
	  	    { name: 'event_discover_fail_but_device_exists',  from: 'searching_state',    to: 'workflow_state' },
	  	    { name: 'event_discover_fail_and_no_devices_exists',  from: 'searching_state',    to: 'no_device_state' },
	  	    { name: 'event_device_selected_by_user',  from: 'select_device_state',    to: 'workflow_state' },
	  	    { name: 'event_ui_volume_up',  from: 'workflow_state',    to: 'tune_volume_state' },
	  	    { name: 'event_ui_volume_down',  from: 'workflow_state',    to: 'tune_volume_state' },
	  	    { name: 'event_ui_channel_up',  from: 'workflow_state',    to: 'select_channel_state' },
	  	    { name: 'event_ui_channel_down',  from: 'workflow_state',    to: 'select_channel_state' },
	  	    { name: 'event_auto_back_to_workflow',  from: 'select_channel_state',    to: 'select_channel_state' },
	  	    { name: 'event_auto_back_to_workflow',  from: 'tune_volume_state',    to: 'select_channel_state' },
	  	    { name: 'event_auto_back_to_searching',  from: 'no_device_state',    to: 'searching_state' },
	  	    

	  	    //{ name: 'event_on_swipe',  from: 'list_state',    to: 'list_state' },
	  	    { name: 'event_on_back',  from: ['intro_state', 
	  	                                     'searching_state',
	  	                                     'select_device_state',
	  	                                     'workflow_state',
	  	                                     'tune_volume_state',
	  	                                     'select_channel_state'],    to: 'fin_state' },
  	    ],
  	  callbacks: {
  		  // Enters
  		onenterintro_state: function()
  		{
  	        console.log('ui_fsm::onenterintro_state');
  	        
 		},
  		onentersearching_state: function()
  		{
  	        console.log('ui_fsm::onentersearching_state'); 	     
            tau.changePage("#page-searching");  
            device_discover_manager.start_discover();
 		}, 		
  		onenterno_device_state: function()
  		{
  	        console.log('ui_fsm::onenterno_device_state');
            tau.changePage("#page-nodevice");
  			setTimeout(function(){
  				fsm.event_auto_back_to_searching();
  			}, 50);
            
 		}, 	  		
 		onenterselect_device_state: function()
  		{
  	        console.log('ui_fsm::onenterselect_device_state');
            tau.changePage("#page-selectdevice");  	        
 		}, 	  	
 		onenterworkflow_state: function()
  		{
  	        console.log('ui_fsm::onenterworkflow_state');
            tau.changePage("#page-workflow");  	        
 		}, 	
 		
 		onentertune_volume_state: function(event, from, to, mode)
  		{
  	        console.log('ui_fsm::onentertune_volume_state');
  	        
  	        if (mode === "up"){
  	        	device_controller.volume_up(1);
  	        } else if (mode === "down"){
  	        	device_controller.volume_down(1);  	        	
  	        }  	        
 		}, 	
 		
 		onenterselect_channel_state: function(event, from, to, mode)
  		{
  	        console.log('ui_fsm::onenterselect_channel_state');
  	        
  	        if (mode === "up"){
  	        	device_controller.channel_up(1);
  	        } else if (mode === "down"){
  	        	device_controller.channel_down(1);  	        	
  	        }  	  	        
 		}, 	
		onenterfin_state: function(){
  	        console.log('ui_fsm::onenterfin_state'); 	  
  			setTimeout(function(){
  	  	        console.log('exiting...'); 	  
  				safeExit();
  			}, 200);

		}
  	  }	            
    }),
    progressBarWidget,
    progressBar,
    volume_timer = null;    
    
    function set_visible_volume(value){
    	console.log(value);
    	progressBarWidget.value(value);
    }
    
    function set_button_playpause(paused){
    	console.log('Paused: ' + paused);
    	if (paused)
    		$('#select-video-play').addClass('pause');
    	else
    		$('#select-video-play').removeClass('pause');
    }
    
    function rotaryDetentHandler() 
    {
       /* Get the rotary direction */
       var direction = event.detail.direction;
           //value = parseInt(progressBarWidget.value());

       if (direction === "CW") 
       {
          /* Right direction */
    	   device_controller.volume_up(1);
    	   $('#volumeprogress').show(500);
    	   volume_timer = setTimeout(function(){
    		   volume_timer = null;
    		   $('#volumeprogress').hide("slow");
    	   },1000);
/*          if (value < 100) 
          {
             value++;
          } 
          else 
          {
             value = 100;
          }*/
       } 
       else if (direction === "CCW") 
       {
          /* Left direction */
    	   device_controller.volume_down(1); 
    	   $('#volumeprogress').show(500);
    	   volume_timer = setTimeout(function(){
    		   volume_timer = null;
    		   $('#volumeprogress').hide("slow");
    	   },1000);    	   
          /*if (value > 0) 
          {
             value--;
          } 
          else 
          {
             value = 0;
          }*/
       }

       //progressBarWidget.value(value);
       //printResult();
       
    }
       
	// loader
	function ui_controller() {
	    return {
	    	startApp : start_application,
	    	on_back : on_back,
	    	add_discovered_device : add_discovered_device,
	    	discover_finished : discover_finished,
	    	device_operation_finished : device_operation_finished,
	    	set_visible_volume : set_visible_volume,
	    	set_button_playpause : set_button_playpause,
	    	set_device_indirect : set_device_indirect
	    };
	}
	
	function set_device_indirect(){
		fsm.event_set_device_indirect();
	}
	
	function show_volume(){
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "full"});		
	}
	
	function pageBeforeShowHandler(){
        progressBar = document.getElementById("volumeprogress");
        document.addEventListener("rotarydetent", rotaryDetentHandler);
        show_volume();
        $("#volumeprogress").hide();		
	}
	
	// implementation
	function start_application(){
        if (document.getElementsByClassName('ui-page-active')[0] !== "#page-intro"){
            tau.changePage("#page-intro");
        }
        
        $('#select-channel-up').bind('click', select_channel_up);
        $('#select-channel-down').bind('click', select_channel_down);
        $('#select-volume-up').bind('click', select_volume_up);
        $('#select-volume-down').bind('click', select_volume_down);
        $('#select-video-play').bind('click', select_playpause);
        
        
        document.getElementById("page-workflow").addEventListener("pagebeforeshow", pageBeforeShowHandler);
        
		setTimeout(function(){
			fsm.event_init();
		}, 1000);		
	}
	
	function on_back()
	{
		fsm.event_on_back();
	}
	
	function discover_finished()
	{
		fsm.event_discover_ok();
	}
	
	function device_operation_finished()
	{
        setTimeout(function(){
			fsm.event_auto_back_to_workflow();
		}, 50);		
	}
	
	function add_discovered_device(id, description)
	{
		$('#device_list').append("<li id_attr='"+  id +"' class='ui-marquee " + "ddst" + id + "'>"+  description +"</li>");
	    $(/*"#device_list li " + */".ddst" + id).click(function() {
	        var inter_li = $(this),
	    		selected_device = inter_li.attr('id_attr');
	        	
	        console.log("selected device - " + selected_device);
	        device_controller.set_device(selected_device);
	        
	        fsm.event_device_selected_by_user();
	    });   		
	}
	
	function safeExit() {
	    try {
	        tizen.application.getCurrentApplication().exit();
	    } catch (ex) {
	        console.log("Cannot exit normally, exception got: " + ex.toString());
	    }
	}
	
	function select_volume_up(){
        console.log('ui_fsm::select_volume_up');
    	device_controller.volume_up(1);

        //fsm.event_ui_volume_up("up");
	}

	function select_volume_down(){
        console.log('ui_fsm::select_volume_down');
    	device_controller.volume_down(1);  	        	
        
        //fsm.event_ui_volume_down("down");
	}

	function select_channel_up(){
        console.log('ui_fsm::select_channel_up'); 	  
        //fsm.event_ui_channel_up("up");
    	device_controller.channel_up(1);
        
	}
	
	function select_channel_down(){
        console.log('ui_fsm::select_channel_down'); 	  
//        fsm.event_ui_channel_down("down");
    	device_controller.channel_down(1);  	        	
	}	
	
	function select_playpause(){
        console.log('ui_fsm::select_playpause'); 	  
    	device_controller.playpause( !$('#select-video-play').hasClass('pause'));  
    	
	}	

	window.ui_controller = ui_controller();
}());




