import { useState } from 'react';

export default function userData() {
  const getUserData = () => {
    const userDataString = JSON.parse(localStorage.getItem('userdata'));
    if(userDataString)
        return userDataString
    else
        return null
  };

  const getUsername = () => {
    const userData = localStorage.getItem('userdata');
    if(!userData)
      return null
    const username = JSON.parse(userData).username;
    if(username)
        return username
    else
        return null
  };

  const getUsertoken = () => {
    const userData = localStorage.getItem('userdata');
    if(!userData)
      return null
    const token = JSON.parse(userData).token;
    if(token)
        return token
    else
        return null
  };

  const removeUserData = () => {
    const userData = localStorage.getItem('userdata');
    if(!userData)
      return null
    
      localStorage.removeItem('userdata');
      return null;
  };

  const [user, setUserData] = useState(getUserData());
  const [userName] = useState(getUsername());
  const [userToken] = useState(getUsertoken());

  const saveUserData = userData => {
    localStorage.setItem('userdata', JSON.stringify(userData));
    setUserData(userData);
  };

  return {
    setUserData: saveUserData,
    user,
    userName,
    userToken,
    removeUserData
  }
}