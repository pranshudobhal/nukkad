import { useEffect, useRef } from 'react';
import styles from './ChatRoomMessage.module.css';

export function ChatRoomMessage({ messageText, sentAt, userImage, userName }) {
  const messageDate = new Date(sentAt?.toDate()).toLocaleTimeString([], { timeStyle: 'short' });
  const dummy = useRef();

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <div className={styles.chatRoomMessageContainer}>
      <div className={styles.image}>
        <img src={userImage} alt={userName} />
      </div>
      <div className={styles.message}>
        <div className={styles.messageHeader}>
          <span>{userName}</span>
          <span>{messageDate}</span>
        </div>
        <div className={styles.messageBody}>
          {messageText}
          <span ref={dummy}></span>
        </div>
      </div>
    </div>
  );
}
