import styles from './Header.module.css'

const Header = () => {
  return (
    <div className={styles.header}>
      <img src="./athon-logo.jpg" alt="" />
      <h1>Reagendamento OS</h1>
    </div>
  )
}

export default Header