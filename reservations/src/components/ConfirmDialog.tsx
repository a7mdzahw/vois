'use client';

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button, ButtonProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  rejectLabel?: string;
  confirmButtonProps?: ButtonProps;
  rejectButtonProps?: ButtonProps;
  className?: string;
};

type ConfirmDialogProps = {
  open: boolean;
  className?: string;
  title: string;
  message: string;
  confirmButtonProps?: ButtonProps;
  rejectButtonProps?: ButtonProps;
  confirmLabel?: string;
  rejectLabel?: string;
  handleClose: (result: boolean) => void;
};

const ConfirmDialog = ({
  open,
  className,
  title,
  message,
  confirmButtonProps,
  rejectButtonProps,
  confirmLabel,
  rejectLabel,
  handleClose,
}: ConfirmDialogProps) => {
  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled
      hideCloseButton
      isOpen={open}
      radius="sm"
      className={className}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          <div className="text-neutral-700">{message}</div>
        </ModalBody>
        <ModalFooter>
          <Button className="rounded-md" variant="bordered" onPress={() => handleClose(false)} {...rejectButtonProps}>
            {rejectLabel}
          </Button>
          <Button className="main-button" onPress={() => handleClose(true)} {...confirmButtonProps}>
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [confirmLabel, setConfirmLabel] = useState('Confirm');
  const [rejectLabel, setRejectLabel] = useState('Cancel');
  const [confirmButtonProps, setConfirmButtonProps] = useState<ButtonProps>();
  const [rejectButtonProps, setRejectButtonProps] = useState<ButtonProps>();
  const [className, setClassName] = useState('');

  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = (options: ConfirmOptions) => {
    // returning the promise
    return new Promise<boolean>((resolve) => {
      const {
        message,
        title,
        className = '',
        rejectButtonProps = {},
        confirmButtonProps = {},
        rejectLabel = 'Cancel',
        confirmLabel = 'Confirm',
      } = options;

      // setting the options
      setTitle(title);
      setMessage(message);
      setConfirmLabel(confirmLabel);
      setRejectLabel(rejectLabel);
      setConfirmButtonProps(confirmButtonProps);
      setRejectButtonProps(rejectButtonProps);
      setClassName(className);
      // opening the modal
      setOpen(true);
      setResolver(() => resolve);
    });
  };

  const handleClose = (result: boolean) => {
    setOpen(false);
    resolver?.(result);
  };

  useEffect(() => {
    ref.current = document.getElementById('confirm-dialog-target');
    setMounted(true);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      <div id="confirm-dialog-target" />
      {mounted &&
        ref.current &&
        createPortal(
          <ConfirmDialog
            open={open}
            className={className}
            title={title}
            message={message}
            confirmButtonProps={confirmButtonProps}
            rejectButtonProps={rejectButtonProps}
            confirmLabel={confirmLabel}
            rejectLabel={rejectLabel}
            handleClose={handleClose}
          />,
          ref.current,
        )}
      {children}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside ConfirmProvider');
  return ctx;
}
