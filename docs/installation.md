---
title: Installation
---

**Prerequisite**: either NPM (comes with [node](https://nodejs.org/en/)) or [Yarn](https://yarnpkg.com/en/).

If you'd like to install BuckleScript globally, do:

```sh
npm install -g bs-platform
```

This gives you a few globally exposed commands you can run, described later. But usually, you'd install the project locally:

```sh
npm install --save-dev bs-platform
```

**Note that for Windows**, if you're using BuckleScript in conjunction with a tool like [Merlin](https://reasonml.github.io/guide/editor-tools/extra-goodies#merlin), please follow [this guide that we share with Reason](https://github.com/reasonml/reasonml.github.io/issues/195).

The commands that are exposed are:

- `bsb`, the build system.
- `bsc`, the raw compiler. Usually not used directly.
- `bsrefmt`, the included [Reason](https://reasonml.github.io) parser & printer.

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
cd ../../jscomp
make world
```

At the end, you should have a binary called `bsc.exe` under `jscomp/bin` directory, which you can add to your `$PATH`. You can also set an environment variable pointing to the standard library, e.g. `BSC_LIB=/path/to/jscomp/stdlib`, for ease of use.

**Warning:** the built compiler is not relocatable out of box, don’t move it around unless you know what you're doing!
