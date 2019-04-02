let updateList = []
let currentCIC = 0;
let captchaCode = ''
let loadfunction = window.onload;
let curProcessId = localStorage.getItem('processId')
let dbData = []
function checkError(){
    if (document.querySelector("#__af_Z_window")) {
        if (
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("Cólỗitrongquátrìnhxửlý,hãyliênhệvớiquảntrịhệthốngđểđượchỗtrợxửlý!") >= 0 ||
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("ErrorMãkiểmtrakhôngchínhxác.OK") >= 0 ||
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("ACBBoxYourCaptchacodeiswrong.YourCaptchacodeiswrong.OK") >= 0 ||
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("PageExpiredThepagehasexpired.ClickOKtocontinue.OKCancel") >= 0
        ) {
            isError = true
            location.reload()   
            browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: { cic: currentCIC, step: currentStep, message: escape(document.querySelector("#__af_Z_window").textContent) } } }, function (result) {
                //console.log(result)                
                //location.reload()
            });
            return true
        }
        else if (
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("ExpirationWarningThispagewillexpireunlessaresponseisreceivedwithin2minutes.ClickOKtopreventexpiration.OKCancel") >= 0
        ) {
            browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: { cic: currentCIC, step: currentStep, message: escape(document.querySelector("#__af_Z_window").textContent) } } }, function (result) {
                //console.log(result)
            });
            isError = true
            document.querySelector("#__af_Z_window").querySelector('button').click()
            setTimeout(() => {
                if (!(document.querySelector("#__af_Z_window") && document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("ExpirationWarningThispagewillexpireunlessaresponseisreceivedwithin2minutes.ClickOKtopreventexpiration.OKCancel") >= 0)){
                    isError = false
                    execStep0()
                }
            }, 1000);
        }
    }
}
window.onload = function (event) {
    
    //enter here the action you want to do once loaded
    let taskId = ''

    let captchaText = ''
    let isError = false
    if (loadfunction) loadfunction(event);

    const againstExpire = setInterval(function(){
             
    }, 5000)
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
                    execStep0()
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
                    console.log(mutation)
                    if (mutation.addedNodes[i].className == "xpg" && mutation.addedNodes[i].id == "pt1:r1") {
                        console.log('data added, get data and save')
                        setTimeout(() => {
                            checkError()
                            if (isError) return
                            try {                            
                                let currentData = `${document.querySelector('#pt1\\:r1\\:0\\:txtcmnd\\:\\:content').value}${document.querySelector('#pt1\\:r1\\:0\\:txttenkh\\:\\:content').value}${document.querySelector('#pt1\\:r1\\:0\\:txtdiachi\\:\\:content').value}`
                                if (currentData.length >= 4) {
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
                                                         
                                    }
                                    if (dbData.length >= 25) {
                                        //console.log(dbData)
                                        browser.runtime.sendMessage({ data: { action: "UPDATE_CIC", payload: { dbData: dbData } } }, function (result) {
                                           dbData = []
                                           execStep0()

                                        });
                                    }
                                    else{
                                        browser.runtime.sendMessage({ data: { action: "FINISH_STEP_0", payload: {} } }, function (result1) {
                                            execStep0()
                                        })
                                    }  
    
                                    //oldData = newData                                    
                                }
                                else {
                                    browser.runtime.sendMessage({ data: { action: "FINISH_STEP_0", payload: {} } }, function (result1) {
                                        execStep0()
                                    })
                                }
                            }
                            catch (error) {
                                //console.log(error)
                                //clearTimeout(timeOutId)                                    
                            }
                            
                        }, 1000);
                        
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

    let isAddObserve = false
    function execStep0() {
        console.log("start step 0")
        if (updateList.length > 0) {
            currentCIC = updateList.pop().cic

            const maCicElem = document.querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content')

            maCicElem.dispatchEvent(new Event('focus'))
            maCicElem.value = currentCIC
            maCicElem.dispatchEvent(new Event('change'))
            maCicElem.dispatchEvent(new Event('blur'))

            const captchaElem = document.querySelector('#pt1\\:r1\\:0\\:it3\\:\\:content')
            captchaElem.dispatchEvent(new Event('focus'))
            captchaElem.value = captchaCode;
            captchaElem.dispatchEvent(new Event('change'))
            captchaElem.dispatchEvent(new Event('blur'))
            
            if (!isAddObserve) {
                isAddObserve = true
                var targetNode1 = document.querySelector("#f1");
                // Options for the observer (which mutations to observe)
                var config1 = { attributes: false, childList: true, subtree: false };
                // Callback function to execute when mutations are observed
                var callback1 = function (mutationsList, observer) {
                    for (var mutation of mutationsList) {
                        if (mutation.type == 'childList') {
                            console.log(mutation)
                            for (var i = 0; i < mutation.addedNodes.length; i++) {
                                if (mutation.addedNodes[i].id == "f1::postscript") {
                                    function buttonCLick(){
                                        if (document.querySelector("#__af_Z_window") && document.querySelector("#__af_Z_window").textContent.replace(/\s/g, "").indexOf("XácnhậnBạncóchấpnhậnxemsảnphẩmcảnhbáonàykhông?ĐồngýKhông") >= 0) {
                                            const yesBtnElem = document.querySelector('#pt1\\:r1\\:0\\:tnYes')
                                            yesBtnElem.click()
                                        }
                                        else{
                                            setTimeout(() => {
                                                buttonCLick()                                                
                                            }, 1000);
                                        }
                                    }
                                    buttonCLick()
                                }
                            }
                        }
                    }
                };

                // Create an observer instance linked to the callback function
                var observer1 = new MutationObserver(callback1);
                // Start observing the target node for configured mutations
                observer1.observe(targetNode1, config1);
            }


            const xemButtonElem = document.querySelector('#pt1\\:r1\\:0\\:btnhotrotimkiem')
            if (xemButtonElem) {
                xemButtonElem.click()
            }
        }
        else {
            browser.runtime.sendMessage({ data: { action: "GET_UPDATE_LIST", payload: {} } }, function (result) {
                if (result.status == 1) {
                    updateList = result.data
                    browser.runtime.sendMessage({ data: { action: "FINISH_STEP_0", payload: {} } }, function (result1) {
                        execStep0()
                    })
                }
                else {
                    updateList = []
                    setTimeout(() => {
                        execStep0()
                    }, 1000);
                }
            });
        }
    }    
}

function reportError(error, cicNo, step, rawData) {
    const errorMessage = error.message
    /*browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: { message: errorMessage, cic: cicNo, step: step, rawData: rawData } } }, function (result) {
        ////console.log("errorSaved")
    });*/
}