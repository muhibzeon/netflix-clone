import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Login.module.css";
import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");

  const router = useRouter();

  const handleOnChangeEmail = (event) => {
    setUserMsg("");
    event.preventDefault();
    const email = event.target.value;
    setEmail(email);
  };

  const handleSignInWithEmail = (event) => {
    event.preventDefault();

    if (email) {
      if (email === "muhibaiub@gmail.com") {
        router.push("/");
        console.log("route to dashboard");
      } else {
        setUserMsg("Something went wrong logging in!");
      }
    } else {
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
            Sign In
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
