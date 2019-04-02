let currentState = document.querySelectorAll("input")[11].value
let formAction = document.querySelector("#f1").getAttribute("action")
let step = 0
setInterval(() => {
    if (step == 0){
        xemBaoCao()
    }
    else if (step == 1){
        let data = {
            'pt1:r1:j_id22':'',
            'pt1:r1:0:txtmacic':7935300028,
            'pt1:r1:0:txtdkkd':'',
            'pt1:r1:0:txtcmnd':'',
            'pt1:r1:0:txttenkh':'',
            'pt1:r1:0:txtdiachi':'',
            'pt1:r1:0:txtdienthoai':'',
            'pt1:r1:0:txtmsthue':'',
            'pt1:r1:0:txttgd':'',
            'pt1:r1:0:it3':'hwex4',
            'org.apache.myfaces.trinidad.faces.FORM':'f1',
            'javax.faces.ViewState':currentState,
            'event':'pt1:r1:0:it3',
            'event.pt1:r1:0:it3':`<m+xmlns="http://oracle.com/richClient/comm"><k+v="autoSubmit"><b>1</b></k><k+v="suppressMessageShow"><s>true</s></k><k+v="type"><s>valueChange</s></k></m>`,
            'oracle.adf.view.rich.PROCESS':'pt1:r1:0:it3'
        }
        fetch("https://cic.org.vn" + formAction, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(data), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/text'
                    }
                })
                    .then(async (response) => {
                        console.log("response")
                        return response.text()
            
                    })
                    .then(str => (new window.DOMParser()).parseFromString(str, "text/html"))
                    .then(data => {
                        console.log(data.querySelectorAll("input"))
                        currentState = data.querySelectorAll("input")[11].value                        
                    })
                    .catch(function (error) {
                        console.log(error);
                        //sendResponse({status:0})
                    });
    }
    else if (step == 2){
        let data = {
            'pt1:r1:j_id22':'',
            'pt1:r1:0:txtmacic':7935300028,
            'pt1:r1:0:txtdkkd':'',
            'pt1:r1:0:txtcmnd':'',
            'pt1:r1:0:txttenkh':'',
            'pt1:r1:0:txtdiachi':'',
            'pt1:r1:0:txtdienthoai':'',
            'pt1:r1:0:txtmsthue':'',
            'pt1:r1:0:txttgd':'',
            'pt1:r1:0:it3':'hwex4',
            'org.apache.myfaces.trinidad.faces.FORM':'f1',
            'javax.faces.ViewState':currentState,
            'event':'pt1:r1:0:confirmXemBaoCao',
            'event.pt1:r1:0:confirmXemBaoCao':`<m+xmlns="http://oracle.com/richClient/comm"><k+v="launchId"><s>pt1:r1:0:btnhotrotimkiem</s></k><k+v="suppressMessageClear"><s>true</s></k><k+v="type"><s>fetch</s></k></m>`,
            'oracle.adf.view.rich.PROCESS':'pt1:r1:0:confirmXemBaoCao'
        }
        fetch("https://cic.org.vn" + formAction, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(data), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/text'
                    }
                })
                    .then(async (response) => {
                        console.log("response")
                        return response.text()
            
                    })
                    .then(str => (new window.DOMParser()).parseFromString(str, "text/html"))
                    .then(data => {
                        console.log(data.querySelectorAll("input"))
                        currentState = data.querySelectorAll("input")[11].value                        
                    })
                    .catch(function (error) {
                        console.log(error);
                        //sendResponse({status:0})
                    });        
    }
    else if (step == 3){
        let data = {
            'pt1:r1:j_id22':'',
            'pt1:r1:0:txtmacic':7935300028,
            'pt1:r1:0:txtdkkd':'',
            'pt1:r1:0:txtcmnd':'',
            'pt1:r1:0:txttenkh':'',
            'pt1:r1:0:txtdiachi':'',
            'pt1:r1:0:txtdienthoai':'',
            'pt1:r1:0:txtmsthue':'',
            'pt1:r1:0:txttgd':'',
            'pt1:r1:0:it3':'hwex4',
            'org.apache.myfaces.trinidad.faces.FORM':'f1',
            'javax.faces.ViewState':currentState,

            'oracle.adf.view.rich.RENDER':'pt1:r1',
            'oracle.adf.view.rich.DELTAS':'{pt1:r1:0:confirmXemBaoCao={_shown=pt1:r1:0:confirmXemBaoCao}}',
            'event':'pt1:r1:0:tnYes',
            'event.pt1:r1:0:tnYes':'<m+xmlns="http://oracle.com/richClient/comm"><k+v="type"><s>action</s></k></m>',
            'oracle.adf.view.rich.PROCESS':'pt1:r1:0:confirmXemBaoCao'
        }
        fetch("https://cic.org.vn" + formAction, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(data), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/text'
                    }
                })
                    .then(async (response) => {
                        console.log("response")
                        return response.text()
            
                    })
                    .then(str => (new window.DOMParser()).parseFromString(str, "text/html"))
                    .then(data => {
                        console.log(data.querySelectorAll("input"))
                        currentState = data.querySelectorAll("input")[11].value                        
                    })
                    .catch(function (error) {
                        console.log(error);
                        //sendResponse({status:0})
                    });        
    }
}, 2000);

