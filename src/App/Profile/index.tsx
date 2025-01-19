import React from "react";
import styles from "./styles.module.css";

export const Profile: React.FC = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.Profile}>

        <div className={styles.ProfileLeft}>
          <div className={styles.Thumbnail}>
            <img src="src/Assets/images/google.svg" />
          </div>
        </div>

        <div className={styles.ProfileRight}>
          <h1 id="profile-name"> Jyun-An Zou (Eric)</h1>
          <h2 id="profile-title"> Full Stack Developer</h2>
        </div>

      </div>
    </div >
  );
}