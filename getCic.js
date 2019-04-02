browser.runtime.sendMessage({ data: { action: "SET_CMND_TAB", payload: {} } }, function (result) {
    //console.log(result)
});
browser.runtime.sendMessage({ data: { action: "SEND_GET_CIC_STATE", payload: {status:0} } }, function (result) {    
});    
let loadfunction = window.onload;
let job = {}
let isStop = false
let checkSessionTimeout = null
var focusEvent = new Event('focus'),
changeEvent = new Event('change'),
blurEvent = new Event('blur')
function getCommand(){
	//console.log('get command')
    browser.runtime.sendMessage({ data: { action: "GET_COMMAND", payload: {} } }, function (result) {        
        if (result.status == 1){
            job = result.job
            console.log('job', job)

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
            

            browser.runtime.sendMessage({ data: { action: "BREAK_CAPTCHA", payload: { bodyData: data } } }, function (bcResult) {
                if (bcResult.captchaText) {
                    console.log("get captcha complete, .................")
                    var captchaElem = document.querySelector('#pt1\\:r1\\:0\\:it3\\:\\:content')
                    console.log(captchaElem)
                    captchaElem.dispatchEvent(focusEvent)
                    captchaElem.value = bcResult.captchaText;
                    captchaElem.dispatchEvent(changeEvent)
                    captchaElem.dispatchEvent(blurEvent)

                    
                    
                    getCic(job)
                }
            })               
        }
        else{
            setTimeout(getCommand, 2000);
        }        
    });
}
let errorMessage = ''
window.onload = function (event) {
    loadfunction && loadfunction()
    var targetNode = document.documentElement;


    

    // Options for the observer (which mutations to observe)
    var config = { attributes: false, childList: true, subtree: true };


    // Callback function to execute when mutations are observed
    let count  = 0
    var callback = function (mutationsList, observer) {
        /*//console.log('mutation call: ' + count + " times ...............")
        count++*/
        if (isStop) {
			
			return
		}
        let isExpire = false
        let isError = false
        let isResultReady = false
        let isNotFound = false
        let cicNo = ''
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList' || mutation.type == 'subtree') {
				
                for (var i = 0; i < mutation.addedNodes.length; i++) {
					//console.log(mutation.addedNodes[i].id)
					
                    if (mutation.addedNodes[i].id != 'pt1:r1:0:popup::content' && mutation.addedNodes[i].id.indexOf('pt1:r1:0:popup::') >= 0 && mutation.addedNodes[i].textContent.replace(/\s/g,'').indexOf("ACBBoxKếtquảtìmkiếmKhôngcóhồsơnàothỏamãnđiềukiệntìmkiếm.OK")>=0){
                        //console.log(mutation.addedNodes[i].id)              
                        isNotFound = true
                        mutation.addedNodes[i].querySelector('button').click()
						//clearTimeout(checkSessionTimeout)
                    }
                    if (mutation.addedNodes[i].textContent.replace(/\s/g,'').indexOf("ExpirationWarningThispagewillexpireunlessaresponseisreceivedwithin2minutes.ClickOKtopreventexpiration.OKCancel")>=0){
                        //console.log(mutation.addedNodes[i].id)              
                        //console.log('expire  ...............')
                        isExpire = true
                        mutation.addedNodes[i].querySelector('button').click()
                    }
                    else if (mutation.addedNodes[i].textContent.replace(/\s/g,'').indexOf("PageExpiredThepagehasexpired.ClickOKtocontinue.OKCancel")>=0){
                        //console.log(mutation.addedNodes[i].id)              
                        isError = true
                        location.reload()
                    }
                    if (mutation.addedNodes[i].className == "xpg" && mutation.addedNodes[i].id == "pt1:r1") {
                        if (mutation.addedNodes[i].querySelectorAll('td[class="x10j"]').length > 0){
                            if (mutation.addedNodes[i].querySelectorAll('td[class="x10j"]')[0].innerText){
                                isResultReady = true
                                cicNo = mutation.addedNodes[i].querySelectorAll('td[class="x10j"]')[0].innerText
								//clearTimeout(checkSessionTimeout)
                            }

                        }
                    }
                }
            }
        }
        if (isError) {
            isStop = true            
            job.cic = ''
            //job.detail = []
            job.code = 500
            browser.runtime.sendMessage({ data: { action: "SEND_CIC_DETAIL", payload: { job: job } } }, function (result) {
                location.reload()
            });
            location.reload()
        }        
        else{
            if (isNotFound) {
                job.cic = ''
                //job.detail = []
                job.code = 202
                browser.runtime.sendMessage({ data: { action: "SEND_CIC_DETAIL", payload: { job: job } } }, function (result) {
                    //console.log("send_cic_detail ", result)
                    //setTimeout(getCommand, 2000);
                });
            }
            else if (isResultReady){
                job.cic = cicNo
                browser.runtime.sendMessage({ data: { action: "GET_CIC_DETAIL", payload: {job:job} } }, function (result) {
                    //console.log("begin get cic detail")
                });
            }            
        }
    };
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    browser.runtime.sendMessage({ data: { action: "SEND_GET_CIC_STATE", payload: {status:1} } }, function (result) {
        getCommand()        
    });    
}
let cicResult = ''
const alertHook = window.alert
let isCICSystemError = false
function getCic(job){
    console.log('start get CIC')
    const cmnd = job.cmnd
    return new Promise(function(resolve, reject){
		console.log("start get CIC")
		browser.runtime.sendMessage({ data: { action: "START_GET_CIC", payload: { job: job } } }, function (result) {				
			});
		/*window.alert = function (strMsg) {    
			//console.log(strMsg)
			//isStop = true
			errorMessage = strMsg

			browser.runtime.sendMessage({ data: { action: "NEED_RELOAD", payload: { job: job } } }, function (result) {
				location.reload()		
			});    
		}*/		
		checkSessionTimeout = setTimeout(function(){
			isCICSystemError = true
			//console.log('time out')
			//browser.runtime.sendMessage({ data: { action: "NEED_RELOAD", payload: { job: job } } }, function (result) {
			//});			
		}, 20000)
		
        document.querySelector('#pt1\\:r1\\:0\\:soc10\\:\\:content').selectedIndex = 0
        document.querySelector('#pt1\\:r1\\:0\\:strLoaiKH\\:\\:content').selectedIndex = 1
        document.querySelector('#pt1\\:r1\\:0\\:txtsocmt\\:\\:content').value = cmnd
        document.querySelector('#pt1\\:r1\\:0\\:btntimkiemkh').click()
		
		resolve()
    })
    
}

//getCic('010050254')

browser.runtime.onMessage.addListener(request => {    
    //console.log("Message from the background script:");	
    setTimeout(getCommand, 2000);
    return Promise.resolve({response: isCICSystemError});
  });
