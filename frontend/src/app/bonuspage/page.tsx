import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faStar, faCoins, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import style from "./bonuspage.module.css";

const BonusPage = () => {
    return (
        <div className={style.main}>
            <div className={style.container}>
                <h1 className={style.h1}>Reward And Cashback</h1>
                <div className={style.navbar}>
                    <div className={style.navItem}>
                        <p className={style.name}>Cashback Won</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faGift} className={style.faIcon} />\
                            <p className={style.value}>$40000</p>
                        </div>
                    </div>
                    <div className={style.navItem}>
                        <p className={style.name}>Wander Point</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faStar} className={style.faIcon} />\
                            <p className={style.value}>0000</p>
                        </div>
                    </div>
                    <div className={style.navItem}>
                        <p className={style.name}>Redeem Coins</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faCoins} className={style.faIcon} />\
                            <p className={style.value}>4567</p>
                        </div>
                    </div>
                    <div className={style.navItem}>
                        <p className={style.name}>My Vouchers</p>
                        <div className={style.number_div}>
                            <FontAwesomeIcon icon={faTicketAlt} className={style.faIcon} />\
                            <p className={style.value}>000</p>
                        </div>
                    </div>
                </div>
                <div className={style.reward_container}>
                    
                </div>
            </div>
        </div>
    );
};

export default BonusPage;
