import styles from './Profile.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Card } from '../Home/components/Card';
import stylesHome from '../Home/Home.module.css';

export function Profile() {
  const [user] = useAuthState(auth);
  const [rooms] = useCollection(db.collection('rooms'));

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.profile}>
          <img src={user?.photoURL} alt={user?.displayName} />
          <h1>{user?.displayName}</h1>
          <button onClick={() => auth.signOut()}>Log out</button>
        </div>
      </div>
      <div className={`${styles.myRooms} ${stylesHome.allRooms}`}>
        <div className={stylesHome.heading}>
          <h4>My Rooms</h4>
        </div>
        <div className={stylesHome.rooms}>
          {rooms?.docs.map((doc) => {
            if (doc.data().createdBy === user.uid) {
              return <Card key={doc.id} id={doc.id} topic={doc.data().name} owner={doc.data().admin} />;
            }
            return true;
          })}
        </div>
      </div>
    </div>
  );
}
