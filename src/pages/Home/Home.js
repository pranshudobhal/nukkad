import styles from './Home.module.css';
import { auth, db } from '../../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Card } from './components/Card';
import { CreateNukkad } from '../../components/';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Home() {
  const [rooms] = useCollection(db.collection('rooms'));
  const [user] = useAuthState(auth);

  return (
    <>
      <div className={styles.homeContainer}>
        <div className={styles.greetings}>
          <span>
            <i>hello,</i>
          </span>
          <span>{user?.displayName}</span>
        </div>
        <div className={styles.allRooms}>
          <div className={styles.heading}>
            <h4>All Rooms</h4>
          </div>
          <div className={styles.rooms}>
            {rooms?.docs.map((doc) => {
              if (doc.data().saveChat) {
                return <Card key={doc.id} id={doc.id} topic={doc.data().name} owner={doc.data().admin} isRoomOpen={doc.data().roomOpen} />;
              }
              return false;
            })}
          </div>
        </div>
      </div>
      <CreateNukkad />
    </>
  );
}
