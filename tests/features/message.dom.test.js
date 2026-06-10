// @vitest-environment jsdom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setupDeleteMessagesButton } from '../../src/features/message.js'

const CONVERSATIONS_LIST = '.msg-conversations-container__conversations-list'

const buildMessagingDOM = () => {
  document.body.innerHTML = `
    <div class="msg-conversations-container__dropdown-container">
      <div></div>
    </div>
    <div class="${CONVERSATIONS_LIST.slice(1)}"></div>
    <div class="msg-conversations-container__title-row">
      <button class="artdeco-dropdown__trigger"></button>
    </div>`
}

// Append a <ul> to the menu container and flush the MutationObserver microtask.
const addMenuAndGetButton = async () => {
  const menuContainer = document.querySelector(
    '.msg-conversations-container__dropdown-container > div'
  )
  const ul = document.createElement('ul')
  menuContainer.appendChild(ul)
  await new Promise((resolve) => queueMicrotask(resolve))
  return ul.querySelector('div')
}

const mockScrollHeight = (container, value) => {
  Object.defineProperty(container, 'scrollHeight', {
    get: () => value,
    configurable: true,
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(window, 'alert').mockImplementation(() => {})
  document.body.innerHTML = ''
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// setupDeleteMessagesButton — MutationObserver setup
// ---------------------------------------------------------------------------

describe('setupDeleteMessagesButton', () => {
  it('appends a "Select all for deletion" button inside the menu ul', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()

    const button = await addMenuAndGetButton()

    expect(button).not.toBeNull()
    expect(button.textContent).toContain('Select all for deletion')
  })

  it('does not add a button before the menu ul appears', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()

    const menuContainer = document.querySelector(
      '.msg-conversations-container__dropdown-container > div'
    )
    expect(menuContainer.querySelector('div')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// selectMessagesForDeletion — invoked via button onclick
// ---------------------------------------------------------------------------

describe('selectMessagesForDeletion', () => {
  it('alerts "Are you on the messaging page?" when the conversations container is missing', async () => {
    document.body.innerHTML = `
      <div class="msg-conversations-container__dropdown-container"><div></div></div>
      <div class="msg-conversations-container__title-row">
        <button class="artdeco-dropdown__trigger"></button>
      </div>`
    await setupDeleteMessagesButton()
    const button = await addMenuAndGetButton()

    button.onclick()

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('Are you on the messaging page?')
    )
  })

  it('shows the trash-can alert after scrollHeight exceeds 20000', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()
    const button = await addMenuAndGetButton()

    mockScrollHeight(document.querySelector(CONVERSATIONS_LIST), 21000)
    button.onclick()

    await vi.advanceTimersByTimeAsync(1000)

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('trash can')
    )
  })

  it('shows the trash-can alert after scrollHeight stops growing (stall detection)', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()
    const button = await addMenuAndGetButton()

    // scrollHeight stays constant at 100 — never exceeds 20000
    // tick 1: 100≠0 → no stall; ticks 2-5: stall, attempts 0→1→2→3→resolve
    mockScrollHeight(document.querySelector(CONVERSATIONS_LIST), 100)
    button.onclick()

    await vi.advanceTimersByTimeAsync(5000)

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('trash can')
    )
  })

  it('sets scrollTop to scrollHeight on each interval tick', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()
    const button = await addMenuAndGetButton()

    const container = document.querySelector(CONVERSATIONS_LIST)
    mockScrollHeight(container, 21000)
    button.onclick()

    await vi.advanceTimersByTimeAsync(1000)

    expect(container.scrollTop).toBe(21000)
  })

  it('does not resolve when scrollHeight is exactly 20000', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()
    const button = await addMenuAndGetButton()

    mockScrollHeight(document.querySelector(CONVERSATIONS_LIST), 20000)
    button.onclick()

    // scrollHeight === 20000 does NOT satisfy > 20000 — should not resolve in 1 tick
    await vi.advanceTimersByTimeAsync(1000)

    expect(window.alert).not.toHaveBeenCalled()
  })

  it('does not resolve while scrollHeight is still growing', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()
    const button = await addMenuAndGetButton()

    const container = document.querySelector(CONVERSATIONS_LIST)
    let sh = 0
    // scrollHeight increments each tick — never stalls, never exceeds 20000
    Object.defineProperty(container, 'scrollHeight', {
      get: () => (sh += 100),
      configurable: true,
    })

    button.onclick()

    // 4 ticks of growing height: stall detection should NOT fire
    await vi.advanceTimersByTimeAsync(4000)

    expect(window.alert).not.toHaveBeenCalled()
  })

  it('does not resolve after only one stall tick', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()
    const button = await addMenuAndGetButton()

    // constant height — tick 1 grows (100 ≠ 0), tick 2 is first stall (attempts 0→1)
    mockScrollHeight(document.querySelector(CONVERSATIONS_LIST), 100)
    button.onclick()

    // only 2 ticks — attempts=1, not yet at 3
    await vi.advanceTimersByTimeAsync(2000)

    expect(window.alert).not.toHaveBeenCalled()
  })

  it('does not resolve after 4 stall ticks — requires exactly 5 to detect stall', async () => {
    // Kills the `if (scrollHeight === height) → if (true)` mutation on L27.
    // That mutation makes attempts increment on every tick (even when height grows),
    // so stall detection fires one tick early (tick 4 instead of tick 5).
    // Constant height=100: tick 1 isn't a stall (100≠0); ticks 2-4 are stalls
    // (attempts 0→1→2→3) but only tick 5 satisfies attempts>=3.
    buildMessagingDOM()
    await setupDeleteMessagesButton()
    const button = await addMenuAndGetButton()

    mockScrollHeight(document.querySelector(CONVERSATIONS_LIST), 100)
    button.onclick()

    await vi.advanceTimersByTimeAsync(4000)

    expect(window.alert).not.toHaveBeenCalled()
  })

  it('does not add a button when a non-ul element is added to the menu container', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()

    const menuContainer = document.querySelector(
      '.msg-conversations-container__dropdown-container > div'
    )
    menuContainer.appendChild(document.createElement('div'))
    await new Promise((resolve) => queueMicrotask(resolve))

    expect(menuContainer.querySelector('.artdeco-dropdown__item')).toBeNull()
  })

  it('clicks every label in the conversations list after loading completes', async () => {
    buildMessagingDOM()
    await setupDeleteMessagesButton()
    const button = await addMenuAndGetButton()

    const container = document.querySelector(CONVERSATIONS_LIST)
    const label1 = document.createElement('label')
    const label2 = document.createElement('label')
    container.appendChild(label1)
    container.appendChild(label2)

    const click1 = vi.spyOn(label1, 'click')
    const click2 = vi.spyOn(label2, 'click')

    mockScrollHeight(container, 21000)
    button.onclick()

    await vi.advanceTimersByTimeAsync(1000)

    expect(click1).toHaveBeenCalled()
    expect(click2).toHaveBeenCalled()
  })
})
