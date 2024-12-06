'use strict'

const src = chrome.runtime.getURL('src/index.js')

// We dynamically import files to be able to use ES6 modules
// Remember to add imported files to web_accessible_resources
import(src)
