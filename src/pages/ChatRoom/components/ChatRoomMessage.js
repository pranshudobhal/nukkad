import { useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';
import styles from './ChatRoomMessage.module.css';

export function ChatRoomMessage({ messageText, sentAt, sentBy, userImage, userName }) {
  const messageDate = new Date(sentAt?.toDate()).toLocaleTimeString([], { timeStyle: 'short' });
  const dummy = useRef();
  const [user] = useAuthState(auth);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  });

  if (user.uid === sentBy) {
    return (
      <div className={styles.selfChatRoomMessageContainer}>
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
  } else {
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
}
