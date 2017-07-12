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

/*global tau */
/*jslint unparam: true */
(function(tau) {
    var page,
        elScroller;
    // Check circle shape in TAU
    // If display type is circle bind event listener for 'pagebeforeshow' and 'pagebeforehide'
    if (tau.support.shape.circle) {
        /**
        * Pagebeforeshow event listener in circle UI
        * When event 'pagebeforeshow' is executed, 'ui-scroller' set 'tizen-circular-scrollbar' attribute
         */
        document.addEventListener("pagebeforeshow", function (event) {
            page = event.target;
            elScroller = page.querySelector(".ui-scroller");
              /**
             * If elScroller existed, set 'tizen-circular-scrollbar' attribute
               */
            if (elScroller) {
                elScroller.setAttribute("tizen-circular-scrollbar", "");
            }
        });
        /**
        * Pagebeforehide event listener in circle UI
        * When event 'pagebeforehide' is executed, 'ui-scroller' remove 'tizen-circular-scrollbar' attribute
         */
        document.addEventListener("pagebeforehide", function (event) {
            if(elScroller) {
                elScroller.removeAttribute("tizen-circular-scrollbar");
            }
        });
    }
}(tau));