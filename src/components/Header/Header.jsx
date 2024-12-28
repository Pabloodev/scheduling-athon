import styles from './Header.module.css'
import picture from '/athon.jpg'

const Header = () => {
  return (
    <div className={styles.header}>
      <img src={picture} alt="Logo Athon" />
      <h1>Reagendamento OS</h1>
    </div>
  )
}

export default Header