import { auth, provider } from '../../firebase';
import styles from './Login.module.css';

export function Login() {
  const signInWithGoogle = () => auth.signInWithPopup(provider).catch((error) => console.log(error.message));

  return (
    <div className={styles.loginContainer}>
      <div className={styles.container}>
        <h1>Nukkad</h1>
        <h3>Connecting people from every corner</h3>
        {/* <button>Sign in with Google</button> */}
        <div className={styles.googleBtn} onClick={signInWithGoogle}>
          <div className={styles.googleIconWrapper}>
            <img className={styles.googleIcon} src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Sign in with Google" />
          </div>
          <p className={styles.btnText}>
            <b>Sign in with google</b>
          </p>
        </div>
      </div>
    </div>
  );
}
