// A generic onclick callback function.
function genericOnClick(info, tab) {
	var imageUrl = info.srcUrl;
	var linkUrl = info.linkUrl;
	var messageObj;

	if (imageUrl)
	{
		if(imageUrl.indexOf("data:") > -1){
			messageObj = {data: imageUrl};
		}else{
			messageObj = {redirect: imageUrl};
		}
	}
	else if(linkUrl) {
		messageObj = {link: linkUrl};
	}

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, messageObj, function(response) {
	   
	  });
	});
}

var parent = chrome.contextMenus.create({"title": "Search on istock", "contexts": ["image", "link"], "onclick": genericOnClick});
