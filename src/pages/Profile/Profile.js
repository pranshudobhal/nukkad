import styles from './Profile.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export function Profile() {
  const [user] = useAuthState(auth);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <img src={user?.photoURL} alt={user?.displayName} />
        <h1>{user?.displayName}</h1>
        <button onClick={() => auth.signOut()}>Log out</button>
      </div>
    </div>
  );
}
