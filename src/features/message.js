import { waitForClassName } from '../utils.js'

// Modified from https://gist.github.com/twhitacre/d4536183c22a2f5a8c7c427df04acc90
const selectMessagesForDeletion = async () => {
  const container = document.querySelector(
    '.msg-conversations-container__conversations-list'
  )

  if (!container) {
    alert(
      'No messages. Are you on the messaging page?\n\nIf not, please navigate to messaging using the LinkedIn navbar and then click the Select Messages for Deletion button again.'
    )
    return
  }

  async function loadAllMessages() {
    return await new Promise((resolve) => {
      let height = 0
      let attempts = 0
      if (container) {
        const interval = setInterval(() => {
          const { scrollHeight } = container
          if (scrollHeight > 20000) {
            clearInterval(interval)
            resolve()
          }
          if (scrollHeight === height) {
            if (attempts >= 3) {
              clearInterval(interval)
              resolve()
            } else {
              attempts++
            }
          }
          height = scrollHeight
          container.scrollTop = scrollHeight
        }, 1000)
      } else {
        alert('The page took too long to load. Please try again.')
      }
    })
  }
  await loadAllMessages()
  const labels = container.getElementsByTagName('label')
  for (let i = 0; i < labels.length; i++) {
    if (labels[i]) {
      labels[i].click()
    }
  }
  alert('Click the trash can icon at the top to delete all messages.')
}

// Add message selection button
export const setupDeleteMessagesButton = async () => {
  console.log('LinkOff: Waiting for Messages to load')

  await waitForClassName('msg-conversations-container__dropdown-container')
  const menuContainer = document.querySelector(
    '.msg-conversations-container__dropdown-container > div'
  )

  const observer = new MutationObserver(function () {
    const menu = menuContainer.querySelector('ul')
    if (!menu) return

    const selectMenuItem = document.createElement('div')

    selectMenuItem.classList.add(
      'artdeco-dropdown__item',
      'artdeco-dropdown__item--is-dropdown',
      'ember-view'
    )
    selectMenuItem.textContent = 'Select all for deletion (LinkOff)'

    selectMenuItem.onclick = function () {
      document
        .querySelector(
          '.msg-conversations-container__title-row button.artdeco-dropdown__trigger'
        )
        .click()
      selectMessagesForDeletion()
    }

    console.log('LinkOff: Adding "Select messages for deletion" button')

    menu.appendChild(selectMenuItem)
  })

  observer.observe(menuContainer, {
    attributes: false,
    childList: true,
    subtree: false,
    characterData: false,
  })
}
