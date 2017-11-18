/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const users = [
  {
    caption: "Facebook",
    image: "img/logos/facebook.svg",
    infoLink: "https://www.facebook.com",
    pinned: true
  },
  {
    caption: "Messenger",
    image: "img/logos/messenger.svg",
    infoLink: "https://messenger.com",
    pinned: true
  },
  {
    caption: "WOW air",
    image: "img/logos/wowair.svg",
    infoLink: "https://wowair.com",
    pinned: true
  },
  {
    caption: "BeOpinion",
    image: "img/logos/beopinion.svg",
    infoLink: "https://beopinion.com",
    pinned: true
  },
  {
    caption: "Gain by Sentia",
    image: "img/logos/gain_logo.svg",
    infoLink: "https://gain.ai",
    pinned: true
  },
  {
    caption: "Social Tables",
    image: "img/logos/socialtables.svg",
    infoLink: "https://www.socialtables.com",
    pinned: true
  },
];

const examples = [
  {
    name: "Hacker News",
    image: "img/examples/hn.png",
    link: "https://github.com/reasonml-community/reason-react-hacker-news",
  },
  {
    name: "TodoMVC",
    image: "img/examples/todomvc.png",
    link: "https://github.com/reasonml-community/reason-react-example/tree/master/src/todomvc",
  }
]

const siteConfig = {
  title: "BuckleScript",
  tagline: "Write safer and simpler code, compile to JavaScript.",
  url: "https://bucklescript.github.io/bucklescript",
  editUrl: "https://github.com/bucklescript/bucklescript/tree/master/docs/",
  recruitingLink: "https://crowdin.com/project/bucklescript",
  sourceCodeButton: null,
  baseUrl: "/",
  projectName: "bucklescript",
  headerLinks: [
    { doc: "installation", label: "Docs" },
    { doc: "manual", label: "Community" },
    { href: "https://bucklescript.github.io/bucklescript-playground/index.html", label: "Try It"},
    { blog: true, label: "Blog" },
    { languages: true },
    { search: true },
    { href: "https://github.com/bucklescript/bucklescript", label: "GitHub" },
  ],
  users,
  examples,
  // headerIcon: "img/logo.svg",
  // footerIcon: "img/logo.svg",
  favicon: "img/logo.svg",
  /* colors for website */
  colors: {
    primaryColor: "#ab5ea3",
    secondaryColor: "#ab5ea3",
    prismColor:
      "rgba(171, 94, 163, 0.03)" /* primaryColor in rgba form, with 0.03 alpha */
  },
  // algolia: {
  //   apiKey: "pending",
  //   indexName: "bucklescript"
  // },
};

module.exports = siteConfig;
