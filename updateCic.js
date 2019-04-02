let updateList = []
let currentCIC = 0;
let captchaCode = ''
var loadfunction = window.onload;
let curProcessId = localStorage.getItem('processId')
window.onload = function (event) {
    //enter here the action you want to do once loaded
    let taskId = ''

    let captchaText = ''
    if (loadfunction) loadfunction(event);
    const data = { username: "creditscore", password: "credit4vn6789!" }

    const imageCanvas = document.createElement("canvas")
    var c = document.body.insertAdjacentElement("beforeend", imageCanvas)
    var ctx = c.getContext("2d");
    var img = document.querySelector("#pt1\\:r1\\:0\\:i1");
    //var img = document.querySelector("#pt1\\:i1");
    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    ctx.putImageData(imgData, 0, 0);
    data.captchafile = c.toDataURL()
    ////console.log(c.toDataURL())
    browser.runtime.sendMessage({ data: { action: "BREAK_CAPTCHA", payload: { bodyData: data } } }, function (result) {
        //console.log(result);
        if (result.captchaText) {
            ////console.log("captcha ready")
            captchaCode = result.captchaText
            //document.querySelector('#fbCaptchaCode').value = captchaCode            
            browser.runtime.sendMessage({ data: { action: "GET_UPDATE_LIST", payload: {} } }, function (result) {
				//console.log("get list result")
                if (result.status == 1) {
                    updateList = result.data
                    document.querySelector("#fbStartBtn").click()
                }
                else {
                    //console.log("get update list failure")
                }
            });
        }
        else {
            //console.log("break captcha failure")
        }

    });
    let nodeAdded = false
    var targetNode = document.querySelector("#pt1\\:pt_pgl4");

    // Options for the observer (which mutations to observe)
    var config = { attributes: false, childList: true, subtree: false };



    // Callback function to execute when mutations are observed
    var callback = function (mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].className == "xpg" && mutation.addedNodes[i].id == "pt1:r1") {
                        nodeAdded = true
                    }
                }
            }
            else if (mutation.type == 'attributes') {
                ////console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);



    let captchaCodeDiv = document.createElement('div')
    captchaCodeDiv.innerHTML = `
    <label for="fbCaptchaCode">Captcha code: </label><input id="fbCaptchaCode">
    <label for="fbBeginCode">Start CIC code: </label><input id="fbBeginCode">
    <label for="fbMaxRecords">Maximum records for this session</label><input id="fbMaxRecords">
    <button id="fbStartBtn">Start</button>`
    captchaCodeDiv = document.body.insertAdjacentElement("beforeend", captchaCodeDiv)
    const startBtn = document.querySelector('#fbStartBtn')
    let textData = ''
    let isFinishStep3 = false
    let startCIC = 7932286937
    let oldData = ''
    let dbData = []
    let timeOutId = 0
    let sendToDb = false
    let saveToDBSuccess = -1
    let isStart = false

    //try and jump
    const jumpStepConst = 10
    let jumpStep = 1
    const tryMax = 5
    let tryCount = 0
    let isRollBack = false
    let sign2 = false
    let trackingTime = 0
    let trackingInterval = 07
	let isFillForm = false

    startBtn.addEventListener('click',
        async function () {
            if (isStart) return
            isStart = true
            let count = 1
            sendToDb = false
            saveToDBSuccess = -1
            dbData = []
            oldData = ''
            let isClickButton = false
            let isSendUpdateMsg = false
			let isIncreaseCount = false

            if (captchaCode) {
                let currentStep = 0
                let isGetUpdateList = false
                let isError = false
                let cicServerErrors = false
                const alertHook = window.alert
                window.alert = function (strMsg) {
                    //console.log(strMsg)                    
                    if (strMsg.replace(/\s/g,'') != "BạnchưanhậpmãCIChoặcnhậpmãCICkhônghợplệ!") {
                        cicServerErrors = true
                        clearInterval(intervalId)
						browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: {cic: currentCIC, step:currentStep, message:escape(strMsg)} } }, function (result) {
                            //console.log(result)
                        });
                        setTimeout(() => {
                            this.location.href = "https://cic.org.vn/ACBBox-CIC-External/faces/Login?lang=vn"                            
                        }, 30*60*1000);
                    }
                }
                const intervalId = setInterval(async () => {
                    isError = false
                    const curDate = new Date()
                    const curHours = curDate.getHours()
                    const curMinutes = curDate.getMinutes()
                    if (curProcessId > 100 && curHours < 17 && curHours > 5){
                        return
                    }
                    if (document.querySelector("#__af_Z_window")){
                        if (
                            document.querySelector("#__af_Z_window").textContent.replace(/\s/g,'').indexOf("Cólỗitrongquátrìnhxửlý,hãyliênhệvớiquảntrịhệthốngđểđượchỗtrợxửlý!") >=0 ||                            
                            document.querySelector("#__af_Z_window").textContent.replace(/\s/g,'').indexOf("ErrorMãkiểmtrakhôngchínhxác.OK") >=0 ||
                            document.querySelector("#__af_Z_window").textContent.replace(/\s/g,'').indexOf("ACBBoxYourCaptchacodeiswrong.YourCaptchacodeiswrong.OK") >=0 ||
                            document.querySelector("#__af_Z_window").textContent.replace(/\s/g,'').indexOf("PageExpiredThepagehasexpired.ClickOKtocontinue.OKCancel") >=0
                        ){
                            browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: {cic: currentCIC, step:currentStep, message:escape(document.querySelector("#__af_Z_window").textContent)} } }, function (result) {
                                //console.log(result)
                            });
                            isError = true
                            clearInterval(intervalId)
                            location.reload()
                        }
                        else if (
                            document.querySelector("#__af_Z_window").textContent.replace(/\s/g,'').indexOf("ExpirationWarningThispagewillexpireunlessaresponseisreceivedwithin2minutes.ClickOKtopreventexpiration.OKCancel") >= 0
                        ){
                            //console.log("start report error")
                            /*browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: {} } }, function (result) {
                                //console.log(result)
                            });
                            isError = true*/
                            browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: {cic: currentCIC, step:currentStep, message:escape(document.querySelector("#__af_Z_window").textContent)} } }, function (result) {
                                //console.log(result)
                            });
                            document.querySelector("#__af_Z_window").querySelector('button').click()
                            currentStep = 0
                            isError = true                            
                        }
                    }
                    
                    
                    if (!isError){
                        if (currentStep == 0) {
                            //console.log("step 0")
                            try {
								isIncreaseCount = false /// reset increase count flag								
                                if (updateList.length > 0) {
                                    isGetUpdateList = false
									sendToDb = false
									if (!isFillForm){
										isFillForm = true
										currentCIC = updateList.pop().cic
                                    
										const maCicElem = document.querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content')

										maCicElem.dispatchEvent(new Event('focus'))
										maCicElem.value = currentCIC
										maCicElem.dispatchEvent(new Event('change'))
										maCicElem.dispatchEvent(new Event('blur'))
										////console.log(maCicElem.value)
										const captchaElem = document.querySelector('#pt1\\:r1\\:0\\:it3\\:\\:content')
										captchaElem.dispatchEvent(new Event('focus'))
										captchaElem.value = captchaCode;
										captchaElem.dispatchEvent(new Event('change'))
										captchaElem.dispatchEvent(new Event('blur'))
										currentStep++

										step1BtnClick = false
										/*timeOutId = setTimeout(() => {
											currentStep = 1000;
										}, 15000);*/
									}                                    
                                }
                                else {
                                    if (!isGetUpdateList) {
                                        isGetUpdateList = true
                                        browser.runtime.sendMessage({ data: { action: "GET_UPDATE_LIST", payload: {} } }, function (result) {
                                            if (result.status == 1) {
                                                updateList = result.data
                                                currentStep = 0;
												count = 0;
												isFillForm = false
												isGetUpdateList = false
                                            }
                                            else {
                                                //console.log("Can not get update list")
                                                setTimeout(() => {
                                                    isGetUpdateList = false
                                                }, 1000);
                                            }                                            
                                        });
                                    }
                                    //location.reload()
                                }

                            }
                            catch (error) {
                                //console.log(error)
                            }
                            //await localStorage.setItem('fbCurrentStep', currentStep)
                        }
                        else if (currentStep == 1) {
                            //console.log("step 1")
							isFillForm = false
							if (!isClickButton){
								const xemButtonElem = document.querySelector('#pt1\\:r1\\:0\\:btnhotrotimkiem')
								if (xemButtonElem) {
									isClickButton = true
									xemButtonElem.click()
									/*const confirmDialog = document.querySelector('#pt1\\:r1\\:0\\:confirmDialog')
									if (confirmDialog && !!(confirmDialog.offsetWidth || confirmDialog.offsetHeight || confirmDialog.getClientRects().length)) {
										currentStep++
									}
									const wrongCaptchaDialog = document.querySelector("#pt1\\:r1\\:0\\:popup\\:\\:content")
									if (wrongCaptchaDialog && !!(wrongCaptchaDialog.offsetWidth || wrongCaptchaDialog.offsetHeight || wrongCaptchaDialog.getClientRects().length)) {
										browser.runtime.sendMessage({ data: { action: "WRONG_CAPTCHA", payload: { taskId: taskId } } }, function (result) {
											location.reload()
										});
									}*/
								}
							}
							else{
								if (document.querySelector("#__af_Z_window")){
									if (document.querySelector("#__af_Z_window").textContent.replace(/\s/g, "").indexOf( "XácnhậnBạncóchấpnhậnxemsảnphẩmcảnhbáonàykhông?ĐồngýKhông") >= 0) {
										currentStep++
										isClickButton = false
									}
								}
							}
                            
                        }
                        else if (currentStep == 2) {
                            //console.log("step 2")
                            try {
								if (!isClickButton){
									if (document.querySelector("#__af_Z_window")){
										if (document.querySelector("#__af_Z_window").textContent.replace(/\s/g, "").indexOf( "XácnhậnBạncóchấpnhậnxemsảnphẩmcảnhbáonàykhông?ĐồngýKhông") >= 0) {
											const yesBtnElem = document.querySelector('#pt1\\:r1\\:0\\:tnYes')
											if (yesBtnElem){
												yesBtnElem.click()												
                                                isClickButton = true
                                                nodeAdded = false
											}											
										}
									}									
								}
								else{
									if (!document.querySelector("#__af_Z_window") || document.querySelector("#__af_Z_window").textContent.replace(/\s/g, "").indexOf( "XácnhậnBạncóchấpnhậnxemsảnphẩmcảnhbáonàykhông?ĐồngýKhông") < 0){
										currentStep++
										isClickButton = false
									}
								}                                
                            }
                            catch (error) {
                                //console.log(error)
                            }
                        }
                        else if (currentStep == 3) {
                            //console.log("step 3")
                            sign2 = false
                            if (nodeAdded) {
                                try {
                                    if (document.querySelector("#pt1\\:r1\\:0\\:panel_timkiemkh").style.display == "none" &&
                                        document.querySelector("#pt1\\:r1\\:0\\:j_id__ctru39pc2").style.display == "none") {
                                        const yesBtnElem = document.querySelector('#pt1\\:r1\\:0\\:tnYes')
                                        if (yesBtnElem) {
                                            yesBtnElem.click()
                                            nodeAdded = false
                                        }
                                        return
                                    }
                                    let currentData = `${document.querySelector('#pt1\\:r1\\:0\\:txtcmnd\\:\\:content').value}${document.querySelector('#pt1\\:r1\\:0\\:txttenkh\\:\\:content').value}${document.querySelector('#pt1\\:r1\\:0\\:txtdiachi\\:\\:content').value}`
                                    if (currentData.length < 4) {
                                        //clearTimeout(timeOutId)
                                        currentStep = 0;
                                    }
                                    else {
                                        tryCount = 0
                                        jumpStep = 1

                                        let resultParentElem = document.querySelector("#pt1\\:r1\\:0\\:panel_timkiemkh")
                                        let description = ''
                                        let cicDate = ''
                                        if (document.querySelector("#pt1\\:r1\\:0\\:j_id__ctru39pc2").style.display != "none") {
                                            const parentContainer = document.querySelector('#pt1\\:r1\\:0\\:j_id__ctru42pc2').querySelectorAll('td.x4w')[0].querySelectorAll('td.x51')
                                            description = parentContainer[9].innerText
                                            const cicDateTemp = parentContainer[1].innerText.replace(/[^0-9\/]/gmi, "").split('/')
                                            cicDate = `${cicDateTemp[2]}-${cicDateTemp[1]}-${cicDateTemp[0]}`
                                        }
                                        else if (document.querySelector("#pt1\\:r1\\:0\\:panel_timkiemkh").style.display != "none") {
                                            const parentContainer = resultParentElem.querySelector('#pt1\\:r1\\:0\\:j_id__ctru32pc2').querySelectorAll('td.x4w')[0].querySelectorAll('td.x51')
                                            description = parentContainer[7].innerText
                                            const cicDateTemp = parentContainer[1].innerText.replace(/[^0-9\/]/gmi, "").split('/')
                                            cicDate = `${cicDateTemp[2]}-${cicDateTemp[1]}-${cicDateTemp[0]}`
                                        }

                                        if (description) {
                                            ////console.log(cicDate, description)

                                            var currentdate = new Date();
                                            var createDate = `${currentdate.getFullYear()}-${currentdate.getMonth()}-${currentdate.getDate()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`

                                            dbData.push([
                                                escape(document.querySelector('#pt1\\:r1\\:0\\:txttenkh\\:\\:content').value),
                                                escape(document.querySelector('#pt1\\:r1\\:0\\:txtcmnd\\:\\:content').value),
                                                escape(document.querySelector('#pt1\\:r1\\:0\\:txtdiachi\\:\\:content').value),
                                                escape(description),
                                                cicDate,
                                                escape(document.querySelector('#pt1\\:r1\\:0\\:txtdienthoai\\:\\:content').value),
                                                0,
                                                createDate,
                                                document.querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content').value
                                            ])

                                            currentStep++
                                            nodeAdded = false
                                        }

                                        //oldData = newData                                    
                                    }
                                }
                                catch (error) {
                                    //console.log(error)
                                    //clearTimeout(timeOutId)                                    
                                }
                            }
                        }
                        else {
                            //console.log("step 4")
                            //clearTimeout(timeOutId)
                            if (dbData.length >= 25) {                                
                                if (!isSendUpdateMsg){
                                    isSendUpdateMsg = true
                                    //console.log("send Update Msg")
									browser.runtime.sendMessage({ data: { action: "UPDATE_CIC", payload: { dbData: dbData } } }, function (result) {
											//console.log(result)
											////console.log(dbData)
											dbData = []
											currentStep = 0;									
											if (!isIncreaseCount) {
												isIncreaseCount = true
												count++
											}
											isSendUpdateMsg = false
										});
                                }                                

                            } else {
                                if (!isIncreaseCount) {
											isIncreaseCount = true
											count++
										}
                                currentStep = 0;
                            }
							
                        }
                    }
                    

                }, 1000);

            }
        })

}

function reportError(error, cicNo, step, rawData) {
    const errorMessage = error.message
    /*browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: { message: errorMessage, cic: cicNo, step: step, rawData: rawData } } }, function (result) {
        ////console.log("errorSaved")
    });*/
}