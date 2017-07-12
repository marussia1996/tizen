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

/*global */
/*jslint unparam: true */


var app_store  = {
	// private data
    device_controller: null,

	// private members
    get_object_store_name: function() {
        return "handy_tv_controller";
    },
    	
   save_new_record: function(id, item) {
       if (item === null || id === null) {
           return;                        
       }

       var saver = function(store) {
            console.log('[app_store::save_new_route] saving ' + id);
            console.log(item);

            store.add({
            	id: id,
            	device_ip: item.device_ip,
                device_port: item.device_port,
    			device_description : item.device_description
            });
        };
        this.db_action(saver);
    },
    save_existing_route: function(id, item) {
        if (item === null || id === null) {
            return;                        
        }
        
        var saver = function(store) {
            console.log('[app_store::save_existing_route] saving ' + id);
            console.log(item);

            store.put({
            	id: id,
            	device_ip: item.device_ip,
                device_port: item.device_port,
    			device_description : item.device_description             
            });
            
        };
        this.db_action(saver);
    },
    db_action: function(action) {
        console.log('[app_store::db_action] laoding ');
    	
        var request = indexedDB.open("handy_tv_store", 1),
            store_name = this.get_object_store_name();

        request.onupgradeneeded = function() {
            var db = request.result,
                store = db.createObjectStore(store_name, {
                    keyPath: 'id'
                });

            store.createIndex("id", "id", {
                unique: true
            });
            //action(store);
        };

        request.onsuccess = function() {
            var db = request.result,
            	transaction = db.transaction([store_name], "readwrite");
            
            action(transaction.objectStore(store_name));
        };
    },
    load: function(devcontroller){
        console.log('load: function(userMgt)');
    	app_store.device_controller = devcontroller;
    	app_store.db_action(app_store.load_impl);
    },
    load_impl: function(store) {
        var request = store.openCursor();
        console.log('loading');
        request.onsuccess = function(event) {
            console.log('success');
            var cursor = event.target.result;
            if (cursor) {
            	app_store.device_controller.set_working_device(cursor.value.device_ip, 
            			cursor.value.device_port,
            			cursor.value.device_description);
            } else {
            	app_store.device_controller.no_working_device();
            }
        };
    }
    
};
