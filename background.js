// Set defaults on install.

chrome.storage.local.get(null, function (res) {
  if (res.initialized !== "v0.5")
    chrome.storage.local.set({
      initialized: "v0.5",
      "hide-account-building": false,
      "hide-advertisements": true,
      "hide-by-age": "week",
      "hide-by-companies": true,
      "hide-by-people": false,
      "hide-commented-on": false,
      "hide-follow-recommendations": true,
      "hide-followed": true,
      "hide-community-panel": true,
      "hide-images": false,
      "hide-linkedin-learning": true,
      "hide-links": false,
      "hide-polls": true,
      "hide-premium": true,
      "hide-promoted": true,
      "hide-shared": false,
      "hide-videos": false,
      "hide-whole-feed": false,
      "hide-liked": true,
      "hide-other-reactions": false,
      "main-toggle": true,
      "sort-by-recent": true,
    });
});

// Fetch login cookie

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if(request.name=="fetchLiAt") {
    fetchLiAtCookie(request.data.accountList, request.data.name)
  }
  sendResponse("Got login cookie");
});

async function fetchLiAtCookie(accountList, name) {
  chrome.cookies.getAll({ domain: "linkedin.com", name: "li_at" },cookie => {
    console.log(cookie[0].value != accountList[name])
    if (accountList[name] != cookie[0].value) {
      const accounts = accountList;
      accounts[name] = cookie[0].value
      console.log(accounts)
      chrome.storage.local.set({
        "account-list": accounts,
      });
    }
  })
}
