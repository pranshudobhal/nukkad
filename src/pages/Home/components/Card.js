import styles from './Card.module.css';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useRoom } from '../../../context/roomContext';
import { useNavigate } from 'react-router';
import { auth, db } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Card({ id, topic, owner }) {
  const { roomDispatch } = useRoom();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const changeRoom = () => {
    if (id) {
      roomDispatch({ type: 'INITIALIZE_ROOM', payload: id });
    }
  };

  const addMembertoRoom = () => {
    db.collection('rooms').doc(id).collection('members').doc(user.uid).set({
      memberID: user.uid,
      write: false,
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.topic}>{topic}</div>
      <div className={styles.owner}>{owner}'s nukkad</div>
      <div
        className={styles.action}
        onClick={() => {
          changeRoom();
          addMembertoRoom();
          navigate(`/${id}`);
        }}
      >
        <span>Join this Nukkad</span>
        <ArrowForwardIcon />
      </div>
    </div>
  );
}
