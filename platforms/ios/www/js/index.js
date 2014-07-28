/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
	successHandler: function(result) {
	},
	errorHandler:function(error) {
		alert(error);
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
		var pushNotification = window.plugins.pushNotification;
		if('Android' == device.platform) {
			pushNotification.register( function() { }, function() { }, 
				{
					"ecb"      : "app.onNotificationGCM",
					"senderID" : "666636108606"
				}
			);
		} else {// iOS.
			pushNotification.register(
				app.tokenHandler, 
				function(error) {
					// Failed to register device.
				}, 
				{
					alert : 'true',
					badge : 'true',
					sound : 'true',
					ecb   : 'app.onNotificationAPN'
				}
			);
		}
    },
	onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
					$.ajax({
						url: "http://172.16.0.123/gcm_server_php/register.php",
						type: 'POST',
						data: 'name=PhoneGapAndroid' + '&email=buituanphong24@gmail.com' + "&regId=" + e.regid,
						success: function(data, textStatus, xhr) {
							alert('registration id = ' + e.regid);
						},
						error: function(xhr, textStatus, errorThrown) {
							
						}
					});
                    console.log("Regid " + e.regid);
                }
            break;
 
            case 'message':{
				alert('message = '+e.message);
			}
            break;
 
            case 'error':
				alert('GCM error = '+e.msg);
            break;
 
            default:
				alert('An unknown GCM event has occurred');
            break;
        }
    },
	onNotificationAPN: function(e) {
        if(e.alert) {
			navigator.notification.alert(e.alert);
		}
		if(e.sound) {
			var snd = new Media(e.sound);
			snd.play();
		}
		if(e.badge) {
			window.plugins.pushNotification.setApplicationIconBadgeNumber(function() {
				// Success.
			}, function() {
				// Failure.
			}, 100);
		}
    },
	tokenHandler: function(result) {  
		$.ajax({
			url: "http://172.16.0.123/gcm_server_php/register.php",
			type: 'POST',
			data: {
				name :'PhoneGapiOS' ,
				email :'buituanphong24@gmail.com',
				regId:result
			},
			success: function(data, textStatus, xhr) {
				navigator.notification.alert(result, null, 'Alert', 'OK');
			},
			error: function(xhr, textStatus, errorThrown) {
				
			}
		});
    }
};