function makeRequest(data){
    
}

function xemBaoCao(){

    let data = {        
        "pt1:r1:j_id22":"",
        "pt1:r1:0:txtmacic":7935300028,
        "pt1:r1:0:txtdkkd": "",
        "pt1:r1:0:txtcmnd":"",
        "pt1:r1:0:txttenkh":"",
        "pt1:r1:0:txtdiachi":"",
        "pt1:r1:0:txtdienthoai":"",
        "pt1:r1:0:txtmsthue":"",
        "pt1:r1:0:txttgd":"",
        "pt1:r1:0:it3":"",
        "org.apache.myfaces.trinidad.faces.FORM":"f1",
        "javax.faces.ViewState":currentState,
        "event=pt1:r1:0:txtmacic":"",
        "event.pt1:r1:0:txtmacic":`<m+xmlns="http://oracle.com/richClient/comm"><k+v="autoSubmit"><b>1</b></k><k+v="suppressMessageShow"><s>true</s></k><k+v="type"><s>valueChange</s></k></m>`,
        "oracle.adf.view.rich.PROCESS":"pt1:r1:0:txtmacic"
                }
                fetch("https://cic.org.vn" + formAction, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(data), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/text'
                    }
                })
                    .then(async (response) => {
                        console.log("response")
                        return response.text()
            
                    })
                    .then(str => (new window.DOMParser()).parseFromString(str, "text/html"))
                    .then(data => {
                        console.log(data.querySelectorAll("input"))
                        currentState = data.querySelectorAll("input")[11].value                        
                    })
                    .catch(function (error) {
                        console.log(error);
                        //sendResponse({status:0})
                    });
}
/*pt1:r1:j_id22
pt1:r1:0:txtmacic=7935300028
pt1:r1:0:txtdkkd
pt1:r1:0:txtcmnd
pt1:r1:0:txttenkh
pt1:r1:0:txtdiachi
pt1:r1:0:txtdienthoai
pt1:r1:0:txtmsthue
pt1:r1:0:txttgd
pt1:r1:0:it3=hwex4
org.apache.myfaces.trinidad.faces.FORM=f1
javax.faces.ViewState=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
event=pt1:r1:0:it3
event.pt1:r1:0:it3=<m+xmlns="http://oracle.com/richClient/comm"><k+v="autoSubmit"><b>1</b></k><k+v="suppressMessageShow"><s>true</s></k><k+v="type"><s>valueChange</s></k></m>
oracle.adf.view.rich.PROCESS=pt1:r1:0:it3

pt1:r1:j_id22
pt1:r1:0:txtmacic=7935300028
pt1:r1:0:txtdkkd
pt1:r1:0:txtcmnd
pt1:r1:0:txttenkh
pt1:r1:0:txtdiachi
pt1:r1:0:txtdienthoai
pt1:r1:0:txtmsthue
pt1:r1:0:txttgd
pt1:r1:0:it3=hwex4
org.apache.myfaces.trinidad.faces.FORM=f1
javax.faces.ViewState=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
event=pt1:r1:0:confirmXemBaoCao
event.pt1:r1:0:confirmXemBaoCao=<m+xmlns="http://oracle.com/richClient/comm"><k+v="launchId"><s>pt1:r1:0:btnhotrotimkiem</s></k><k+v="suppressMessageClear"><s>true</s></k><k+v="type"><s>fetch</s></k></m>
oracle.adf.view.rich.PROCESS=pt1:r1:0:confirmXemBaoCao

pt1:r1:j_id22
pt1:r1:0:txtmacic=7935300028
pt1:r1:0:txtdkkd
pt1:r1:0:txtcmnd
pt1:r1:0:txttenkh
pt1:r1:0:txtdiachi
pt1:r1:0:txtdienthoai
pt1:r1:0:txtmsthue
pt1:r1:0:txttgd
pt1:r1:0:it3=hwex4
org.apache.myfaces.trinidad.faces.FORM=f1
javax.faces.ViewState=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
oracle.adf.view.rich.RENDER=pt1:r1
oracle.adf.view.rich.DELTAS={pt1:r1:0:confirmXemBaoCao={_shown=pt1:r1:0:confirmXemBaoCao}}
event=pt1:r1:0:tnYes
event.pt1:r1:0:tnYes=<m+xmlns="http://oracle.com/richClient/comm"><k+v="type"><s>action</s></k></m>
oracle.adf.view.rich.PROCESS=pt1:r1:0:confirmXemBaoCao*/