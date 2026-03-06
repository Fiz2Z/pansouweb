import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ')

const getFocusableElements = (container) =>
  Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getAttribute('aria-hidden') !== 'true' && !element.hasAttribute('disabled')
  )

export const useDialogAccessibility = (isOpen, onClose) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !dialogRef.current) {
      return undefined
    }

    const dialogNode = dialogRef.current
    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const focusTimerId = window.setTimeout(() => {
      const [firstFocusableElement] = getFocusableElements(dialogNode)

      if (firstFocusableElement) {
        firstFocusableElement.focus()
      } else {
        dialogNode.focus()
      }
    }, 0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = getFocusableElements(dialogNode)

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogNode.focus()
        return
      }

      const firstFocusableElement = focusableElements[0]
      const lastFocusableElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault()
        lastFocusableElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault()
        firstFocusableElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimerId)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      previouslyFocusedElement?.focus()
    }
  }, [isOpen, onClose])

  return dialogRef
}
