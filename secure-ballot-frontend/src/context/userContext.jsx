// context/userContext.js
import { createContext, useState } from 'react';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  });

  const contextValue = {
    userInfo, 
    setUserInfo,
    publicKey,
    setPublicKey,
    privateKey,
    setPrivateKey
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;