//window.location.href = "https://cic.org.vn/ACBBox-CIC-External/faces/TaskFlow?FID=16181"
browser.runtime.sendMessage({ data: { action: "LOGIN_COMPLETE", payload: {  } } }, function (result) {	
	console.log('redirect page')
});    