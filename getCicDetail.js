browser.runtime.sendMessage({ data: { action: "SET_CIC_TAB", payload: {} } }, function (result) {
    //console.log(result)
});
browser.runtime.sendMessage({ data: { action: "SEND_S37_STATE", payload: {status:0} } }, function (result) {
});
let currentCIC = 0;
let captchaCode = ''
let loadfunction = window.onload;
let job = {}
let isResultReady = false
let isSendResult = false
let isStop = false
console.log('get detail cic')

window.onload = function (event) {
    if (loadfunction) loadfunction(event);
    try {

        console.log("send captcha")
        const data = {}
        const imageCanvas = document.createElement("canvas")
        var c = document.body.insertAdjacentElement("beforeend", imageCanvas)
        var ctx = c.getContext("2d");
        var img = document.querySelector("#pt1\\:r1\\:0\\:i1");

        ctx.drawImage(img, 0, 0);
        var imgData = ctx.getImageData(0, 0, c.width, c.height);
        ctx.putImageData(imgData, 0, 0);
        data.captchafile = c.toDataURL()
        

        browser.runtime.sendMessage({ data: { action: "BREAK_CAPTCHA", payload: { bodyData: data } } }, function (result) {
            if (result.captchaText) {
                console.log(result.captchaText)
                captchaCode = result.captchaText
				result = null
                browser.runtime.sendMessage({ data: { action: "SEND_S37_STATE", payload: {status:1} } }, function (result1) {
					result1 = null
                });
                var targetNode = document.documentElement;

                // Options for the observer (which mutations to observe)
                var config = { attributes: false, childList: true, subtree: true };

				let isExpire = false
				let isError = false
				
				let isNotFound = false
				let cicNo = ''
				let isConfirm = false
				let isCaptchaError = false
				
				var yesBtnElem, 
					currentData, 
					resultParentElem,
					description,
					cicDate,
					parentContainer,
					cicDateTemp,
					currentdate,
					createDate

                // Callback function to execute when mutations are observed
                
                var callback = function (mutationsList, observer) {
                    if (isStop) return
                    isExpire = false
					isError = false
					
					isNotFound = false
					cicNo = ''
					isConfirm = false
					isCaptchaError = false
                    
                    for (var mutation of mutationsList) {
                        if (mutation.type == 'childList' || mutation.type == 'subtree') {
                            for (var i = 0; i < mutation.addedNodes.length; i++) {                                
                                //console.log(mutation.addedNodes[i].id)
                                ////console.log(mutation.addedNodes[i].textContent)
                                if (mutation.addedNodes[i].id.indexOf('pt1:r1:0:confirmXemBaoCao::') >= 0) { ///////"XácnhậnBạncóchấpnhậnxemsảnphẩmcảnhbáonàykhông?ĐồngýKhông"
                                    if (mutation.addedNodes[i].textContent.replace(/\s/g, '').indexOf("XácnhậnBạncóchấpnhậnxemsảnphẩmcảnhbáonàykhông?ĐồngýKhông") >= 0) {
                                        ////console.log(mutation.addedNodes[i].id)
                                        isConfirm = true
                                        yesBtnElem = mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:tnYes')
                                        yesBtnElem.click()
                                    }
                                }
                                
                                if (mutation.addedNodes[i].textContent.replace(/\s/g,'').indexOf("ExpirationWarningThispagewillexpireunlessaresponseisreceivedwithin2minutes.ClickOKtopreventexpiration.OKCancel")>=0){
                                    //console.log('expire  ...............')
                                    isExpire = true
                                    mutation.addedNodes[i].querySelector('button').click()
                                }
                                else if (
									mutation.addedNodes[i].textContent.replace(/\s/g,'').indexOf("PageExpiredThepagehasexpired.ClickOKtocontinue.OKCancel")>=0)
								{
                                    
									isError = true
                                    location.reload()
                                }
								else if (
									mutation.addedNodes[i].id.indexOf('pt1:r1:0:popup::') >= 0 &&
									mutation.addedNodes[i].textContent.replace(/\s/g,'').indexOf("ACBBoxYourCaptchacodeiswrong.YourCaptchacodeiswrong.OK")>=0
								)
								{                                    
									isCaptchaError = true
                                    //location.reload()
                                }
								
                                
                                if (!isResultReady && mutation.addedNodes[i].className == "xpg" && mutation.addedNodes[i].id == "pt1:r1") {
                                    isResultReady = true
                                    
                                        currentData = `${mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtcmnd\\:\\:content').value}${document.querySelector('#pt1\\:r1\\:0\\:txttenkh\\:\\:content').value}${document.querySelector('#pt1\\:r1\\:0\\:txtdiachi\\:\\:content').value}`
                                        if (currentData.length >= 4) {
                                            resultParentElem = mutation.addedNodes[i].querySelector("#pt1\\:r1\\:0\\:panel_timkiemkh")
                                            description = ''
                                            cicDate = ''
                                            if (mutation.addedNodes[i].querySelector("#pt1\\:r1\\:0\\:j_id__ctru39pc2").style.display != "none") {
                                                parentContainer = mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:j_id__ctru42pc2').querySelectorAll('td.x4w')[0].querySelectorAll('td.x51')
                                                description = parentContainer[9].innerText
                                                cicDateTemp = parentContainer[1].innerText.replace(/[^0-9\/]/gmi, "").split('/')
                                                cicDate = `${cicDateTemp[2]}-${cicDateTemp[1]}-${cicDateTemp[0]}`
                                            }
                                            else if (mutation.addedNodes[i].querySelector("#pt1\\:r1\\:0\\:panel_timkiemkh").style.display != "none") {
                                                parentContainer = mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:j_id__ctru32pc2').querySelectorAll('td.x4w')[0].querySelectorAll('td.x51')
                                                description = parentContainer[7].innerText
                                                cicDateTemp = parentContainer[1].innerText.replace(/[^0-9\/]/gmi, "").split('/')
                                                cicDate = `${cicDateTemp[2]}-${cicDateTemp[1]}-${cicDateTemp[0]}`
                                            }
											
											currentdate = new Date();
                                            createDate = `${currentdate.getFullYear()}-${currentdate.getMonth()}-${currentdate.getDate()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`

                                            if (description) {                                                
                                                job.name = mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txttenkh\\:\\:content').value
												job.cmt = mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtcmnd\\:\\:content').value
                                                job.address = mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtdiachi\\:\\:content').value
                                                job.content = description
												job.cicDate =  cicDate
                                                job.phone = mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtdienthoai\\:\\:content').value                                                
                                                job.createDate = createDate
												job.cic = mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content').value
                                                job.code = 200

                                                job.detail = [
                                                    escape(mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txttenkh\\:\\:content').value),
                                                    escape(mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtcmnd\\:\\:content').value),
                                                    escape(mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtdiachi\\:\\:content').value),
                                                    escape(description),
                                                    cicDate,
                                                    escape(mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtdienthoai\\:\\:content').value),
                                                    '0',
                                                    createDate,
                                                    mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content').value
                                                ]
                                                //console.log("result ready " , job)
                                            }
                                            else{
												job.name = ''
												job.cmt = ''
                                                job.address = ''
                                                job.content = ''
												job.cicDate =  cicDate
                                                job.phone = ''
                                                job.createDate = createDate
												job.cic = ''
                                                job.code = 500
												
												job.detail = [
                                                    '',
                                                    '',
                                                    '',
                                                    '',
                                                    cicDate,
                                                    '',
                                                    '0',
                                                    createDate,
                                                    mutation.addedNodes[i].querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content').value
                                                ]
                                                //job.detail = []
                                            }
                                        }
                                    
                                    
                                    
                                }
                            }
                        }
                    }
                    if (isError) {
                        isStop = true            
                        //job.cic = ''
                        //job.detail = []
                        job.code = 500
                        browser.runtime.sendMessage({ data: { action: "SEND_CIC_DETAIL", payload: { job: job } } }, function (result) {
							result = null
                            location.reload()
                        });
                        //location.reload()
                    }
					else if (isCaptchaError){
						browser.runtime.sendMessage({ data: { action: "ROLLBACK_COMMAND", payload: { job: job } } }, function (result) {
							result = null
                            
                        });
						location.reload()
					}
                    else{
                        if (!isSendResult && isResultReady){
                            isSendResult = true
                            browser.runtime.sendMessage({ data: { action: "SEND_CIC_DETAIL", payload: { job: job } } }, function (result) {
								result = null
                                //console.log(result)
                            });
                        }                        
                    }
                };
                // Create an observer instance linked to the callback function
                var observer = new MutationObserver(callback);

                // Start observing the target node for configured mutations
                observer.observe(targetNode, config);
            }
        });
    }
    catch (error) {
        //console.log(error)
    }



}
var maCicElem, 
	captchaElem, 
	xemButtonElem,
	focusEvent = new Event('focus'),
	changeEvent = new Event('change'),
	blurEvent = new Event('blur')

function getDetail(job) {
    isResultReady = false
    isSendResult = false
    maCicElem = document.querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content')

    maCicElem.dispatchEvent(focusEvent)
    maCicElem.value = job.cic
    maCicElem.dispatchEvent(changeEvent)
    maCicElem.dispatchEvent(blurEvent)

    captchaElem = document.querySelector('#pt1\\:r1\\:0\\:it3\\:\\:content')
    captchaElem.dispatchEvent(focusEvent)
    captchaElem.value = captchaCode;
    captchaElem.dispatchEvent(changeEvent)
    captchaElem.dispatchEvent(blurEvent)
    
    xemButtonElem = document.querySelector('#pt1\\:r1\\:0\\:btnhotrotimkiem')
    if (xemButtonElem) {
        xemButtonElem.click()
    }

}
browser.runtime.onMessage.addListener(request => {
    //console.log("Message from the background script:");    
    //console.log(request)
    job = request
    if (job.cic){        
        getDetail(request)
    }    
    return Promise.resolve({ response: "Hi from CIC DETAIL script" });
});

/*const alertHook = window.alert
window.alert = function (strMsg) {
    //console.log(strMsg)                    
    /*if (strMsg.replace(/\s/g,'') != "BạnchưanhậpmãCIChoặcnhậpmãCICkhônghợplệ!") {
        cicServerErrors = true
        clearInterval(intervalId)
        setTimeout(() => {
            this.location.href = "https://cic.org.vn/ACBBox-CIC-External/faces/Login?lang=vn"                            
        }, 60*60*1000);
    }
    browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: {cic: currentCIC, step:currentStep, message:strMsg} } }, function (result) {
    });
    //job.detail = []
    job.code = 500
    browser.runtime.sendMessage({ data: { action: "SEND_CIC_DETAIL", payload: { job: job } } }, function (result) {
        location.reload()
    });
}*/