const apiServer = "http://192.168.1.206:3000"
//const apiServer = "http://localhost"

/*
On startup, connect to the "ping_pong" app.
*/
//var port = browser.runtime.connectNative("fibocic");

/*
Listen for messages from the app.
*/
/*port.onMessage.addListener((response) => {
    ////console.log("Received: " + response);
    const action = response.action
    const payload = response.payload
    switch (action) {
        case 'GET_CIC': {
            const job = payload
            ////console.log(job)
            /*const currentCicTab = localStorage.getItem('currentCicTab')
            const onError = function(error){
                ////console.log(error)
            }
            browser.tabs.sendMessage(
                parseInt(currentCicTab),
                { greeting: "Hi from background script" }
            ).then(response => {
                ////console.log("Message from the content script:");
                ////console.log(response.response);
            }).catch(onError);
        } break
    }
});*/

/*
On a click on the browser action, send the app a message.
*/
/*browser.browserAction.onClicked.addListener(() => {
  ////console.log("Sending:  ping");
  port.postMessage(JSON.stringify({abc:"hà nguyên bình", result: 1}));
});*/


//content to background message control
let currentJob = {}
let canTracking = true

function onError(error) {
	////console.log(error.message);
	
}

function checkAlive() {
	////console.log('tracking interval')
	const currentCicTab = localStorage.getItem('currentCicTab') ? localStorage.getItem('currentCicTab'):0
	const currentCmndTab = localStorage.getItem('currentCmndTab') ? localStorage.getItem('currentCmndTab'):0
	
	let cicResponse = 0
	let cmndResponse = 0
	let cicTimeout = setTimeout(function () {
		////console.log(cicResponse, cmndResponse)
		checkAlive()		
	}, 10000)
	
	currentCicTab && browser.tabs.sendMessage(
		parseInt(currentCicTab),
		{ greeting: "Hi from background script" }
	).then(response => {
		cicResponse = 1
		////console.log("Message from the content script:");
		////console.log(response.response);
	}).catch(onError);
	currentCmndTab && browser.tabs.sendMessage(
		parseInt(currentCmndTab),
		{ greeting: "Hi from background script" }
	).then(response => {
		cmndResponse = 1
		////console.log("Message from the content script:");
		////console.log(response.response);
	}).catch(onError);

}
//checkAlive()

/*function logURL(requestDetails) {
  ////console.log("Loading: " + requestDetails.url);
}

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["<all_urls>"]}
);*/
var targetPage = "*://*.cic.org.vn/*";
let getCicTimeout = 0

// Log cookies sent with this request
function logCookies(e) {
  for (var header of e.requestHeaders) {
    if (header.name == "Cookie") {
      ////console.log(header.value);
    }
  }
}

// Listen for onSendHeaders, and pass
// "requestHeaders" so we get the headers
browser.webRequest.onSendHeaders.addListener(
  logCookies,
  {urls: [targetPage]},
  ["requestHeaders"]
);


let processingTimeout = 0
var data, 
	action, 
	payload, 
	processId,
	taskId,
	getResultInterval,
	proxySettings,
	currentCicTab,
	currentCmndTab,
	job,
	reloadProcessStatus,
	creating

