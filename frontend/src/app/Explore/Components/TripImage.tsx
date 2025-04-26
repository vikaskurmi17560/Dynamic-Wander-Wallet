import Image from "next/image";
import style from "../[id]/style.module.css";
import Link from "next/link";

const TripImage = () => (
  <div className={style.img_div}>
    <Image src="/images/Daskboard/Trip.jpg" alt="Trip Image" height={2000} width={2000} className={style.img} />
    <p className={style.heading}>Trip Checkpoints</p>
    <div className={style.btn_div}>
      <div className={style.btn_box}>
        <Link href="/explore" className={style.btn}>Explore</Link>
      </div>
    </div>
  </div>
);

export default TripImage;
