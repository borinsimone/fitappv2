import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { BiBell } from 'react-icons/bi';
import styled from 'styled-components';
import NotificationPanel from './NotificationPanel';
import { CgClose } from 'react-icons/cg';
import { AnimatePresence, motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

function TopBar() {
  const { user } = useGlobalContext();
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [notBadge, setNotBadge] = useState(false);
  const [notification, setNotification] = useState([
    {
      text: 'Testo della notifica, saranno notifiche social, integratori, allenamenti, idratazione',
      time: '24 minuti fa',
    },
    {
      text: 'Testo della notifica, saranno notifiche social, integratori, allenamenti, idratazione',
      time: '1 ora fa',
    },
    {
      text: 'Testo della notifica, saranno notifiche social, integratori, allenamenti, idratazione',
      time: '2 giorni fa',
    },
  ]);
  useEffect(() => {
    if (notification.length > 0) {
      setNotBadge(true);
    } else {
      setNotBadge(false);
    }
  }, [notification]);
  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      notbadge={notBadge}
      notopen={notificationPanelOpen}
    >
      <div className='left'>
        <div
          className='img'
          onClick={() => {
            const token = localStorage.getItem('token');
            if (token) {
              const decoded: { exp: number } = jwtDecode(token);
              const timeLeft = decoded.exp * 1000 - Date.now();
              console.log(
                `Token expires in ${Math.floor(timeLeft / 1000)} seconds`
              );
            }
          }}
        ></div>
        <div className='main-text'>
          <div className='greets'>
            {(() => {
              const hour = new Date().getHours();
              if (hour >= 5 && hour < 12) return 'Buongiorno';
              if (hour >= 12 && hour < 18) return 'Buonpomeriggio';
              return 'Buonasera';
            })()}
            ,<div className='name'>{user?.name}</div>
          </div>
          <div className='date'>
            {new Date().toLocaleDateString('it-IT', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
      <div
        className='notification-icon'
        onClick={() => {
          setNotificationPanelOpen(!notificationPanelOpen);
        }}
      >
        {!notificationPanelOpen && <BiBell size='30px' />}
        {notificationPanelOpen && <CgClose size='30px' />}
        <AnimatePresence>
          {notificationPanelOpen && (
            <NotificationPanel
              notification={notification}
              setNotification={setNotification}
              setNotificationPanelOpen={setNotificationPanelOpen}
            />
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}

export default TopBar;
interface ContainerProps {
  notbadge: boolean;
  notopen: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  position: relative;
  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    .img {
      height: 48px;
      aspect-ratio: 1;
      background-color: #fff;
      border-radius: 1000px;
    }
    .main-text {
      display: flex;
      flex-direction: column;
      .greets {
        display: flex;
        align-items: baseline;
        gap: 0.25em;
        font-size: 16px;

        .name {
          font-size: 1.5em;
          text-transform: uppercase;
          font-weight: 700;
        }
      }
    }
    .date {
      font-family: 'roboto mono';
      font-size: 14px;
      font-weight: 300;
      text-transform: capitalize;
    }
  }
  .notification-icon {
    position: relative;
    &::before {
      content: '';
      display: ${({ notopen, notbadge }) =>
        !notopen && notbadge ? 'block' : 'none'};
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      background-color: red;
      border-radius: 50%;
    }
  }
`;
