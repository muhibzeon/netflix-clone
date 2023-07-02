import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import clsx from "classnames";
import { getYoutubeVideoById } from "../../lib/videos";
import NavBar from "../../components/nav/navbar";
import Like from "../../components/icons/like-icon";
import DisLike from "../../components/icons/dislike-icon";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  // const video = {
  //   title: "Some came running",
  //   publishTime: "1963-05-03",
  //   description: "Dino and Frankie becomes bestie to support each other",
  //   channelTitle: "HBO Max",
  //   viewCount: 23000,
  // };

  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const listOfVideos = [
    "DotnJ7tTA34",
    "IiMinixSXII",
    "bspbQZk7Yrs",
    "6RQ4C9FrMEQ",
  ];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
  const router = useRouter();
  console.log({ router });

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDisLike] = useState(false);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  const handleToggleLike = () => {
    console.log("handling like");
    setToggleLike(!toggleLike);
    setToggleDisLike(toggleLike);
  };

  const handleToggleDislike = () => {
    console.log("handling dislike");
    setToggleDisLike(!toggleDislike);
    setToggleLike(toggleDislike);
  };

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Example Modal"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="player"
          type="text/html"
          className={styles.videoPlayer}
          width="100%"
          height="390"
          src={`http://www.youtube.com/embed/${router.query.videoId}?enablejsapi=1&origin=http://example.com&controls=0&rel=0`}
          frameborder="0"
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDislike} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast:</span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count:</span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
