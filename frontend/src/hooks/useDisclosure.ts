import { useState, useCallback } from 'react';

/**
 * useDisclosure - Reusable state toggle utility for modals, popups, sidebar drawers, or accordions.
 *
 * @example
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
}
