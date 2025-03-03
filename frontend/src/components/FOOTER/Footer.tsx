import styles from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faInstagram, faFacebook, faYoutube, faLinkedin,faXTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    const Arr = [
        {
            category: "wanderWallet",
            links: [
                { name: "Home", link: "#" },
                { name: "About Us", link: "#" },
                { name: "Careers", link: "#" },
                { name: "Blog", link: "#" },
                { name: "Press", link: "#" },
                { name: "Testimonials", link: "#" },
            ],
        },
        {
            category: "policy",
            links: [
                { name: "Terms of Service", link: "#" },
                { name: "Privacy Policy", link: "#" },
                { name: "Refund Policy", link: "#" },
                { name: "Contact Us", link: "#" },
                { name: "Disclaimer", link: "#" },
                { name: "Frequently asked questions", link: "#" },
                { name: "Cancellations", link: "#" },
            ],
        },
    ];
    return (
        <>
            <div className={styles.main}>
                <div className={styles.box_div12}>
                    {Arr.map((section, index) => (
                        <div key={index} className={styles.section}>
                            <h3 className={styles.heading}>{section.category}</h3>
                            <ul className={styles.linkbox}>
                                {section.links.map((item, idx) => (
                                    <li key={idx}>
                                        <a href={item.link}>{item.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div  className={styles.box34}>
                    <h3 className={styles.heading}>Talk to us</h3>
                    <div className={styles.icon_box}><FontAwesomeIcon icon={faWhatsapp} className={styles.icon} /><p>+916784567936</p></div>
                    <div className={styles.icon_box}><FontAwesomeIcon icon={faPhone} className={styles.icon} /><p>+919873902379</p></div>
                    <div className={styles.icon_box}><FontAwesomeIcon icon={faEnvelope} className={styles.icon} /><p>dynamicwallet@gmail.com</p></div>
                    <div className={styles.icon_box}><FontAwesomeIcon icon={faEnvelope} className={styles.icon} /><p>Careers@dynamicwallet.com</p></div>
                </div>
                <div className={styles.box34}>
                    <h3 className={styles.heading}>Social</h3>
                    <div className={styles.icon_box}><FontAwesomeIcon icon={faFacebook} className={styles.icon} /><p>Facebook</p></div>
                    <div className={styles.icon_box}><FontAwesomeIcon icon={faXTwitter} className={styles.icon} /><p>Twitter</p></div>
                    <div className={styles.icon_box}><FontAwesomeIcon icon={faInstagram} className={styles.icon} /><p>Instagram</p></div>
                    <div className={styles.icon_box}><FontAwesomeIcon icon={faLinkedin} className={styles.icon} /><p>Linkedln</p></div>
                    <div className={styles.icon_box}><FontAwesomeIcon icon={faYoutube} className={styles.icon} /><p>Youtube</p></div>
                    <p className={styles.desp}>Travel Troops India Private Ltd. 2025</p>
                </div>
            </div>
            <div className={styles.footer}>
                copyright @ 2025 Developed by Wander wallet trip team
            </div>
        </>
    );
};

export default Footer;
