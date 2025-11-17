import { useEffect, useRef } from 'react';

type WebSocketOptions = {
  onMessage?: (event: MessageEvent) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export const useWebSocket = ({ onMessage, onOpen, onClose }: WebSocketOptions = {}) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL;
    if (!url) {
      console.warn('VITE_WS_URL no está definido');
      return;
    }

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      onOpen?.();
      // TODO: enviar token de autenticación si es necesario
    };

    socket.onmessage = (event) => {
      onMessage?.(event);
      // TODO: manejar eventos específicos del backend
    };

    socket.onclose = () => {
      onClose?.();
    };

    return () => {
      socket.close();
    };
  }, [onMessage, onOpen, onClose]);

  return socketRef;
};
