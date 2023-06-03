import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Login.module.css";
import Image from "next/image";

import { magic } from "../lib/magic-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  //After we click login it takes some time to route to home page. At that time button changes to Loading... because of the state that we defined. But after the changes happen, it takes about 3 seconds to switch to Home page. Meanwhile button changes to Sign In and the user can see that. We want to prevent this behaviour. // refer to the next/router doc
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (event) => {
    setUserMsg("");
    event.preventDefault();
    const email = event.target.value;
    setEmail(email);
  };

  const handleSignInWithEmail = async (event) => {
    event.preventDefault();

    if (email) {
      if (email === "muhibaiub@gmail.com") {
        //router.push("/");
        try {
          setIsLoading(true);
          const didToken = await magic.auth.loginWithEmailOTP({ email: email });
          console.log({ didToken });
          if (didToken) {
            router.push("/");
          }
        } catch (error) {
          console.log("Something went wrong!", error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setUserMsg("Something went wrong logging in!");
      }
    } else {
      setIsLoading(false);
      setUserMsg("Enter a valid Email Address");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width="128"
                height="34"
              />
            </div>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email Address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleSignInWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
