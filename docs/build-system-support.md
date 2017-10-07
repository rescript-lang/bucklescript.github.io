Build system support
====================

The BuckleScript compilation model is similar to OCaml native compiler.
If `b.ml` depends on `a.ml`, you have to compile `a.ml` **and** `a.mli`
first.

> **Note**
>
> The technical reason is that BuckleScript will generate intermediate
> files with the extension `.cmj` which are later used for cross module
> inlining, arity inference and other information.

BuckleScript build system: `bsb`
--------------------------------

BuckleScript provides a native build tool on top of Google’s
[ninja-build](https://github.com/ninja-build/ninja/releases). It is
designed for a fast feedback loop (typically 100ms feedback loop) and
works cross platform.

`bsb` is a schema based build tool. The schema is after you finish
reading the tutorials below.

If your editor supports JSON schema validation and auto-completion like
[VSCode](https://code.visualstudio.com/docs/languages/json), below is a
configuration to help you get auto-completion and validation for free:

**settings.json.**

    {
        "json.schemas": [
            {
                "fileMatch": [
                    "bsconfig.json"
                ],
                "url" : "file:///path/to/bucklescript/docs/docson/build-schema.json" // 
            }
        ],
        // ....
    }

The build system is installed as `bsb.exe` in `bs-platform/bin/bsb.exe`.
Due to a known issue in npm, we create a JS wrapper (which is accessible
in `.bin` too) so the user can call either `bsb` (slightly higher
latency but symlinked into `.bin`) or `bsb.exe`

Here is a **minimal** configuration:

**bsconfig.json.**

    {
      "name": "test", // package name, required 
      "sources": "src" // 
    }

-   It is an extension to JSON with comment support

-   Here we did not list files, so all `.ml`, `.mli`, `.re`, `.rei` will
    be considered as source files

The entry point is `bsb`. It will check if there is already
`build.ninja` in the build directory, and if not or it needs to be
regenerated it will generate the file `build.ninja` and delegate the
hard work to `ninja`.

The directory layout (after building) would be

    .
    ├── lib
    │   ├── bs
    │   │   ├── src
    │   │   └── test
    │   ├── js
    │   │   ├── src
    │   │   └── test
    │   ├── amdjs // 
    │   │   ├── src
    │   │   └── test
    │   ├── es6  // 
    │   │   ├── src
    │   │   └── test
    │   └── ocaml
    ├── scripts
    ├── src
    └── test

-   Will generate AMDJS modules if flags are turned on

-   Will generate ES6 modules if flags are turned on

We wrap `bsb.exe` as `bsb` so that it will work across different
platforms.

**Watch mode.**

    bsb // 
    bsb -w // 

-   Do the plain build

-   Do the plain build and watch

### Build with other BuckleScript dependencies

List your dependency in `bs-dependencies` and install it via
`npm install` as below:

**bsconfig.json.**

    {
        "name": "bs-string",
        "version": "0.1.3",
        "bs-dependencies": [
            "bs-mocha" // 
        ],
        "sources": [
           .. .
        ],
        "generate-merlin" : false // 
    }

-   Yet another BuckleScript dependency

-   If true (default) bsb will generate merlin file for you

**package.json.**

    {
     "dependencies": {
        "bs-mocha": "0.1.5"
        },
      ...
    }

After your `npm install`,

    bsb -clean-world // 
    bsb -make-world // 
    bsb -w // 

-   Clean the binary artifact of current build and your dependency

-   Build dependencies and lib itself

-   Start watching the project and whenever your changes are made, `bsb`
    will rebuild incrementally

You can also streamline the three commands as below:

    bsb -clean-world -make-world -w

### Mark your directory as dev only

Note sometimes, you have directories which are just tests that you don’t
need your dependency to build. In that case you can mark it as dev only:

**bsconfig.json.**

    {
            "sources" : {
                    "dir" : "test",
                    "type" : "dev" // 
            }
    }

-   directory `test` is in dev mode, it will not be built when used as a
    dependency

A real world example of using `bsb`
-----------------------------------

Below is a json configuration for the
[bucklescript-tea](https://github.com/OvermindDL1/bucklescript-tea): the
Elm artchitecture in BuckleScript

**bsconfig.json.**

    {
      "name": "bucklescript-tea",
      "version": "0.1.3",
      "sources": [
       "src", // 
        {
          "dir": "test",
          "type": "dev" // 
        }
      ]
    }

-   Source directory, by default it will export all units of this
    directory to users.

-   Dev directory, which will only be useful for developers of this
    project.

**package.json.**

    {
      "name": "bucklescript-tea",
      "version": "0.1.3",
      "description": "TEA for Bucklescript",
      "scripts": {
        "build": "bsb",
        "watch": "bsb -w",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "peerDependencies": {
        "bs-platform": "^1.7.0" // 
      }
    }

-   Here we list `bs-platform` as a peer dependency so that different
    repos shares the same compiler.

Now, we have a repo
[bucklescript-have-tea](https://github.com/bobzhang/bucklescript-have-tea)
to depend on `bucklescript-tea`, its configurations are as below:

**bsconfig.json.**

    {
        "name" : "bucklescript-have-tea",
        "sources" : "src",
        "bs-dependencies": [
          "bucklescript-tea"
        ]
    }

**package.json.**

    {
        "name" : "bucklescript-have-tea",
        "version" : "0.1.0",
        "dependencies" : { "bucklescript-tea" : "^0.1.2" }, // 
        "peerDependencies" : { "bs-platform" : "^1.7.0" } //
    }

-   List `bucklescript-tea` as dependency

-   List `bs-platform` as peer dependency

Suppose you are in `bucklescript-have-tea` top directory,

    npm install // 
    npm install bs-platform 
    ./node_modules/.bin/bsb -clean-world -make-world -w 

-   Install the dependencies

-   Install peer dependencies

-   On Windows, it would be
    `.\node_modules\.bin\bsb -clean-world -make-world -w`

You can also change the `package-specs` to have another module format,
for example, tweak your `bsconfig.json`:

    {
      ... ,
      "package-specs" : ["amdjs", "commonjs"],
      ...
    }

Rerun the command

    bsb -clean-world -make-world

You will get both `commonjs` and `amdjs` support. In the end, we suggest
you [check out the
schema](http://bucklescript.github.io/bucklescript/docson/#build-schema.json)
and enjoy the build!

namespace support (@since 1.9.0)
--------------------------------

OCaml treat file names as modules, so that users can only have unique
file names in a project, BuckleScript solves the problem by scoping all
modules by package.

Below is the `bsconfig.json` for `liba`, `libb` (they share the same
configuration in this example)

    {
      "name": "liba",
      "version": "0.1.0",
      "sources": "src",
      "namespace": true
    }

Now you have a library to use them

    {
      "name": "namespace",
      "version": "0.1.0",
      "sources": "src",
      "bs-dependencies": [
        "liba",
        "libb"
      ]
    }

Since `liba` and `libb` is configured using namespace, to use them in
source code, it would be like

    let v =
        (Liba.Demo.v + Libb.Demo.v)

> **Note**
>
> In the same package, everything works the same whether it uses
> namespace or not, it only affect people who use your library

In source build support (@since 1.9.0)
--------------------------------------

When user has an existing JS project, it makes sense to output the JS
file in the same directory as vanilla JS, the schema added a key called
`in-source` so that generate JS file next to ML file.

Build using Make
----------------

> **Warning**
>
> `bsb` is the officially recommended build system. This section is
> included here only for people who are *curious* about how the build
> works.

BuckleScript distribution has `bsdep.exe` which has the same interface
as `ocamldep`

Here is a simple Makefile to get started:

**Makefile.**

    OCAMLC=bsc.exe # 
    OCAMLDEP=bsdep.exe # 
    SOURCE_LIST := src_a src_b
    SOURCE_MLI = $(addsuffix .mli, $(SOURCE_LIST))
    SOURCE_ML  = $(addsuffix .ml, $(SOURCE_LIST))
    TARGETS := $(addsuffix .cmj, $(SOURCE_LIST))
    INCLUDES=
    all: $(TARGETS)
    .mli:.cmi
            $(OCAMLC) $(INCLUDES) $(COMPFLAGS) -c $<
    .ml:.cmj:
            $(OCAMLC) $(INCLUDES) $(COMPFLAGS) -c $<
    -include .depend
    depend:
            $(OCAMLDEP) $(INCLUDES) $(SOURCE_ML) $(SOURCE_MLI) > .depend

-   bsc.exe is the BuckleScript compiler

-   ocamldep executable is part of the OCaml compiler installation

In theory, people need run `make depend && make all`. `make depend` will
calculate dependencies while `make all` will do the job.

However in practice, people used to a file watch service, such as
[watchman](https://facebook.github.io/watchman/) for example, will need
the JSON configuration:

**build.json.**

    [
        "trigger", ".", {
            "name": "build",
            "expression": ["pcre", "(\\.(ml|mll|mly|mli|sh|sh)$|Makefile)"], // 
            "command": ["./build.sh"],
            "append_files" : true
        }
    ]

-   whenever such files changed, it will trigger `command` field to be
    run

**build.sh.**

    make -r -j8 all 
    make depend // 

-   build

-   update the dependency

Now in your working directory, type `watchman -j < build.json` and enjoy
the lightning build speed.

Customize rules (generators support, @since 1.7.4)
--------------------------------------------------

It is quite common that programmers use some pre-processors to generate
some bolierpolate code during developement.

Note pre-processors can be classified as two categories, one is
system-dependent which should be delayed until running on user machines,
the other is system-indepdent , lex, yacc, m4, re2c, etc, which could be
executed anytime.

BuckleScript has built in support for conditional compilation, this
section is about the second part, since it is system-indepdent, we ask
users to always generate such code and check in before shipping, this
would help cut the dependencies for end users.

A typical example would be like this

**Bsb using ocamlyacc.**

    {
        "generators" : [
            { "name" : "ocamlyacc" ,
              "command" : "ocamlyacc $in" }
        ],
        ...,
        "sources" : {
            "dir" : "src",
            "generators" : [
                {
                    "name" : "ocamlyacc",
                    "edge" : ["test.ml", "test.mli", ":", "test.mly"]
                }
            ]
        }
    }

Note `ocamlyacc` will generate in `test.ml` and `test.mli` in the same
directory with `test.mly`, user should check in generated file since
then users would not need run ocamlyacc again, this would apply to
`menhir` as well.

When users are developing current project, `bsb` will track the
dependencies between `test.ml` and `test.mly` properly, when released as
a package, `bsb` will cut such dependency, so that users will only need
the generated `test.ml`, to help test such behavior in development mode,
users could set it manually

    {
        ...,
        "cut-generators" : true
    }

Then `bsb` will not re-generate `test.ml` whenever `test.mly` changes.
