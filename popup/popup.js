'use strict';

// Tab functionality

const openTab = tabName => event => {
  var i, x, tablinks;
  x = document.getElementsByClassName("content-tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" is-active", "");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " is-active";
}

document.addEventListener('DOMContentLoaded', function() {
  // Add click listeners to tabs
  var i, x, tablinks;
  x = document.getElementsByClassName("content-tab");
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener("click", openTab(tablinks[i].title))
  }
  // Hide all tabs except the first
  for (i = 1; i < x.length; i++) {
    x[i].style.display = "none";
  }
  for (i = 1; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" is-active", "");
  }
});

/*
 * Settings functionality
 */

// Toggle buttons
const toggleProperty = property => event => {
  chrome.storage.local.set({
    [property.id]: event.target.checked
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Add change listeners to switches
  var i, x;
  x = document.getElementsByClassName("switch");
  for (i = 0; i < x.length; i++) {
    x[i].addEventListener("change", toggleProperty(x[i]))
  }
  // Set initial checked state from storage
  chrome.storage.local.get([].map.call(x, el => el.id), (res) => {
    if (res) {
      for (i = 0; i < x.length; i++) {
        x[i].checked = res[x[i].id]
      }
    }
  })
});

document.addEventListener('DOMContentLoaded', function() {
  // Add change listeners to main switch
  var x = document.getElementById("main-toggle");
  x.addEventListener("change", toggleProperty(x));
  // Set initial checked state from storage
  chrome.storage.local.get([x.id], (res) => {
    if (res) {
      x.checked = res[x.id]
    }
  })
});

// Selection dropdowns

const selectProperty = property => event => {
  chrome.storage.local.set({
    [property.id]: event.target.value
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Add change listeners to selectors
  var i, x;
  x = document.querySelectorAll("select");
  for (i = 0; i < x.length; i++) {
    x[i].addEventListener("change", selectProperty(x[i]))
  }
  // Set initial select state from storage
  chrome.storage.local.get([].map.call(x, el => el.id), (res) => {
    if (res) {
      for (i = 0; i < x.length; i++) {
        x[i].value = res[x[i].id || 'disabled']
      }
    }
  })
});

// Action buttons

const actionEvent = action => event => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { [action.id]: true });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Add change listeners to switches
  var i, x;
  x = document.querySelectorAll("button");
  for (i = 0; i < x.length; i++) {
    x[i].addEventListener("click", actionEvent(x[i]))
  }
});

// Feed hide by keywords

const feedKeywordList = [
  "Be the first to comment",
  "Be the first to react",
  "New post in",
  "Jobs recommended for you"
]

const feedKeywords = document.querySelector('input[id=hide-by-keywords]');
const feedTagify = new Tagify(feedKeywords, {
  whitelist: feedKeywordList,
  dropdown: {
    position: "input",
    enabled: 0,
    placeAbove: true,
  },
  originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(', ')
})

function onChange(e) {
  chrome.storage.local.set({ 'feed-keywords': e.target.value }, () => {});
}
feedKeywords.addEventListener('change', onChange)

window.onload = function() {
  chrome.storage.local.get('feed-keywords', function(res) {
    feedTagify.addTags(res['feed-keywords']);
  });
};