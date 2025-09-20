import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { socketService } from '@/services/socketService';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketService.connect();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
    };
  }, []);

  return {
    socket: socketService.getSocket(),
    isConnected,
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
  };
};

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    dispatch,
  };
};

export const useSports = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teams, matches, favorites, isLoading, error } = useSelector(
    (state: RootState) => state.sports
  );

  return {
    teams,
    matches,
    favorites,
    isLoading,
    error,
    dispatch,
  };
};
