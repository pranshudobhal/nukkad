import styles from './CreateNukkad.module.css';
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import { db } from '../../firebase';
import firebase from 'firebase';

export function CreateNukkad() {
  const [topicModal, showTopicModal] = useState(false);
  const [topic, setTopic] = useState('');
  const toggleModal = () => showTopicModal((topicModal) => !topicModal);
  const [topicCharCount, setTopicCharCount] = useState(0);

  const createRoom = () => {
    if (topic !== '') {
      db.collection('rooms').add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        // createdBy: uid,
        name: topic,
        type: 'public',
        saveChat: true,
      });
    }
  };

  return (
    <>
      <div className={styles.createNukkadContainer}>
        <button onClick={toggleModal}>
          <AddIcon />
          <span>Create a Nukkad</span>
        </button>
      </div>
      {topicModal && (
        <div
          className={styles.modalCloseContainer}
          onClick={() => {
            toggleModal();
            setTopic('');
            setTopicCharCount(0);
          }}
        >
          <div
            className={styles.topicModalContainer}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h4>Add a Topic</h4>
            <textarea
              type="text"
              value={topic}
              maxLength="60"
              onChange={(e) => {
                setTopic(e.target.value);
                setTopicCharCount(e.target.value.length);
              }}
            />
            <p>{60 - topicCharCount} characters remaining</p>
            <div className={styles.actions}>
              <span
                onClick={() => {
                  toggleModal();
                  setTopic('');
                  setTopicCharCount(0);
                }}
              >
                Cancel
              </span>
              <span
                onClick={() => {
                  createRoom();
                  setTopic('');
                  toggleModal();
                  setTopicCharCount(0);
                }}
              >
                Let's go
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
