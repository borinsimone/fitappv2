import { AnimatePresence, delay, motion } from 'framer-motion';
import { useState } from 'react';
import { BsClock } from 'react-icons/bs';

import styled from 'styled-components';

interface Notification {
  text: string;
  time: string;
}

function NotificationPanel({
  notification,
  setNotification,
  setNotificationPanelOpen,
}: {
  notification: Notification[];
  setNotification: (notification: Notification[]) => void;
  setNotificationPanelOpen: (open: boolean) => void;
}) {
  return (
    <Container
      as={motion.div}
      onClick={(e) => e.stopPropagation()}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.2 }}
    >
      <div className='main-text'>
        <div className='main'>Notifiche</div>
        <div className='sub'>
          Hai {notification.length} notifiche da leggere
        </div>
      </div>

      <div className='main-line'></div>
      <div className='notification-container'>
        <AnimatePresence>
          {notification.map((not, index) => (
            <>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 * index }}
                className='notification'
              >
                <div className='img'></div>
                <div className='text'>
                  <div className='main'>{not.text}</div>
                  <div className='time'>
                    <BsClock /> {not.time}
                  </div>
                </div>
              </motion.div>
              <div className='line'></div>
            </>
          ))}
        </AnimatePresence>
      </div>
      <button
        className='delete'
        onClick={() => {
          setNotification([]);
          setNotificationPanelOpen(false);
        }}
      >
        Elimina notifiche
      </button>
    </Container>
  );
}

export default NotificationPanel;
const Container = styled.div`
  position: absolute;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.white};
  width: calc(100vw - 40px);
  height: 80vh;
  height: 80dvh;
  right: 0;
  border-radius: 20px;
  padding: 20px;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  .main-text {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* gap: 5px; */
    .main {
      font-size: 18px;
      font-weight: 700;
    }
    .sub {
      font-size: 14px;
      font-weight: 300;
    }
  }
  .main-line {
    width: calc(100vw - 40px);

    height: 1px;
    background-color: ${({ theme }) => theme.colors.dark};
  }
  .notification-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .notification {
      display: flex;
      align-items: center;
      gap: 10px;
      .img {
        height: 40px;
        aspect-ratio: 1;
        background-color: #1e1e1e60;
        border-radius: 50%;
      }
      .text {
        display: flex;
        flex-direction: column;
        gap: 5px;
        .main {
          font-size: 14px;
        }
        .time {
          display: flex;
          align-items: center;
          gap: 5px;
          opacity: 0.4;
          font-size: 12px;
          text-transform: capitalize;
        }
      }
    }
    .line {
      height: 1px;
      background-color: ${({ theme }) => theme.colors.dark};
    }
  }
  button {
    margin-top: auto;
    background-color: red;
    font-size: 16px;
    font-weight: 700;
    width: 70%;
    padding: 2px 0;
    border-radius: 1000px;
  }
`;
