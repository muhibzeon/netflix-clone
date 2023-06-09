import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner/banner";
import NavBar from "../components/nav/navbar";
import SectionCards from "../components/card/section-cards";
import {
  getVideos,
  getPopularVideos,
  getWatchItAgainVideos,
} from "../lib/videos";
import UseRedirectUser from "../utils/redirectUser";

export async function getServerSideProps(context) {
  const { token, userId } = await UseRedirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const movie = await getVideos("movie trailer");
  const disneyVideos = await getVideos("disney");
  const travelVideos = await getVideos("travel vlogs");
  const productivityVideos = await getVideos("motivation");
  const popularVideos = await getPopularVideos();
  return {
    props: {
      movie,
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}

export default function Home({
  movie,
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
  watchItAgainVideos = [],
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <NavBar userName="mohammad@muslim.com" />
        <Banner
          videoId="uYPbbksJxIg"
          title="O P P E N H E I M E R"
          subtitle="New Trailer"
          imgUrl="/static/oppenheimer.jpg"
        />

        <div className={styles.sectionWrapper}>
          <SectionCards title="Upcoming Movies" videos={movie} size="small" />
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards
            title="Watch it Again"
            videos={watchItAgainVideos}
            size="small"
          />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}
