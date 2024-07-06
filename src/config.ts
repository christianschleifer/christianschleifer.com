import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://christianschleifer.com/",
  author: "Christian Schleifer",
  desc: "Personal blog of Christian Schleifer",
  title: "Christian Schleifer",
  lightAndDarkMode: true,
  postPerPage: 10,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/ChristianSchleifer",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/christian-schleifer/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:christianschleifer@gmx.de",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
