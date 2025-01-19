import React, { useEffect } from "react";
import styles from "./styles.module.css"
import { useWindowScroll } from "@uidotdev/usehooks";

import { Experiences } from "./Experiences";
import { Profile } from "./Profile";

export const App: React.FC = () => {

  const [{ x, y }] = useWindowScroll();

  useEffect(() => {
    console.log({ x, y });
  }, [x, y])

  return <div className={styles.Container} >

    <Profile />

    <Experiences />

    <div className="ability-container">

    </div>
  </div>;
}