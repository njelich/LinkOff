'use strict';

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
      enabled : 0
    },
    originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(', ')
  })
  
function onChange(e){
    chrome.storage.local.set({'keywords': e.target.value}, () => {});
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
const newsSwitch = document.getElementById("news-switch");

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

newsSwitch.addEventListener('change', () => {
    if (newsSwitch.checked) {
        chrome.storage.local.set({ 'news': true });
    } else {
        chrome.storage.local.set({ 'news': false });
    }
});

