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
  // Add change listeners to switches
  var i, x;
  x = document.querySelectorAll("select");
  for (i = 0; i < x.length; i++) {
    x[i].addEventListener("change", selectProperty(x[i]))
  }
  // Set initial checked state from storage
  chrome.storage.local.get([].map.call(x, el => el.id), (res) => {
    if (res) {
      for (i = 0; i < x.length; i++) {
        x[i].value = res[x[i].id || 'disabled']
      }
    }
  })
});


// Keywords

const keywordList = [
  "Be the first to comment",
  "Be the first to react",
  "New post in",
]

const keywordSelector = document.querySelector('input[id=keyword-selector]');
const keywordTagify = new Tagify(keywordSelector, {
  whitelist: keywordList,
  dropdown: {
    position: "input",
    enabled: 0,
    placeAbove: true,
  },
  originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(', ')
})

function onChange(e) {
  chrome.storage.local.set({ 'keywords': e.target.value }, () => {});
}
keywordSelector.addEventListener('change', onChange)

window.onload = function() {
  chrome.storage.local.get('keywords', function(res) {
    keywordTagify.addTags(res.keywords);
  });
};