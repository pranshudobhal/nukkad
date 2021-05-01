import styles from './Navbar.module.css';
import SearchIcon from '@material-ui/icons/Search';
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
          <h2>Nukkad</h2>
        </div>
        <div className={styles.actions}>
          <span>
            <SearchIcon style={{ fontSize: 27 }} />
          </span>
          <span onClick={() => navigate('/profile')}>
            <img src={user?.photoURL} alt={user?.displayName} />
          </span>
        </div>
      </div>
    </div>
  );
}
