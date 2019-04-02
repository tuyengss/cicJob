

const TICKET = [
    [7931000000, 50000],
    [7931050000, 50000],
    [7931100000, 50000],
    [7931150000, 50000],
    [7931200000, 50000],
    [7931250000, 50000],
    [7931300000, 50000],
    [7931350000, 50000],
]
//localStorage.clear()
const firstCICVal = 7931000000
var loadfunction = window.onload;
window.onload = function (event) {
    //enter here the action you want to do once loaded
    let taskId = ''
    let ticketId = ''
    let captchaText = ''
    if (loadfunction) loadfunction(event);
    const data = { username: "creditscore", password: "credit4vn6789!" }
    const loginUrl = "https://cic.org.vn/ACBBox-CIC-External/faces/Login?lang=vn"
    const imageCanvas = document.createElement("canvas")
    var c = document.body.insertAdjacentElement("beforeend", imageCanvas)
    var ctx = c.getContext("2d");
    var img = document.querySelector("#pt1\\:r1\\:0\\:i1");
    //var img = document.querySelector("#pt1\\:i1");
    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    ctx.putImageData(imgData, 0, 0);
    data.captchafile = c.toDataURL()
    //console.log(c.toDataURL())
    browser.runtime.sendMessage({ data: { action: "BREAK_CAPTCHA", payload: { bodyData: data } } }, function (result) {
        console.log(result); 
        if (result.captchaText) {            
            //console.log("captcha ready")
            captchaText = result.captchaText
            taskId = result.taskId
            const captchaCodeElem = document.querySelector('#fbCaptchaCode')
            if (captchaCodeElem) {
                captchaCodeElem.value = captchaText
            }
            const isAutoStart = localStorage.getItem("isAutoStart") ? localStorage.getItem("isAutoStart") : 'false'
            if (isAutoStart == 'true') {
                startCIC = parseInt(localStorage.getItem("startCIC"))
                const currentCIC = parseInt(localStorage.getItem("currentCIC")) ? parseInt(localStorage.getItem("currentCIC")) : startCIC
                const maxCIC = parseInt(localStorage.getItem("maxCIC"))
                maxRecords = maxCIC - (currentCIC - startCIC)

                if (currentCIC != null && maxCIC) {
                    document.querySelector("#fbBeginCode").value = currentCIC
                    document.querySelector("#fbMaxRecords").value = startCIC + maxCIC - currentCIC
                    document.querySelector("#fbStartBtn").click()
                }
                else {
                    localStorage.setItem("isAutoStart", false)
                }

            }
            else {
                //console.log("getticket")
                browser.runtime.sendMessage({ data: { action: "GET_TICKET", payload: {} } }, function (result) {
                    if (result.status == 1) {
                        //startCIC = TICKET[result.status - 1][0]
                        //maxRecords = 50000
                        ticketId = result.ticket
                        document.querySelector("#fbBeginCode").value =  firstCICVal + ticketId
                        document.querySelector("#fbMaxRecords").value = 50000
                        document.querySelector("#fbStartBtn").click()
                    }
                });
            }
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
                //console.log('The ' + mutation.attributeName + ' attribute was modified.');
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


    startBtn.addEventListener('click',
        async function () {
            if (isStart) return
            isStart = true
            startCIC = parseInt(document.querySelector('#fbBeginCode').value)
            let maxRecords = parseInt(document.querySelector('#fbMaxRecords').value)
            localStorage.setItem("startCIC", startCIC)
            localStorage.setItem("maxCIC", maxRecords)
            localStorage.setItem("isAutoStart", true)
            let count = 1
            sendToDb = false
            saveToDBSuccess = -1
            dbData = []
            oldData = ''

            let step1BtnClick = false


            const captchaCode = document.querySelector('#fbCaptchaCode').value//localStorage.getItem('fbCaptchaCode')            
            if (captchaCode) {
                let currentStep = 0
                const intervalId = setInterval(async () => {
                    if (currentStep == 0) {
                        try {
                            sendToDb = false
                            const maCicElem = document.querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content')

                            maCicElem.dispatchEvent(new Event('focus'))
                            maCicElem.value = startCIC//CICList[currentCICIndex]
                            maCicElem.dispatchEvent(new Event('change'))
                            maCicElem.dispatchEvent(new Event('blur'))
                            //console.log(maCicElem.value)
                            const captchaElem = document.querySelector('#pt1\\:r1\\:0\\:it3\\:\\:content')
                            captchaElem.dispatchEvent(new Event('focus'))
                            captchaElem.value = captchaCode;
                            captchaElem.dispatchEvent(new Event('change'))
                            captchaElem.dispatchEvent(new Event('blur'))
                            currentStep++

                            step1BtnClick = false
                            timeOutId = setTimeout(() => {
                                currentStep = 1000;
                                /*const failureCIC = JSON.parse(localStorage.getItem('fbFailureCIC'))
                                failureCIC.push(startCIC);
                                localStorage.setItem('fbFailureCIC', failureCIC)                      */
                            }, 15000);
                        }
                        catch (error) {
                            clearTimeout(timeOutId)
                            reportError(error, startCIC, 0, "")
                        }
                        //await localStorage.setItem('fbCurrentStep', currentStep)
                    }
                    else if (currentStep == 1) {
                        //console.log("step 1")
                        const xemButtonElem = document.querySelector('#pt1\\:r1\\:0\\:btnhotrotimkiem')
                        if (xemButtonElem) {
                            xemButtonElem.click()
                            const confirmDialog = document.querySelector('#pt1\\:r1\\:0\\:confirmDialog')
                            if (confirmDialog && !!(confirmDialog.offsetWidth || confirmDialog.offsetHeight || confirmDialog.getClientRects().length)) {
                                currentStep++
                            }
                            const wrongCaptchaDialog = document.querySelector("#pt1\\:r1\\:0\\:popup\\:\\:content")
                            if (wrongCaptchaDialog && !!(wrongCaptchaDialog.offsetWidth || wrongCaptchaDialog.offsetHeight || wrongCaptchaDialog.getClientRects().length)) {
                                browser.runtime.sendMessage({ data: { action: "WRONG_CAPTCHA", payload: { taskId: taskId } } }, function (result) {
                                    //console.log(result)
                                    browser.runtime.sendMessage({ data: { action: "RELEASE_TICKET", payload: { ticket: ticketId } } }, function (result) {
                                        location.reload()
                                        //console.log(result)
                                    });
                                });
                            }
                        }
                    }
                    else if (currentStep == 2) {
                        //console.log("step 2")
                        const confirmDialog = document.querySelector('#pt1\\:r1\\:0\\:confirmDialog')
                        if (confirmDialog && !!(confirmDialog.offsetWidth || confirmDialog.offsetHeight || confirmDialog.getClientRects().length)) {
                            const yesBtnElem = document.querySelector('#pt1\\:r1\\:0\\:tnYes')
                            if (yesBtnElem) {
                                yesBtnElem.click()
                            }
                        }
                        else {
                            currentStep++
                        }
                    }
                    else if (currentStep == 3) {
                        //console.log("step 3")
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
                                    tryCount++
                                    //console.log('empty data', tryCount)
                                    if (tryCount > tryMax) {
                                        jumpStep = jumpStepConst
                                        isRollBack = true;
                                    }
                                    clearTimeout(timeOutId)
                                    currentStep = 0;
                                    startCIC += jumpStep;
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
                                        var currentdate = new Date();
                                        var createDate = `${currentdate.getFullYear()}-${currentdate.getMonth()}-${currentdate.getDate()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`

                                        dbData.push([
                                            document.querySelector('#pt1\\:r1\\:0\\:txttenkh\\:\\:content').value,
                                            document.querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content').value,
                                            document.querySelector('#pt1\\:r1\\:0\\:txtcmnd\\:\\:content').value,
                                            document.querySelector('#pt1\\:r1\\:0\\:txtdiachi\\:\\:content').value,
                                            description,
                                            cicDate,
                                            document.querySelector('#pt1\\:r1\\:0\\:txtdienthoai\\:\\:content').value,
                                            1,
                                            createDate,
                                            null
                                        ])

                                        currentStep++
                                        nodeAdded = false
                                    }

                                    //oldData = newData                                    
                                }
                            }
                            catch (error) {
                                //console.log(error)
                                clearTimeout(timeOutId)
                                reportError(error, startCIC, 3, "")
                                currentStep = 0;
                                startCIC++;
                            }
                        }
                    }
                    else {
                        //console.log("step 4")
                        clearTimeout(timeOutId)
                        if (count >= maxRecords) {
                            localStorage.setItem("isAutoStart", false)
                            if (!sendToDb) {
                                clearInterval(intervalId)
                                sendToDb = true
                                browser.runtime.sendMessage({ data: { action: "SAVE_TO_DATABASE", payload: { dbData: dbData } } }, function (result) {
                                    isStart = false
                                    //console.log(result.numrows)
                                    localStorage.clear()
                                    location.reload(true)
                                });
                            }
                        }
                        else if (count % 10 == 0) {
                            if (!sendToDb) {
                                sendToDb = true
                                let isResponse = false

                                //time out handle database error
                                setTimeout(() => {
                                    if (!isResponse) {
                                        currentStep = 0;
                                        //currentCICIndex++
                                        startCIC += jumpStep
                                        localStorage.setItem("currentCIC", startCIC)
                                        dbData = []
                                        count++
                                    }

                                }, 10000);
                                browser.runtime.sendMessage({ data: { action: "SAVE_TO_DATABASE", payload: { dbData: dbData } } }, function (result) {
                                    //console.log(result);
                                    saveToDBSuccess = result.status
                                    if (saveToDBSuccess == 0) {
                                        //console.log("save false", dbData)
                                    }
                                    saveToDBSuccess = -1
                                    currentStep = 0;
                                    //currentCICIndex++
                                    startCIC += jumpStep
                                    localStorage.setItem("currentCIC", startCIC)
                                    dbData = []
                                    count++
                                });
                            }

                        }
                        else {
                            count++
                            currentStep = 0;
                            startCIC = startCIC + jumpStep
                        }
                    }
                }, 500);

            }
        })

}

function reportError(error, cicNo, step, rawData) {
    const errorMessage = error.message
    browser.runtime.sendMessage({ data: { action: "REPORT_ERROR", payload: { message: errorMessage, cic: cicNo, step: step, rawData: rawData } } }, function (result) {
        //console.log("errorSaved")
    });
}