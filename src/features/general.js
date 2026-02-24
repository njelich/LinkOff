import { WIDE_MODE_SELECTOR } from '../constants.js'


const handleWideMode = (checkNeedUpdate) => {
  const wideModeDiv = document.querySelector(WIDE_MODE_SELECTOR)

  if (checkNeedUpdate('wide-mode', true)) {
    wideModeDiv?.classList.add('wide-mode')
  } else if (checkNeedUpdate('wide-mode', false)) {
    wideModeDiv?.classList.remove('wide-mode')
  }
}

export default (checkNeedUpdate) => {
  handleWideMode(checkNeedUpdate)
}
