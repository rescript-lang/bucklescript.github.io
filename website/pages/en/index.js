/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const Marked = CompLibrary.Marked; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;
const Prism = CompLibrary.Prism;

const translate = require("../../server/translate.js").translate;

const siteConfig = require(process.cwd() + "/siteConfig.js");

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper">
        <a className={`button ${this.props.className || ""}`} href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self"
};

const codeExample =`let component = ReasonReact.statelessComponent "Greeting";

let make ::name _children => {
  ...component,
  render: fun _self =>
    <button>
      (ReasonReact.stringToElement "Hello!")
    </button>
};`;

const pre = "```";
const code = "`";
const quickStart = `${pre}bash
npm install -g bs-platform
${pre}`;

class HomeSplash extends React.Component {
  render() {
    let promoSection =
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">
            <Button
              className="getStarted"
              href={
                siteConfig.baseUrl +
                "docs/" +
                this.props.language +
                "/manual.html"
              }
            >
              <translate>Get Started</translate>
            </Button>
            <Button
              href="https://jaredforsyth.com/2017/06/03/javascript-interop-with-reason-and-bucklescript/"
            >
              Tutorial
            </Button>
          </div>
        </div>
      </div>;

    return (
      <div className="homeContainer">

        <div id="redirectBanner">
          <div>
            Hello! This particular page hash has moved to <a id="redirectLink"/>.
            Please update the URLs to reflect it. Thanks!
          </div>
        </div>

        <div className="homeWrapperWrapper">

          <img src={siteConfig.baseUrl + siteConfig.headerIcon} className="spinner" />

          <div className="wrapper homeWrapper">
            <div className="projectTitle">{siteConfig.title}</div>

            <div className="homeWrapperInner">
              <div className="homeTagLine">{siteConfig.tagline}</div>
              <div className="homeCodeSnippet">
                <Prism>{codeExample}</Prism>
              </div>
            </div>

            {promoSection}
          </div>

        </div>
      </div>
    );
  }
}

class Index extends React.Component {
  render() {
    let language = this.props.language || "en";
    const showcase = siteConfig.users
      .filter(user => {
        return user.pinned;
      })
      .map(user => {
        return (
          <a href={user.infoLink}>
            <img src={`${siteConfig.baseUrl}${user.image}`} title={user.caption} />
          </a>
        );
      });

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Container className="homeThreePoints" padding={["bottom"]}>
            <GridBlock
              align="center"
              contents={[
                {
                  title: "Developer experience",
                  content: "BuckleScript probably has the fastest JavaScript compiler.The compiler is compiled to both native code and JavaScript, users can try the compiler in the browser and imagine how fast it would be for native backend.",
                },
                {
                  title: "Integration with existing JavaScript libraries",
                  content: "BuckleScript is one of the very few compilers which compiles an existing typed language to readable JavaScript. It has the same characteristics of typescript: one OCaml module compiled into one JavaScript module (AMDJS, CommonJS, or Google module) without name mangling.",
                },
                {
                  title: "It’s OCaml!",
                  content: `30 years distilled research in PL and amazing effort of compiler engineering

Native backends: AMD64, IA32, PowerPC, ARM, SPARC

Language based OS: Mirage Unikernel`,
                },
              ]}
              layout="threeColumn"
            />
          </Container>

          <Container background="light" className="quickStartAndExamples homeCodeSnippet">
            <div>
              <h2>installation</h2>
              <Marked>
                {quickStart}
              </Marked>
            </div>
            <div>
              <h2>Examples</h2>
              <GridBlock
                className="examples"
                align="center"
                contents={siteConfig.examples.map(example => ({
                  title: example.name,
                  image: example.image,
                  imageLink: example.link,
                  imageAlign: "top",
                  content: "",
                }))}
                layout="twoColumn"
              />
          </div>
          </Container>

          <div className="productShowcaseSection paddingBottom">
            <h2>
              <translate>Projects Using BuckleScript</translate>
            </h2>
            <div className="logos">
              {showcase}
            </div>
            <div className="more-users">
              <a
                className="button"
                href={`${siteConfig.baseUrl}${this.props.language}/built-with-reason-react.html`}
              >
                <translate>See Full List</translate>
              </a>
            </div>
          </div>
        </div>
        <script src={siteConfig.baseUrl + 'js/redirectIndex.js'}></script>
      </div>
    );
  }
}

module.exports = Index;
