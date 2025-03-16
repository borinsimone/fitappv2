import React from 'react';
import { BiExit } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';

function Account() {
  const { logout } = useAuth();

  return (
    <div>
      <button
        className='logoutBtn'
        onClick={() => {
          logout();
        }}
      >
        <BiExit
          color='red'
          size='40px'
        />
      </button>
    </div>
  );
}

export default Account;
