chrome.runtime.onMessage.addListener(function(request, sender) {
	var image;
	if(request.redirect){
		//handle normal images
		redirectForUrl(request.redirect);
	}else if(request.data){
		//handle data:uris
		var dataURI = request.data.substring(request.data.indexOf(",")+1);

		base64Image(dataURI).then(function(imageUrl){
			redirectForUrl(imageUrl);
		}).catch(function(e){});
	}else if(request.link){
		//handle hyperlinks
		if((/(imgurl=)/).test(request.link)){
			//google image
			//parse the URL
			var parser = document.createElement('a');
			parser.href = request.link;
			//get the query string
			var queryString = parser.search;
			var queryStringObject = queryStringToObject(queryString);
			if(queryStringObject.imgurl){
				redirectForUrl(decodeURIComponent(queryStringObject.imgurl))
			}else{
				//google is funny.
				//no need to decode this URL
				var imgurl = parser.search.substring(parser.search.indexOf('imgurl=')+7);
				imgurl = imgurl.split('&');
				imgurl = imgurl[0];
				redirectForUrl(imgurl);
			}
		}else{
			//figure out how to get the img
			image = document.querySelector("[href='"+request.link+"'] img");
			if(image){
				//we have a link with an img, test if we can use the URL from the img
				redirectForImage(image);
			}else{
				//this is a dummy hyperlink, try to find the image from the parent
				var link = document.querySelector("[href='"+request.link+"']");
				if(link){
					findChildForLink(link);
				}else{
					//we have a full link URL but the page uses a relative or absolute link instead
					var relativeLink = request.link.split('/').slice(3).join('/');
					link = document.querySelector("[href='"+relativeLink+"']") || document.querySelector("[href='/"+relativeLink+"']");
					if(link){
						findChildForLink(link);
					}
				}
			}		
		}
	}
});

function queryStringToObject(qs){
	qs = qs.substring(1);
	var qsObj = {};
	try{
		qsObj = JSON.parse('{"' + decodeURI(qs).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	}catch(e){}
	return qsObj;
}

function findChildForLink(link){
	//try to find an article tag
	var article = link.closest("article");
	var image;
	if(article){
		//must be an iStock/Getty link
		image = article.querySelector("img");
		if(image){
			redirectForImage(image);
		}
	}else{
		//try to find an li instead
		var li = link.closest("li");
		if(li){
			image = li.querySelector("img");
			if(image){
				redirectForImage(image);
			}
		} //otherwise do nothing
	}
}

function redirectForImage(image){
	window.open(iStockSettings.istockUrl+btoa(image.src), '_blank');
}

function redirectForUrl(url){
	var image = new Image();
	image.src = url
	redirectForImage(image);
}

function base64Image(dataURI){
	return new Promise(function(resolve, reject){
		var xhr;
		function handleStateChange(){
			if (xhr.readyState === XMLHttpRequest.DONE){
				if(xhr.status === 200) {
					try{
						var response = JSON.parse(xhr.responseText);
						resolve(response.data.link);
					}catch(e){
						reject();
					}
				}else{
					reject();
				}
			}
		}

		xhr = new XMLHttpRequest();
		var fd = new FormData();
		fd.append('image', dataURI);
		xhr.onreadystatechange = handleStateChange;
		xhr.open("POST", iStockSettings.imgurURL, true);
		xhr.setRequestHeader("Authorization", "Client-ID "+iStockSettings.imgurClientID);
		xhr.send(fd);
	});
}
