import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div>
      <div className={styles.subtitle}>
        <div className={styles.rowSubtitle}>
          <span className={styles.absent}> </span>
          <p>Ausente</p>
        </div>
        <div className={styles.rowSubtitle}>
          <span className={styles.notFound}> </span>
          <p>Endereço não localizado</p>
        </div>
      </div>

      <div className={styles.footer}>
        <span>code by pablodev &copy;</span>
      </div>
    </div>
  );
};

export default Footer;
