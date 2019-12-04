---
title: Upgrade Guide to v6 and above
---

If you have been using BuckleScript for the last couple of years, you'll
probably have noticed that upgrading to the newest version was always seamless
and without any breaking changes or performance loss. The BuckleScript team puts
a lot of effort in making sure that users can upgrade as soon as possible
without any changes in their workflow.

With some major underlying changes in BuckleScript v6 and above, upgrading will still
be quite easy, but will involve a few more installation steps (depending on your project setup).

This guide will give you some more insights on what has changed, and later give
you concrete instructions to upgrade your BuckleScript project.

## A Quick Look under the Hood

BuckleScript changed the underlying OCaml version from `4.02.3` (BS v5) to
`4.06`. Usually this shouldn't have any impact on existing codebases, unless
they are using PPXes or other meta programming binaries. PPXes rely on the the
data representation of the OCaml / Reason syntax, so if you are using a tool
such as `graphql_ppx` (which has usually been compiled natively with a `4.02.3`
OCaml version) you will get a compatibility error when used with BuckleScript
v6.

Luckily during the transition phase between v5 and v6 (which has been running
for several months), the community has been [coordinating
efforts](https://github.com/BuckleScript/bucklescript/issues/3914) to upgrade
and release commonly used tools to `4.06` compatible compile artifacts. You will
find all installation instructions in this guide as well.

### BS Version Overview / Features

- *BS 5.x and below*: OCaml 4.02.3
- *BS 6.x and above*: OCaml 4.06.1
    - Adds [`Inline
      Records`](https://caml.inria.fr/pub/docs/manual-ocaml/manual040.html)
      support (introduced with `4.03`)
- *BS 7.x and above*: OCaml 4.06.1 (dropped 4.02.3 support)
    - Adds the `Records-as-Objects` feature, which makes BS compile record type
      values into JS objects instead of nested arrays (see blog [post 1](/blog/2019/11/18/whats-new-in-7)
      and [post 2](/blog/2019/12/27/whats-new-in-7-cont))
    - Ships with `refmt` version `3.5.1` with greatly improved syntax error messages (codename `reerror`)

The biggest upside of upgrading to `4.06` is that we will finally be
deprecating OCaml `4.02.3`, which will make maintenance way easier (lots of
build infra code will be dropped). Also the OCaml community will greatly benefit
from this change, since a lot of OCaml libraries still support a minimum version
of `4.02.3` just for BuckleScript compatibility.

> We recommend to upgrade to v7 as soon as possible (v6 only if there are any
unlikely blocking issues). Your Reason code will still work as expected, you'll
only need to upgrade your native tools to make everything behave correctly

Please support us moving forward and help us by providing bug reports in case
you have any issues.

## How to upgrade

### Dependencies

**Note:** During the migration phase, some projects / repositories have changed
owners or Github organizations to make it easier for us to upgrade build
artifacts in the future. If you are using a PPX we are not aware of, please [let us
know in this issue](https://github.com/BuckleScript/bucklescript/issues/3914).

- **Upgrade your bs-platform dependency:**
    - `npm install bs-platform@7 --dev`
- **Upgrade your required PPXes:**
  - [`graphql_ppx`](https://github.com/mhallin/graphql_ppx) ->
    [`graphql_ppx_re`](https://github.com/baransu/graphql_ppx_re):
    - Remove the [deprecated `graphql_ppx` (by
      mhallin)](https://github.com/mhallin/graphql_ppx): `npm remove
      graphql_ppx`
    - Add the new one: `npm install @baransu/graphql_ppx_re --save-dev`
    - Update your `ppx-flags`: `"ppx-flags": ["@baransu/graphql_ppx_re/ppx6"]`
  - [`gentype`](https://github.com/cristianoc/genType):
    - `npm install gentype@3 --save-dev`
  - [`decco`](https://github.com/reasonml-labs/decco):
    - `npm install decco@1 --save-dev`
  - [`bs-let`](https://github.com/reasonml-labs/bs-let):
    - `npm install --save-dev bs-let`
    - Update your `ppx-flags`: `"ppx-flags": ["bs-let/ppx"]`
  - [`bs-emotion-ppx`](https://github.com/ahrefs/bs-emotion):
    - Currently running in internal beta, check the repo for updates
  - [`bs-log`](https://github.com/MinimaHQ/bs-log)
    - Currently WIP and [not done
      yet](https://github.com/MinimaHQ/bs-log/issues/10)
  - [`ppx_bs_css`](https://github.com/astrada/ppx_bs_css):
    - No upgrade activity yet, please [let us
      know](https://github.com/BuckleScript/bucklescript/issues/3914) if you are
      using it!
- **Clean & Rebuild your project:**
    - `npx bsb -clean-world`
    - `npx bsb -make-world`
    - Your project should now be built and working correctly
- **Fix specific warnings:**
    - `BuckleScript warning: isWebUri : the external name is inferred from val
      name is unsafe from refactoring when changing value name`
        - This  means that you have `external` bindings ending with `= "";`
          (which will automatically take the name of the binding itself), you
          now need to be explicit with the name. Example:
            ```reason
            /* Before (warning) */
            [@bs.module "valid-url"]
            external isWebUri: string => option(string) = "";

            /* After (fixed the warning) */
            [@bs.module "valid-url"]
            external isWebUri: string => option(string) = "isWebUri";
            ```
    - Don't forget to rebuild your project again
  
- **Commit your changes:**
    - Your `.bs.js` files will very likely change, make sure to commit
      everything to have a clean BS upgrade commit

### Editor extensions

- [`reason-vscode / reason-language-server`](https://github.com/jaredly/reason-language-server):
  Should just work, especially when upgraded to the newest version
- [`merlin`](https://github.com/ocaml/merlin): Make sure your `ocamlmerlin` binary is
  compiled for `4.06.1` and correctly set in your PATH, other than that it should just work
- [`reasonml-idea-plugin`](https://github.com/reasonml-editor/reasonml-idea-plugin): Upgrade to version `v0.76` or above


## How to upgrade PPXes (for tool maintainers)

### Step 1: Upgrade build dependencies

We recommend using [esy](https://esy.sh) for building your native project, so
all instructions are based on the `esy` workflows. Mostly it's about setting the
OCaml version to 4.06 and rebuild the project accordingly (e.g. in your `package.json`):

```json
"devDependencies": {
    "ocaml": "~4.6.1000",
    "@opam/dune": "*",
}
```

If you are using `migrate-parse-tree`, you might want to drop any AST upgrades
from 4.02 -> 4.06 etc, making the native binary more lightweight. 

**Tip:** If you still want to maintain a `4.02.3` based version (for legacy
reasons), you can alternatively create a `esy.json` / `esy-406.json` file and
use `esy's` [sandboxing
feature](https://esy.sh/docs/en/multiple-sandboxes.html#configure-multiple-sandboxes).

We know that these instructions are very rough, many projects use different
configurations. To give you some inspiration on how to tackle an upgrade, here
is a list of migrations / project setups you might find useful:

- `bs-emotion-ppx`: [Full migration diff by anmonteiro](https://github.com/ahrefs/bs-emotion/commit/d93f35754d2ba3000d5ffa9fe17ae158da6dfc38)
- `graphql_ppx_re`: [package.json with 4.06
  support](https://github.com/baransu/graphql_ppx_re/blob/master/esy.json) //
  [402.json for esy
  sandbox](https://github.com/baransu/graphql_ppx_re/blob/master/402.json)
- `decco`: [package.json for 4.06](https://github.com/reasonml-labs/decco/blob/master/ppx_src/package.json)

### Step 2: Release artifacts and add a proper Note in the README

Make sure to release the newly built binary on npm and make clear which PPX versions are compatible with BS6 / BS5 etc.
For example, this is how `gentype` does it:

```text
bs-platform 7.0.0 or higher: use genType 3.2.0 or higher.
bs-platform 6.2.0 or higher: use genType 3.0.0 or higher.
bs-platform 5.2.0 or higher: use genType 2.40.0 or higher.
bs-platform 5.0.x and 5.1.x: use genType 2.17.0 or higher.
```


## Conclusion

We are really excited for the upcoming future of BuckleScript. The v7 release
will make JS interop considerably easier while being completely compatible with
existing codebases.

If you are experiencing any installation / upgrade issues, please be sure to
either check the BuckleScript [issue
tracker](https://github.com/bucklescript/bucklescript/issues), or drop us a
message in [Discord](https://discord.gg/reasonml).
 