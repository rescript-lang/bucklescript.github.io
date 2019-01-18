---
title: Installation
---

**Prerequisite**: either NPM (comes with [node](https://nodejs.org/en/)) or [Yarn](https://yarnpkg.com/en/).

If you'd like to install BuckleScript globally, do:

```sh
yarn global add bs-platform
```

or

```sh
npm install -g bs-platform
```

This gives you a few globally exposed commands you can run, described later. But usually, you'd install the project locally:

```sh
yarn add --dev bs-platform
```

```sh
npm install --save-dev bs-platform
```

The commands that are exposed are:

- `bsb`, the build system.
- `bsc`, the raw compiler. Usually not used directly.
- `bsrefmt`, the included [Reason](https://reasonml.github.io) parser & printer.

## Weekly Alpha Releases

To help us catch regressions, feel free to tests features in the next release, now:

```sh
yarn add --dev bs-platform@next
```

Similar commands as previous section for `npm` and/or global installation.

Thank you for helping us!

## Alternatives (Power Users)

### Install From Source, Through NPM/Yarn

**Prerequisite**: either npm or yarn, plus the standard C toolchain.

```sh
git clone https://github.com/bucklescript/bucklescript
cd bucklescript
npm install
```

### Install From Source, Without NPM/Yarn

**Prerequisite**: the standard C toolchain (gcc, make).

First, build the OCaml compiler:

```sh
git clone https://github.com/bucklescript/bucklescript
cd bucklescript/vendor/ocaml
./configure -prefix `pwd` # put your preferred directory
make world.opt
make install
```

The patched compiler is installed locally into `$(pwd)/bin`. To start using it temporarily, check if `ocamlc.opt` and `ocamlopt.opt` exist in `$(pwd)/bin,` and temporarily add the location to your `$(PATH)` (e.g. `PATH=$(pwd)/bin:$PATH`).

Then, build BuckleScript itself:

```sh
cd ../../
make world
```

At the end, you should have a binary called `bsc.exe` under `jscomp/bin` directory, which you can add to your `$PATH`. You can also set an environment variable pointing to the standard library, e.g. `BSC_LIB=/path/to/jscomp/stdlib`, for ease of use.

**Warning:** the built compiler is not relocatable out of box, don’t move it around unless you know what you're doing!

## Troubleshooting

### Permission denied errors

Under some conditions, the global installation of `bs-platform` will result in npm errors, typically indicating `Error: EACCES: permission denied`. Here are some methods for resolving this problem.

#### Manually change npm’s default directory

Changing where NPM stores the package files may help, see the [second solution](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) on the [docs.npmjs.com](https://docs.npmjs.com/) site.

#### Enable the `unsafe-perm` npm option

While using `unsafe-perm` does have some drawbacks, it easily resolves the permissions issue. When the changing the default directory does not work, then this may be the next best option.

```sh
npm install -g bs-platform --unsafe-perm
```
