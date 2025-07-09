import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deletePrivateKey, getPrivateKey } from './idb';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect( () => {
    async function checkAccess() {
      const privateKey = await getPrivateKey();
    const createdAt = localStorage.getItem('keyCreatedAt');

    if (!privateKey || !createdAt) {
      toast.error('Log in to access this page or Already Voted');
      navigate('/googlelogin');
    } else {
      const age = Date.now() - Number(createdAt);
      if (age > 12 * 60 * 60 * 1000) {
        await deletePrivateKey();
        localStorage.removeItem('keyCreatedAt');
        localStorage.removeItem('email');
        toast.warning('Session expired. Please login again.');
        navigate('/googlelogin');
      }
    }
  }
  checkAccess();
  }, []);

  return children;
};

export default ProtectedRoute;