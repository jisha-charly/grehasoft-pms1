import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ show, title, onClose, children, footer, size }) => {
  if (!show) return null;

  return createPortal(
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className={`modal-dialog modal-dialog-centered ${size ? `modal-${size}` : ''}`} role="document">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">{children}</div>
            {footer && <div className="modal-footer bg-light border-top-0">{footer}</div>}
          </div>
        </div>
      </div>
    </>,
    document.getElementById('modal-root')!
  );
};