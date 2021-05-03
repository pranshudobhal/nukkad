import { auth, provider } from '../../firebase';
import styles from './Login.module.css';

export function Login() {
  const signInWithGoogle = () => auth.signInWithPopup(provider).catch((error) => console.log(error.message));

  return (
    <div className={styles.loginContainer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img className={styles.image} src="nukkad-logo.png" alt="Nukkad" />
          <img className={styles.logoText} src="nukkad-text-logo.png" alt="" />
        </div>
        <div className={styles.subHeading}>Brewing conversations like never before</div>
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