const apikey = "01ca1cb3acd6dcf48403d35589b04b35"
function handleMessage(request, sender, sendResponse) {

    //////console.log(request)
    //sendResponse({response: "response from background script"});
	data = request.data
	action = data.action
	payload = data.payload    

    switch (action) {
        case "SET_CIC_TAB": {
            localStorage.setItem('currentCicTab', sender.tab.id)
            ////console.log(sender)
            sendResponse({ currentCicTab: sender.tab.id })

        } break;
        case "SET_CMND_TAB": {
            localStorage.setItem('currentCmndTab', sender.tab.id)
            ////console.log(sender)
            sendResponse({ currentCmndTab: sender.tab.id })

        } break;

        case "START_STEP_0": {
            //const currentStep = payload.currentStep + 1
            sendResponse({})

        } break;
        case "FINISH_STEP_0": {
            //const currentStep = payload.currentStep + 1
            sendResponse({})

        } break;
        case "SAVE_TO_DATABASE":
            {
                //port.postMessage(JSON.stringify({abc:"hà nguyên bình", result: 1}));
                fetch(apiServer + "/api/insert", {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(payload.dbData), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: "cors"
                })
                    .then(async (response) => {
                        ////console.log("response")
                        return response.json()

                    })
                    .then(result => {
                        ////console.log(result)
                        sendResponse(result)

                    })
                    .catch(function (error) {
                        ////console.log(error);
                        //sendResponse({status:0})
                    });
            }
            break;
        case "UPDATE_CIC":
            {
                //port.postMessage(JSON.stringify({abc:"hà nguyên bình", result: 1}));
                const processId = localStorage.getItem('processId')
                fetch(apiServer + "/api/update", {

                    method: 'POST', // or 'PUT'
                    body: JSON.stringify({ dbData: payload.dbData, processId: processId }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: "cors"
                })
                    .then((response) => {
                        ////console.log("response")
                        return response.json()

                    })
                    .then(result => {
                        ////console.log(result)
                        sendResponse(result)

                    })
                    .catch(function (error) {
                        ////console.log(error);
                        //sendResponse({status:0})
                    });
            }
            break;
        case "REPORT_ERROR": {
            processId = localStorage.getItem('processId')
            payload.processId = processId
            fetch(apiServer + "/api/reportError", {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(payload), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    return response.json()

                })
                .then(result => {
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                });
        } break
        case "GET_TICKET": {
            fetch(apiServer + "/api/getTicket", {
                method: 'GET', // or 'PUT'                    
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log(result)
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });
        } break;
        case "RELEASE_TICKET": {
            fetch(apiServer + "/api/releaseTicket", {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log(result)
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });
        } break;
        case "BREAK_CAPTCHA": {
            console.log('break captcha')
            try {
                const base64Image = payload.bodyData.captchafile.replace('data:image/png;base64,', 'base64:');
                const fd = new FormData();
                const file = new File([base64Image], "captcha");
                fd.append('captchafile', file)
                fd.append('username', 'creditscore')
                fd.append('password', 'credit4vn6789!')
                const headers = new Headers();
                headers.append("content-type", "multipart/form-data");

                var username = 'creaditscore'
                var password = 'credit4vn6789!'

                window.fetch("http://api.dbcapi.me/api/captcha", {
                    method: "POST",
                    //headers: headers,
                    redirect: 'follow',
                    body: fd
                }).then(response => {                    
                    switch (response.status) {
                        case 200:
                            var url = response.url
                            var id = url.replace("http://api.dbcapi.me/api/captcha/", '')
                            var pollInterval = null
                            var pollStatus = function () {
                                window.fetch(url, {
                                    headers: {
                                        'Accept': 'application/json'
                                        //'Content-Type': 'application/json'
                                    }
                                }).then(response => {
                                    if (response && response.ok && response.status == 200) {
                                        return response.json()
                                    }
                                    else {
                                        sendResponse({ status: 0, msg: "deathbycaptcha error" })
                                    }
                                })
                                    .then(result => {
                                        if (result.text) {
                                            console.log(result.text)
                                            sendResponse({ captchaText: result.text, taskId: id })
                                        }
                                        else {
                                            setTimeout(pollStatus, 2000)
                                        }
                                    })
                            }
                            setTimeout(pollStatus, 2000)
                            break;
                        case 403:
                            console.log(new Error("Invalid login / Insufficient credits."));
                            sendResponse({ status: 0, msg: "invalid login or insufficient credits" })
                            break;
                        case 400:
                            console.log(new Error("Invalid image."));
                            sendResponse({ status: 0, msg: "invalid image" })
                            break;
                        case 503:
                            console.log(new Error("Temporarily unavailable."));
                            sendResponse({ status: 0, msg: "temporarily unavailable" })
                            break;
                        default:
                            console.log(new Error("Unexpected error."));
                            sendResponse({ status: 0, msg: "unexpected error" })
                    }
                    return response.text();
                })
            }
            catch (error) {
                console.log(error)
            }
        } break

        case "WRONG_CAPTCHA": {

            taskId = payload.taskId
            
            const fd = new FormData();
            fd.append('username', 'creditscore')
            fd.append('password', 'credit4vn6789!')

            window.fetch(`http://api.dbcapi.me/api/captcha/${taskId}/report`, {
                method: "POST",
                //headers: headers,
                redirect: 'follow',
                body: fd
            }).then(response => {
                return response.text()
            })          
            .then(result =>{
                sendResponse(result)
            })
        } break

        case "GET_UPDATE_LIST": {
            fetch(apiServer + "/api/getUpdateList", {
                method: 'GET', // or 'PUT'                    
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log(result)
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });
        } break;
        case "GET_PROXY_PORT": {
            fetch(apiServer + "/api/getProxyPort", {
                method: 'GET', // or 'PUT'                    
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log(result)
                    proxySettings = {
                        proxyType: "manual",
                        http: "proxy.fibo.vn:" + result.port,
                        httpProxyAll: true,
                        passthrough: "localhost, 127.0.0.1,192.168.1.204"
                    };

                    browser.proxy.settings.set({ value: proxySettings });
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });
        } break;
        case "CONFIG_PROXY": {
            let proxySettings = {
                proxyType: "manual",
                http: "proxy.fibo.vn:" + payload.port,
                httpProxyAll: true,
                passthrough: "localhost, 127.0.0.1,192.168.1.204"
            };

            browser.proxy.settings.set({ value: proxySettings });
            sendResponse({ status: 1 })
        } break;
        case "GET_COMMAND": {
            
            fetch(apiServer + "/api/getCommand", {
                method: 'GET', // or 'PUT'                    
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    //////console.log(result)
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });
        } break;
        case "CIC_SERVER_ERROR": {
            fetch(apiServer + "/api/cicServerError", {
                method: 'GET', // or 'PUT'                    
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log(result)
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });
        } break;
        case "CIC_SERVER_NOT_ERROR": {
            fetch(apiServer + "/api/cicServerNotError", {
                method: 'GET', // or 'PUT'                    
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log(result)
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });
        } break;
        case "GET_CIC_DETAIL": {
            job = payload.job
            currentCicTab = localStorage.getItem('currentCicTab')
            ////console.log(job, currentCicTab)

            function onError(error) {
                console.error(`Error: ${error}`);
            }
            browser.tabs.sendMessage(
                parseInt(currentCicTab),
                job
            ).then(response => {
                ////console.log("Message from the content script:");
                ////console.log(response.response);
            }).catch(onError);
            sendResponse({})


        } break;
        case "SEND_CIC_DETAIL": {
            clearTimeout(getCicTimeout)
            job = payload.job

            fetch(apiServer + "/api/saveCicDetail", {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(job), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log("SEND_CIC_DETAIL result")
                    const currentCmndTab = localStorage.getItem('currentCmndTab')
                    browser.tabs.sendMessage(
                        parseInt(currentCmndTab),
                        job
                    ).then(response => {
                        ////console.log("Message from the content script:");
                        ////console.log(response.response);
                    }).catch(onError);
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });

        } break
        case "ROLLBACK_COMMAND": {
            job = payload.job

            fetch(apiServer + "/api/rollbackCommand", {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(job), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    sendResponse(result)
                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });

        } break

        case "SEND_S37_STATE": {

            //////console.log(JSON.stringify(status))
            fetch(apiServer + "/api/sendS37State", {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(payload), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log(result)
					canTracking = true
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });

        } break
        case "SEND_GET_CIC_STATE": {
            fetch(apiServer + "/api/sendGetCicState", {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(payload), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log(result)
                    sendResponse(result)

                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });

        } break
        case "NEED_RELOAD": {
			////console.log('need reload')
            reloadProcessStatus = localStorage.getItem('reloadProcessStatus')
            if (!reloadProcessStatus) {
                function onCreated(tab) {
                    ////console.log('need reload')
                    payload.job.isReload = true
                    fetch(apiServer + "/api/rollbackCommand", {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(payload.job), // data can be `string` or {object}!
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        mode: "cors"
                    })
                        .then(async (response) => {
                            ////console.log("response")
                            return response.json()

                        })
                        .then(result => {
                            ////console.log(result)
                            localStorage.setItem('reloadProcessStatus', 'processing')
                            sendResponse({ status: 1 })
                            //
                        })
                        .catch(function (error) {
                            ////console.log(error);
                            //sendResponse({status:0})
                        });
                }

                function onError(error) {
                    ///need controll from here
                    ////console.log(`Error: ${error}`);
                }
                creating = browser.tabs.create({
                    url: "https://cic.org.vn/ACBBox-CIC-External/faces/Login?lang=vn"
                });
                creating.then(onCreated, onError);
            }

        } break
        case "TRACKING_PAGE_PROCESSING": {
            //const processingTabId = sender.tab.id
            sendResponse({ status: 1 })
        } break;
        case "BEGIN_LOGIN": {
            currentCicTab = localStorage.getItem('currentCicTab')
            if (currentCicTab) {
                browser.tabs.remove(parseInt(currentCicTab))
            }
            currentCmndTab = localStorage.getItem('currentCmndTab')
            if (currentCmndTab) {
                browser.tabs.remove(parseInt(currentCmndTab))
            }

            localStorage.removeItem('currentCicTab')
            localStorage.removeItem('currentCmndTab')
            sendResponse({ status: 1 })
        } break;

        case "LOGIN_COMPLETE": {
            localStorage.removeItem('reloadProcessStatus')
            fetch(apiServer + "/api/cicServerNotError", {
                method: 'GET', // or 'PUT'                    
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
                    ////console.log(result)
                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });
            currentCicTab = localStorage.getItem('currentCicTab')
            currentCmndTab = localStorage.getItem('currentCmndTab')
            if (currentCicTab) browser.tabs.reload(parseInt(currentCicTab), { bypassCache: true });
            else {
                browser.tabs.create({
                    url: "https://cic.org.vn/ACBBox-CIC-External/faces/TaskFlow?FID=16181"
                });
            }

            if (currentCmndTab) browser.tabs.reload(parseInt(currentCmndTab), { bypassCache: true });
            else {
                browser.tabs.create({
                    url: "https://cic.org.vn/ACBBox-CIC-External/faces/TaskFlow?FID=18628"
                });
            }
            sendResponse(result)

        } break
		case "START_GET_CIC":{
			clearTimeout(getCicTimeout)
			job = payload.job
			getCicTimeout = setTimeout(function (){
				//console.log('get cic time out')
				fetch(apiServer + "/api/rollbackCommand", {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(job), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors"
            })
                .then(async (response) => {
                    ////console.log("response")
                    return response.json()

                })
                .then(result => {
					reloadProcessStatus = localStorage.getItem('reloadProcessStatus')
					if (!reloadProcessStatus) {
						function onCreated(tab) {
							////console.log('need reload')
							payload.job.isReload = true
							fetch(apiServer + "/api/rollbackCommand", {
								method: 'POST', // or 'PUT'
								body: JSON.stringify(payload.job), // data can be `string` or {object}!
								headers: {
									'Content-Type': 'application/json'
								},
								mode: "cors"
							})
								.then(async (response) => {
									////console.log("response")
									return response.json()

								})
								.then(result => {
									////console.log(result)
									localStorage.setItem('reloadProcessStatus', 'processing')
									sendResponse({ status: 1 })
									//
								})
								.catch(function (error) {
									////console.log(error);
									//sendResponse({status:0})
								});
						}

						function onError(error) {
							///need controll from here
							////console.log(`Error: ${error}`);
						}
						var creating = browser.tabs.create({
							url: "https://cic.org.vn/ACBBox-CIC-External/faces/Login?lang=vn"
						});
						creating.then(onCreated, onError);
					}
                    
                })
                .catch(function (error) {
                    ////console.log(error);
                    //sendResponse({status:0})
                });
				
				
			},30000)
			sendResponse({status:1})
		}break

    }
    return true
}

browser.runtime.onMessage.addListener(handleMessage);

/*fetch(apiServer + "/api/getProxyPort", {
    method: 'GET', // or 'PUT'                    
    headers: {
        'Content-Type': 'application/json'
    },
    mode: "cors"
})
    .then(async (response) => {
        ////console.log("response")
        return response.json()

    })
    .then(result => {
        ////console.log(result)
		localStorage.setItem("processId", result.processId)
        let proxySettings = {
            proxyType: "manual",
            http: "proxy.fibo.vn:" + result.port.port,
            httpProxyAll: true, 
            passthrough: "localhost, 127.0.0.1,192.168.1.204"
        };
          
        browser.proxy.settings.set({value: proxySettings});

    })
    .catch(function (error) {
        ////console.log(error);
        //sendResponse({status:0})
    }); */