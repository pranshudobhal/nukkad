import styles from './Home.module.css';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
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
          <h3>hello, {user?.displayName}</h3>
        </div>
        {/* <div className={styles.popularRooms}>
        <div className={styles.heading}>
          <h4>Popular Rooms</h4>
        </div>
        <div className={styles.rooms}>
          <p>Popular rooms small cards will come here</p>
        </div>
      </div> */}
        <div className={styles.allRooms}>
          <div className={styles.heading}>
            <h4>All Rooms</h4>
            <span>
              Explore <ArrowForwardIosIcon style={{ fontSize: 12 }} />
            </span>
          </div>
          <div className={styles.rooms}>
            {rooms?.docs.map((doc) => {
              return <Card key={doc.id} id={doc.id} topic={doc.data().name} owner={doc.data().admin} />;
            })}
          </div>
        </div>
      </div>
      <CreateNukkad />
    </>
  );
}
