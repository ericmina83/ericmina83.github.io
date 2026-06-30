import React from "react";

interface Timing {
  month: number;
  year: number;
}

interface Experience {
  start: Timing;
  end: Timing;
  job: string;
  company: string;
  description: React.ReactNode;
}

export const experiences: Experience[] = [
  { // Dyadic Solution
    start: { month: 3, year: 2023 },
    end: { month: 12, year: 2024 },
    job: "Software Engineer",
    company: "Dyadic Solution",
    description: (
      <>
        <ul>
          <li>Built a 3D virtual touring system, leveraging extensive Three.js expertise alongside a solid background in game industry 3D development to independently deliver complex web-based 3D experiences.</li>
          <li>Collaborated with the team to develop an online store for a TRPG music platform, integrating Stripe payment with a full-stack approach using React, Express, and TypeORM.</li>
        </ul>
      </>
    ),
  },
  { // Dyadic Games
    start: { month: 8, year: 2022 },
    end: { month: 12, year: 2024 },
    job: "Software Engineer",
    company: "Dyadic Games",
    description: (
      <>
        <ul>
          <li> Develop our first rpg game Sikanda with Unity. </li>
          <li> Develop VR application with Unity for our customers. </li>
        </ul>
      </>
    ),
  },
  { // Atan
    company: "Atan",
    start: { month: 2, year: 2020 },
    end: { month: 12, year: 2021 },
    job: "Software Engineer",
    description: (
      <>
        <ul>
          <li>Responsible for product maintenance of UC9020 and UC9040, focusing on writing Linux C/C++ and 8051 C code.</li>
          <li>Developed programs for STM32 chips in the product development center.</li>
          <li>Engaged in chip development for new live-streaming products, primarily focusing on researching HDMI protocols and applications.</li>
        </ul>
      </>
    )
  }
];
