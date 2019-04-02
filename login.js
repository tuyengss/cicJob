var loadfunction = window.onload;
browser.runtime.sendMessage({data:{action:"BEGIN_LOGIN",payload:{}}}, function(result) {
})

window.onload = function(event){
    //enter here the action you want to do once loaded
    if(loadfunction) loadfunction(event);
    setInterval(function(){
        if (document.querySelector("#__af_Z_window")){
            if (//document.querySelector("#__af_Z_window").textContent.replace(/\s/g,'').indexOf("PageExpiredThepagehasexpired.ClickOKtocontinue.OKCancel") >=0 ||
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g,'').indexOf("ExpirationWarningThispagewillexpireunlessaresponseisreceivedwithin2minutes.ClickOKtopreventexpiration.OKCancel") >= 0
            ){
                document.querySelector('#j_id24\\:\\:ok').click()
            }
            else if (document.querySelector("#__af_Z_window").textContent.replace(/\s/g,'').indexOf("PageExpiredThepagehasexpired.ClickOKtocontinue.OKCancel") >=0){
                location.reload()
            }
        }        
    },1000)
    const data = {username:"creditscore", password:"credit4vn6789!"}
const loginUrl = "https://cic.org.vn/ACBBox-CIC-External/faces/Login?lang=vn"
const imageCanvas = document.createElement("canvas")
var c = document.body.insertAdjacentElement("beforeend",imageCanvas)
var ctx = c.getContext("2d");
//var img = document.querySelector("#pt1\\:r1\\:0\\:i1");
var img = document.querySelector("#pt1\\:i1");
ctx.drawImage(img, 0, 0);
var imgData = ctx.getImageData(0, 0, c.width, c.height);
ctx.putImageData(imgData, 0, 0);
data.captchafile = c.toDataURL()
console.log(c.toDataURL())
browser.runtime.sendMessage({data:{action:"BREAK_CAPTCHA",payload:{bodyData:data}}}, function(result) {
    //console.log(result);
    if (result.captchaText){
        const taskId = result.taskId
        const idElem = document.querySelector("#pt1\\:it1\\:\\:content")
        const passElem = document.querySelector("#pt1\\:it2\\:\\:content")
        const captchaElem = document.querySelector("#pt1\\:it3\\:\\:content")
        idElem.value = "h79809001thao1"
        passElem.value = "79809001thao1"
        captchaElem.value = result.captchaText
        const btnElem = document.querySelector("#pt1\\:cb1")
        btnElem.click()
        const checkLoginInterval = setInterval(function(){
            const a = document.querySelector("#d1\\:\\:msgDlg")
            if (a&& !!( a.offsetWidth || a.offsetHeight || a.getClientRects().length)){                
                const msgContent = a.textContent.replace(/\s/g,'')
				if (msgContent.indexOf("Failedtoconnecttoserver") >=0){					
					browser.runtime.sendMessage({data:{action:"CIC_SERVER_ERROR",payload:{taskId:taskId}}}, function(result) {
						a.querySelector('#d1\\:\\:msgDlg\\:\\:cancel').click()
						btnElem.click()                        
						
                    });
				}
				else if (msgContent.indexOf("ErrorMãkiểmtrakhôngchínhxác.OK") >=0){
					clearInterval(checkLoginInterval)
                    browser.runtime.sendMessage({data:{action:"WRONG_CAPTCHA",payload:{taskId:taskId}}}, function(result) {
                        console.log(result)
                        location.reload();
                    });
				}
                
            }
        }, 2000)
    }
    
});



}

/*
browser.runtime.sendMessage({data:{action:"DO_CIC_LOGIN",payload:{bodyData:data}}}, function(result) {
    console.log(result);
});
*/