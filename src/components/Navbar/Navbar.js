import styles from './Navbar.module.css';
import { useNavigate } from 'react-router';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Navbar() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <img src="nukkad-logo.png" alt="Nukkad" />
        </div>
        <div className={styles.logoText}>
          <img src="nukkad-text-logo.png" alt="Nukkad" />
        </div>
        <div className={styles.actions}>
          <span onClick={() => navigate('/profile')}>
            <img src={user?.photoURL} alt={user?.displayName} />
          </span>
        </div>
      </div>
    </div>
  );
}
