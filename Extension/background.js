document.documentElement.setAttribute('extension-installed', true);
console.log("ext started");
chrome.tabs.create({url:'https://uriic.github.io/'},callback);
var examstatus="";
var returnval ="";
function getCookies(domain, name, callback) { 
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
             
            callback(cookie.value);
        }
    });
}

function setCookies(domain, name, value, callback) { 
        chrome.cookies.set({
            "name": name,
            "url": domain,
            "value": value.toString()
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
            console.log(chrome.extension.lastError);
            console.log(chrome.runtime.lastError);
        });
}

function setextCookies(domain, name, value, callback) { 
    chrome.cookies.set({
        "name": name,
        "url": domain,
        "value": value.toString(),
        "expirationDate": "Thu, 19 Dec 2999 12:00:00 UTC"
    }, function (cookie) {
        console.log(JSON.stringify(cookie));
        console.log(chrome.extension.lastError);
        console.log(chrome.runtime.lastError);
    });
}

function callback(data){
    setInterval(function()
    {
        console.log("enter callback");
        setextCookies("https://uriic.github.io/", "extstatus", "available" , function(id) {
                                     returnval=id;
                                });
        getCookies("https://uriic.github.io/", "examstatus", function(id) {
            examstatus = id;
        });
            if(examstatus == "start")
            {
                    chrome.windows.getAll({populate:true},function(windows){
                        windows.forEach(function(window){
                        window.tabs.forEach(function(tab){
                            var name = tab.title;
                            var chromeurl = tab.url;
                            if( ( 
                                    ((name).toUpperCase()).includes('SPECIAL') || 
                                    ((name).toUpperCase()).includes('HACKERRANK') ||
                                    ((chromeurl).toUpperCase()).includes('CHROME') 
                                ) == false)
                            {
                                console.log(tab.url);
                                console.log(tab.title);
                                console.log(examstatus);
                                setCookies("https://uriic.github.io/", "userstatus", "extblocked" , function(id) {
                                     returnval=id;
                                });
                                setCookies("https://uriic.github.io/", "examstatus", "extstop" , function(id) {
                                    returnval = id;
                                });
                                chrome.windows.getAll({}, function(windows){
                                    for(var i = 0; i < windows.length; i++)
                                      chrome.windows.remove(windows[i].id);
                                  });
                            }
                        });
                        });
                    });
            }
    },1000);
}
