/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
//@ts-check
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
    caption: "BeOp",
    image: "img/logos/beop.svg",
    infoLink: "https://beop.io",
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
  {
    caption: "Ahrefs",
    image: "img/logos/ahrefs.svg",
    infoLink: "https://ahrefs.com",
    pinned: true
  },
  {
    caption: "Astrocoders",
    image: "img/logos/astrocoders.svg",
    infoLink: "https://astrocoders.com",
    pinned: true
  },
  {
    caption: "Appier",
    image: "img/logos/appier.svg",
    infoLink: "https://appier.com",
    pinned: true
  },
  {
    caption: "Astrolabe Diagnostics",
    image: "img/logos/astrolabe.svg",
    infoLink: "http://astrolabediagnostics.com",
    pinned: true
  },
  {
    caption: "Auditless",
    image: "img/logos/auditless.svg",
    infoLink: "https://auditless.com",
    pinned: true
  },
  {
    caption: "Tradie Training",
    image: "img/logos/tradie.png",
    infoLink: "https://tt.edu.au",
    pinned: true
  },
   {
    caption: "Atvero",
    image: "img/logos/atvero.svg",
    infoLink: "https://atvero.com",
    pinned: true
  }
];

const examples = [
  {
    name: "Hacker News",
    image: "/img/examples/hn.png",
    link: "https://github.com/reasonml-community/reason-react-hacker-news",
  },
  {
    name: "TodoMVC",
    image: "/img/examples/todomvc.png",
    link: "https://github.com/reasonml-community/reason-react-example/tree/master/src/todomvc",
  }
]

let reasonHighlightJs = require('reason-highlightjs');

const siteConfig = {
  title: "BuckleScript",
  tagline: "A faster, simpler and more robust take on JavaScript.",
  url: "https://bucklescript.github.io",
  editUrl: "https://github.com/bucklescript/bucklescript.github.io/tree/source/docs/",
  translationRecruitingLink: "https://crowdin.com/project/bucklescript",
  sourceCodeButton: null,
  baseUrl: "/",
  organizationName: "BuckleScript",
  projectName: "bucklescript.github.io",
  headerLinks: [
    { doc: "installation", label: "Docs" },
    { doc: "playground", label: "Try"},
    { doc: "stdlib-overview", label: "API" },
    { doc: "community", label: "Community" },
    { blog: true, label: "Blog" },
    { languages: true },
    { search: true },
    { href: "https://github.com/bucklescript/bucklescript", label: "GitHub" },
  ],
  users,
  examples,
  onPageNav: 'separate',
  scripts: ["/js/toggleSyntaxButton.js", "/js/pjax-api.min.js"],
  headerIcon: "img/logos/bucklescript.svg",
  // footerIcon: "img/logo.svg",
  favicon: "img/logos/bucklescript.png",
  /* colors for website */
  colors: {
    primaryColor: "#ab5ea3",
    // darkened 10%
    secondaryColor: "#92458A",
  },
  // no .html suffix needed
  cleanUrl: true,
  highlight: {
    theme: 'atom-one-light',
    hljs: function(hljs) {
      hljs.registerLanguage('reason', reasonHighlightJs)
    }
  },
  algolia: {
    apiKey: "0fd97db83891aa20810559812d9e69ac",
    indexName: "bucklescript",
    algoliaOptions: {
      facetFilters: ["lang:LANGUAGE"]
    }
  },
  enableUpdateTime : true
};

module.exports = siteConfig;
