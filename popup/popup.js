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

// Settings functionality

const toggleProperty = property => event => {

}


// Keywords

const keywordList = [
  "Promoted",
  "Poll",
  "following",
  "likes this",
  "commented on this",
  "loves this",
  "finds this insightful",
  "celebrates this",
  "is curious about this",
  "Be the first to comment",
  "Be the first to react",
  "New post in",
]

const keywordSelector = document.querySelector('input[id=keyword-selector]');
const keywordTagify = new Tagify(keywordSelector, {
  whitelist: keywordList,
  dropdown: {
    position: "input",
    enabled: 0
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

// Switches

const masterSwitch = document.getElementById("master-switch");
const feedSwitch = document.getElementById("feed-switch");
const learningSwitch = document.getElementById("learning-switch");
const adsSwitch = document.getElementById("ads-switch");
const wipeMessage = document.getElementById("msg-button");

chrome.storage.local.get(['master', 'feed', 'learning', 'ads', 'news'], (res) => {
  if (res) {
    masterSwitch.checked = res.master;
    feedSwitch.checked = res.feed;
    learningSwitch.checked = res.learning;
    adsSwitch.checked = res.ads;
    newsSwitch.checked = res.news;
  }
})

masterSwitch.addEventListener('change', () => {
  if (masterSwitch.checked) {
    chrome.storage.local.set({ 'master': true });
  } else {
    chrome.storage.local.set({ 'master': false });
  }
});

feedSwitch.addEventListener('change', () => {
  if (feedSwitch.checked) {
    chrome.storage.local.set({ 'feed': true });
  } else {
    chrome.storage.local.set({ 'feed': false });
  }
});

learningSwitch.addEventListener('change', () => {
  if (learningSwitch.checked) {
    chrome.storage.local.set({ 'learning': true });
  } else {
    chrome.storage.local.set({ 'learning': false });
  }
});

adsSwitch.addEventListener('change', () => {
  if (adsSwitch.checked) {
    chrome.storage.local.set({ 'ads': true });
  } else {
    chrome.storage.local.set({ 'ads': false });
  }
});

wipeMessage.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { wipeMessages: true });
  });
});