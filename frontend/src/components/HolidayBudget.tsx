import styles from "./HolidayBudget.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const HolidayBudget = () => {
  const amounts = ["1,000", "5,000", "10,000" ,"50,000", "2,00,000"];

  return (
    <div className={styles.main}>
      <div className={styles.innermain}>
        <div className={styles.heading}>
          <p className={styles.p1}>Holidays for every</p>
          <p className={styles.p2}>Budget</p>
        </div>
        <div className={styles.amountbox}>
          {amounts.map((amount, index) => (
            <div className={styles.star_12} key={index}>
              <span className={styles.below}>BELOW</span>
              <span className={styles.amount}>₹{amount}</span>
              <FontAwesomeIcon icon={faStar} className={styles.star} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HolidayBudget;
