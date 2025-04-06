import style from "./blog.module.css";

const Blog = () => {
    return (
        <>
            <div className={style.main}>
                <span className={style.btn}>Post</span>
                <span className={style.btn}>Reels</span>
            </div>
            <div>
                This is a Blog Site
            </div>
        </>
    )
}

export default Blog
