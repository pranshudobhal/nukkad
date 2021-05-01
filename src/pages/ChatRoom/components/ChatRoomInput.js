import styles from './ChatRoomInput.module.css';
import SendIcon from '@material-ui/icons/Send';
import { useState } from 'react';
import { auth, db } from '../../../firebase';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function ChatRoomInput({ roomID }) {
  const [input, setInput] = useState('');
  const [user] = useAuthState(auth);

  const sendMessage = (e) => {
    e.preventDefault();

    if (input !== '') {
      db.collection('messages').doc(roomID).collection('messages').add({
        messageText: input,
        sentAt: firebase.firestore.FieldValue.serverTimestamp(),
        sentBy: user.uid,
        userName: user.displayName,
        userImage: user.photoURL,
      });
    }

    setInput('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatRoomInputContainer}>
        <form>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type whats in your mind" />
          <button type="submit" onClick={sendMessage}>
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
