const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

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
const pre = "```";
const codeExample =`${pre}ocaml
let result =
  [|1; 2; 3; 4|]
  |. Belt.Array.keep (fun x -> x > 2)
  |. Belt.Array.mapWithIndex (fun x i -> x + i)
  |. Belt.Array.reduce 0 (fun x y -> x + y)
  |. Js.log
${pre}`;
const codeExampleReason =`${pre}reason
let result =
  [|1, 2, 3, 4|]
  -> Belt.Array.keep(x => x > 2)
  -> Belt.Array.mapWithIndex((x, i) => x + i)
  -> Belt.Array.reduce(0, (x, y) => x + y)
  -> Js.log;
${pre}`;

const quickStart = `${pre}bash
npm install -g bs-platform

# OCaml syntax
bsb -init my-new-project

# Reason syntax
bsb -init my-new-project -theme basic-reason
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
                "/installation"
              }
            >
              <translate>Get Started</translate>
            </Button>
            <Button href="https://reasonml.github.io/docs/en/interop">
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

          <div className="wrapper homeWrapper">
            <div className="projectTitle">{siteConfig.title}</div>

            <div className="homeWrapperInner">
              <div className="homeTagLine">{siteConfig.tagline}</div>
              <div className="homeCodeSnippet">
                <div className="homeCodeSnippet-reason">
                  <MarkdownBlock>{codeExampleReason}</MarkdownBlock>
                </div>
                <div className="homeCodeSnippet-ocaml">
                  <MarkdownBlock>{codeExample}</MarkdownBlock>
                </div>
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
          <a href={user.infoLink} key={user.caption}>
            <img src={`${siteConfig.baseUrl}${user.image}`} title={user.caption} />
          </a>
        );
      });

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Container>
            <GridBlock
              align="center"
              contents={[
                {
                  title: "Lean Developer Experience",
                  content: "Simple, small and blazing fast build workflow. No more configuration debugging!",
                },
                {
                  title: "The Whole JS Ecosystem",
                  content: "**Readable** output & comprehensive support for talking to existing JavaScript code.",
                },
                {
                  title: "Solid, Stable & Performant",
                  content: "Decades of **type system** research and compiler engineering. Tools you can rely on!",
                },
              ]}
              layout="threeColumn"
            />
          </Container>

          <Container background="light" className="quickStartAndExamples homeCodeSnippet">
            <div>
              <h2><translate>QuickStart</translate></h2>
              <div>
                <translate>BuckleScript seamlessly integrates with</translate>
                {' '}
                <a href="https://reasonml.github.io">Reason</a>.
              </div>
              <MarkdownBlock>
                {quickStart}
              </MarkdownBlock>
            </div>
            <div>
              <h2><translate>Examples</translate></h2>
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
                href={`${siteConfig.baseUrl}${this.props.language}/built-with-bucklescript`}
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
