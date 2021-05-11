// Set defaults on install.

chrome.storage.local.get(null, function(res) {
    console.log(res)
    if(!res.initialized) chrome.storage.local.set({
        "initialized": true, 
        "hide-account-building": false,
        "hide-advertisements": true,
        "hide-by-age": "week",
        "hide-by-companies": true,
        "hide-by-people": false,
        "hide-commented-on": false,
        "hide-follow-recommendations": true,
        "hide-followed": true,
        "hide-groups-events-hashtags": true,
        "hide-images": false,
        "hide-linkedin-learning": true,
        "hide-links": false,
        "hide-notifications": false,
        "hide-polls": true,
        "hide-premium": true,
        "hide-promoted": true,
        "hide-shared": false,
        "hide-videos": false,
        "hide-whole-feed": false,
        "hide-with-reactions": true,
        "main-toggle": true,
        "sort-by-recent": true,
    })
  });