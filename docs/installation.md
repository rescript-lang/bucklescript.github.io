\#\# Installation

Below is a list of different ways to install BuckleScript:

\# Windows Installation

    npm install bs-platform

\# \*nix installation

-   Standard C toolchain

-   `npm` (should be installed with Node)

The standard `npm` package management tool can be used to install
BuckleScript. If you don’t already have `npm` installed, follow the
directions listed
[here](https://docs.npmjs.com/getting-started/installing-node). Once
`npm` is installed, run the following command:

    npm install --save bs-platform

or install it globally

    npm install -g bs-platform

\# **Recommended** installation with OPAM

When working with OCaml we also recommend using
[opam](https://opam.ocaml.org) package manager to install OCaml
toolchains, available [here](https://opam.ocaml.org/doc/Install.html).
You will benefit from the existing OCaml ecosystem.

Once you have `opam` installed, ask `opam` to switch to using our
version of the compiler:

    opam update
    opam switch 4.02.3+buckle-master
    eval `opam config env`
    npm install bs-platform

Note that using this approach, the user can also install other OCaml
tools easily.

\# Install from source

\#\# using NPM

1.  Standard C toolchain

2.  `npm` (should be installed with Node)

**Instructions:.**

    git clone https://github.com/bucklescript/bucklescript
    cd bucklescript
    npm install

\#\# Minimal dependencies

1.  Standard C toolchain

BuckleScript has very few dependencies and building from source can
easily be done.

**Build OCaml compiler.**

    git clone https://github.com/bucklescript/bucklescript
    cd bucklescript/vendor/ocaml
    ./configure -prefix `pwd` # put your preferred directory
    make world.opt
    make install

The patched compiler is installed locally into your `$(pwd)/bin`
directory. To start using it temporarily, check if `ocamlc.opt` and
`ocamlopt.opt` exist in `$(pwd)/bin`, and temporarily add the location
to your `$(PATH)` (e.g. `PATH=$(pwd)/bin:$PATH`).

**Building BuckleScript.**

The following directions assume you already have the correct version of
`ocamlopt.opt` in your `$PATH`, having followed the process described in
the previous section.

    cd ../../jscomp
    make world

At the end, you should have a binary called `bsc.exe` under `jscomp/bin`
directory, which you can add to your `$PATH`. You could also set an
environment variable pointing to the stdlib, e.g.
`BSC_LIB=/path/to/jscomp/stdlib` for ease of use.

> **Warning**
>
> The built compiler is not *relocatable* out of box, please don’t move
> it around unless you know what you are doing
