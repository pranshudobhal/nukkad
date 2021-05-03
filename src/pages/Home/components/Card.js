import styles from './Card.module.css';
import { useRoom } from '../../../context/roomContext';
import { useNavigate } from 'react-router';
import { auth, db } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Card({ id, topic, owner, isRoomOpen }) {
  const { roomDispatch } = useRoom();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const changeRoom = () => {
    if (id) {
      roomDispatch({ type: 'INITIALIZE_ROOM', payload: id });
    }
  };

  const addMembertoRoom = () => {
    db.collection('rooms')
      .doc(id)
      .collection('members')
      .doc(user.uid)
      .set({
        memberID: user.uid,
        write: false,
        memberName: user.displayName,
        memberImage: user.photoURL,
        needPermissionToText: false,
      })
      .catch((error) => console.log('Error adding member to a room! ', error));
  };

  return (
    <div className={styles.card}>
      <div className={styles.topic}>{topic}</div>
      <div className={styles.owner}>{owner}'s nukkad</div>
      <p>{isRoomOpen ? 'Live' : 'Closed'}</p>
      <div
        className={styles.action}
        onClick={() => {
          changeRoom();
          addMembertoRoom();
          navigate(`/${id}`);
        }}
      >
        <span>{isRoomOpen ? 'Join' : 'Check highlights'}</span>
      </div>
    </div>
  );
}
