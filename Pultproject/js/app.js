/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
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

/*global pageController*/

(function() {
    var pageList = ["pageMain", "pageSecond", "pageThird"];

    /**
     * Handles the hardware key event.
     * @private
     * @param {Object} event - The hardware key event object
     */
    function keyEventHandler(event) {
        if (event.keyName === "back") {
            if (pageController.isPageMain() || pageController.moveBackPage() === false) {
                // Exit the application if the page is main page, or history list is empty
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            }
        }
    }

    /**
     * Sets the default style of elements.
     * @private
     */
    function setDefaultViews() {
        var defaultErrorMessage = document.querySelector("#errorMessage");

        if (pageController.movePage(pageList[0])) {
            // If the main page is displayed successfully, hide the default error message
            defaultErrorMessage.style.display = "none";
        }
    }

    /**
     * Sets the default value to the variables and application environment.
     * @private
     */
    function setDefaultVariables() {
        var i;

        // Add all pages in pageList to pageController
        for (i = 0; i < pageList.length; i++) {
            pageController.addPage(pageList[i]);
        }

        return true;
    }

    /**
     * Sets the default position and style of elements.
     * @private
     */
    function setDefaultEvents() {
        var wrapBtn,
            btnForward,
            btnBackward,
            pageDiv,
            i;

        // Add hardware key event listener
        document.addEventListener("tizenhwkey", keyEventHandler);

        for (i = 0; i < pageList.length; i++) {
            // Create forward and backward navigation button for the detail area of each page
            pageDiv = document.querySelector("#" + pageList[i]).querySelector(".headerText");
            wrapBtn = document.createElement("div");
            btnForward = document.createElement("div");
            btnBackward = document.createElement("div");

            // Set the class for the wrapper of buttons and each button,
            // And add the "Next >>"/"<< Prev" text to each forward/backward button
            wrapBtn.className = "wrapNaviBtn";
            btnForward.appendChild(document.createTextNode("Начать играть "));
            btnForward.className = "naviBtn";
            if (i + 1 < pageList.length) {
                btnForward.addEventListener("click", pageController.moveNextPage);
            }
            btnBackward.appendChild(document.createTextNode("<< Prev"));
            btnBackward.className = "naviBtn";
            if (i > 0) {
                btnBackward.addEventListener("click", pageController.movePrevPage);
            }

            // Append the buttons to the wrapper, and append the wrapper to the detail area
            wrapBtn.appendChild(btnBackward);
            wrapBtn.appendChild(btnForward);
            pageDiv.appendChild(wrapBtn);
        }

        return true;
    }

    /**
     * Initializes the application.
     * @private
     */
    function init() {
        if (setDefaultVariables() && setDefaultEvents()) {
            setDefaultViews();
        }
    }

    window.onload = init;
}());