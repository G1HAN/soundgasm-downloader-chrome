chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (request.urls) {
    const urls = request.urls;

    for (const url of urls) {

      await chrome.tabs.create({url: url, selected: false, pinned: false}, myTab => {
        function listener(tabId, changeInfo, tab) {
            // make sure the status is 'complete' and it's the right tab
            if (tabId === myTab.id && changeInfo.status == 'complete') {
                chrome.scripting.executeScript({
                  target : {tabId: tab.id, allFrames: true},
                  files: ["/content-scripts/injected-download.js"],
                })
                .then((result)=>{
                  setTimeout(() => {
                    chrome.tabs.remove(tabId)
                    chrome.tabs.onUpdated.removeListener(listener);
                  }, 100);

                })
            }
        };
        chrome.tabs.onUpdated.addListener(listener);
    });        

    }
    return true;
  }

  const url = request.url;
  const title = request.title
    .replace(/[^a-z0-9-.'!]/gi, "_")
    .replace(/_+/g, "_");
  const filename = `${request.author} - ${title}.m4a`;
  const id = sender.tab.id;
  chrome.downloads
    .download({
      url,
      filename,
    })
    .catch(console.error)

});
