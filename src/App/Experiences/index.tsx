import { experiences } from "./experiences";
import styles from "./styles.module.css";

export const Experiences: React.FC = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.Title}>
        <h1>Experience</h1>
      </div>

      {experiences.map((experience, index) => (
        <div className={styles.Experience} key={index}>
          <h1 className={styles.company}>{experience.company}</h1>
          <h2 className={styles.Job}>{experience.job}</h2>
          <div className={styles.Detail}>{experience.description}</div>
          <p className={styles.Duration}> {`${experience.start.year}.${experience.start.month} ~ ${experience.end.year}.${experience.end.month}`}</p>
        </div>
      ))}

    </div>
  );
}