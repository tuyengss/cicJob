browser.runtime.sendMessage({ data: { action: "SET_CIC_TAB", payload: {} } }, function (result) {
    console.log(result)
});
let isError = false
const checkExpire = setInterval(() => {
    if (document.querySelector("#__af_Z_window")) {
        if (
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("ExpirationWarningThispagewillexpireunlessaresponseisreceivedwithin2minutes.ClickOKtopreventexpiration.OKCancel") >= 0
        ) {
            isError = true
            document.querySelector("#__af_Z_window").querySelector('button').click()
        }
        else if (
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("Cólỗitrongquátrìnhxửlý,hãyliênhệvớiquảntrịhệthốngđểđượchỗtrợxửlý!") >= 0 ||
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("ErrorMãkiểmtrakhôngchínhxác.OK") >= 0 ||
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("ACBBoxYourCaptchacodeiswrong.YourCaptchacodeiswrong.OK") >= 0 ||
            document.querySelector("#__af_Z_window").textContent.replace(/\s/g, '').indexOf("PageExpiredThepagehasexpired.ClickOKtocontinue.OKCancel") >= 0
        ) {
            isError = true
            location.reload()
        }
    }
    browser.runtime.sendMessage({ data: { action: "SEND_S37_STATE", payload: { status: isError ? 0 : 1 } } }, function (result) {
    });

}, 5000);



let isAddObserve = false
function execStep0(job) {
    
    const maCicElem = document.querySelector('#pt1\\:r1\\:0\\:txtmacic\\:\\:content')

    maCicElem.dispatchEvent(new Event('focus'))
    maCicElem.value = job.cic
    maCicElem.dispatchEvent(new Event('change'))
    maCicElem.dispatchEvent(new Event('blur'))

    const captchaElem = document.querySelector('#pt1\\:r1\\:0\\:it3\\:\\:content')
    captchaElem.dispatchEvent(new Event('focus'))
    captchaElem.value = captchaCode;
    captchaElem.dispatchEvent(new Event('change'))
    captchaElem.dispatchEvent(new Event('blur'))
    
    const xemButtonElem = document.querySelector('#pt1\\:r1\\:0\\:btnhotrotimkiem')
    if (xemButtonElem) {
        xemButtonElem.click()
    }

}