import styles from './Error404.module.css';

export function Error404() {
  return (
    <div className={styles.error404Container}>
      <h1>ERROR 404</h1>
      <h3>Page Not Found</h3>
      <p>😢</p>
    </div>
  );
}
