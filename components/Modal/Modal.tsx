'use client';

import type { ReactNode, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import { useEffect, useState } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const [modalRoot] = useState<HTMLElement | null>(() => {
    if (typeof document === 'undefined') return null;
    return document.getElementById('modal-root');
  });

  // ❷ Логіка Escape + блокування скролу
  useEffect(() => {
    if (!modalRoot) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalRoot, onClose]); // важливо!

  // ❸ Якщо контейнер ще не знайдено — не рендеримо портал
  if (!modalRoot) return null;

  // ❹ Обробка кліка по backdrop
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
