import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Note: I already exported useAuth from AuthContext.tsx, 
// but sometimes a separate file is preferred for organization.
// I'll keep it simple and just re-export or use the one in Context.
// Since the instruction says create this folder/file, I'll do it.

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
