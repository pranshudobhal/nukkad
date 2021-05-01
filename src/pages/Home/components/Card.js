import styles from './Card.module.css';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useRoom } from '../../../context/roomContext';
import { useNavigate } from 'react-router';
import { auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Card({ id, topic }) {
  const { roomDispatch } = useRoom();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const changeRoom = () => {
    if (id) {
      roomDispatch({ type: 'INITIALIZE_ROOM', payload: id });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.topic}>{topic}</div>
      <div className={styles.owner}>{user?.displayName}'s nukkad</div>
      <div
        className={styles.action}
        onClick={() => {
          changeRoom();
          navigate(`/${id}`);
        }}
      >
        <span>Join this Nukkad</span>
        <ArrowForwardIcon />
      </div>
    </div>
  );
}
