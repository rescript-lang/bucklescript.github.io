---
id: manual
title: Manual
---
\# [BuckleScript](https://github.com/bucklescript/bucklescript) User
Manual Hongbo Zhang v1.9.0 :toc: left :toclevels: 4 :source-highlighter:
pygments :page-layout: docs :uri-ad-org-issues:
<https://github.com/bucklescript/bucklescript/issues> :OCaml:
<https://ocaml.org/> :Reason: <https://github.com/facebook/Reason>
:BuckleScript: <https://github.com/bucklescript/bucklescript>
:BuckleScript-playground:
<https://bucklescript.github.io/bucklescript-playground/> :closure:
<https://developers.google.com/closure/compiler/> :transpile-list:
<https://github.com/jashkenas/coffeescript/wiki/list-of-languages-that-compile-to-js>
:name-mangling: <https://en.wikipedia.org/wiki/Name_mangling> :npm:
<https://www.npmjs.com> :issues:
<https://github.com/bucklescript/bucklescript/issues> :schema:
<http://bucklescript.github.io/bucklescript/docson/#build-schema.json>
:sectanchors: :sectlinks:

docsearch({ apiKey: '0fd97db83891aa20810559812d9e69ac', indexName:
'bucklescript', inputSelector: '\#agolia-search', debug: false // Set
debug to true if you want to inspect the dropdown });
whole compiler is compiled into JS (and ASM) so that you can play with
it

> **Note**
>
> Documentation under
> [*bucklescript.github.io*](https://bucklescript.github.io/bucklescript/Manual.html)
> match the [master
> branch](https://github.com/bucklescript/bucklescript).
>
> If you find errors or omissions in this document, please don’t
> hesitate to submit an issue, sources are
> [here](https://github.com/bucklescript/bucklescript/tree/master/site/docsource).

\#\# Why BuckleScript

\# Benefits of JavaScript platform

JavaScript is not just *the* browser language, it’s also the *only*
existing cross platform language. It is truly everywhere: users don’t
need to install binaries or use package managers to access software,
just a link will work.

Another important factor is that the JavaScript VM is quite fast and
keeps getting faster. The JavaScript platform is therefore increasingly
capable of supporting large applications.

\# Problems of JavaScript && how BuckleScript solves them

BuckleScript is mainly designed to solve the problems of *large scale*
JavaScript programming:

Type-safety  
OCaml offers an industrial-strength state-of-the-art type system and
provides very strong type inference (i.e. No verbose type annotation
required compared with TypeScript), which proves
[invaluable](http://programmers.stackexchange.com/questions/215482/what-are-the-safety-benefits-of-a-type-system)
in managing large projects. OCaml’s type system is not just for tooling,
it is a *sound* type system which means it is guaranteed that there will
be no runtime type errors after type checking.

High quality dead code elimination  
A large amount of web-development relies on inclusion of code
dependencies by copying or referencing CDNs (the very thing that makes
JavaScript highly accessible), but this also introduces a lot of [dead
code](https://en.wikipedia.org/wiki/Dead_code). This impacts performance
adversely when the JavaScript VM has to interpret code that will never
be invoked. BuckleScript provides powerful dead-code elimination at all
levels:

-   Function and module level elimination is facilitated by the
    sophistication of the type-system of OCaml and *purity analysis*.

-   At the global level BuckleScript generates code ready for dead-code
    elimination done by bundling tools such as the

Offline optimizations  
JavaScript is a dynamic language, it takes a performance-hit for the VM
to optimize code at runtime. While some JS engines circumvent the
problem to some extent by
[caching](http://v8project.blogspot.com/2015/07/code-caching.html), this
is not available to all environments, and lack of a strong type system
also limits the level of optimizations possible. Again, BuckleScript,
using features of the OCaml type-system and compiler implementation is
able to provide many optimizations during offline compilation, allowing
the runtime code to be extremely fast.

JS platform and Native platform  
Run your programs on all platforms, but run your system *faster* under
specific platforms. JavaScript is everywhere but it does not mean we
have to run all apps in JS, under several platforms, for example, server
side or iOS/Android native apps, when programs are written in OCaml, it
can also be compiled to native code for *better and reliable
performance*.

While a strong type-system helps in countering these problems, at the
same time we hope to avoid some of the problems faced in using other

Slow compilation  
OCaml byte-code compilation is known to be fast (one or two orders of
magnitude faster than other similar languages:
[Scala](http://www.scala-lang.org/) or
[Haskell](https://www.haskell.org/)), BuckleScript shares the same
property and compiles even faster since it saves the link time. See the
speeds at work in the order faster than the JS backend.

Un-readable JS Code and hard to integrate with existing JS libraries  
When compiling to JavaScript, many systems generate code, that while
syntactically and semantically correct is not human-readable and very
difficult to debug and profile. Our BuckleScript implementation and the
multi-pass compilation strategy of OCaml, and produce JavaScript code
that is human-readable and easier to debug and maintain. More
importantly, this makes integration with existing JS libraries *much
easier*.

Large JS output even for a simple program  
In BuckleScript, a `Hello world` program generates *20 bytes* JS code
instead of *50K bytes*. This is due to BuckleScript having an excellent
integration with JS libs in that unlike most JS compilers, all
BuckleScript’s runtime is written in OCaml itself so that these runtime
libraries are only needed when user actually calls it.

Loss of code-structure  
Many systems generate JavaScript code that is essentially a [big ball of
mud](https://en.wikipedia.org/wiki/Big_ball_of_mud). We try to keep the
original structure of the code by mapping one OCaml module to one JS
module.

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

\#\# Get Started

\# Using existing templates (@since 1.7.4 )

BuckleScript provide some project templates, to help people get started
on board as fast as possible.

    npm install -g bs-platform && bsb -init hello && cd hello && npm run build

First, it installs `bs-platform` globally, then we use the command line
tool `bsb` to set up a sample project named `hello`, then we run the
build.

The output project layout is similar as below

    hello>tree -d .
    .
    |---.vscode
    ├── lib
    │   ├── bs
    │   │   └── src
    │   └── js
    │       └── src
    ├── node_modules
    │   └── bs-platform -> ...
    └── src

To enter watch mode, you can run `npm run watch`, then you can edit
`src/demo.ml` and see it compiled on the fly, and changes are updated on
`lib/js/src/demo.js`

If you happen to use VSCode as editor, we provide `.vscode/tasks.json`
as well, type `Tasks>build`, it will enter watch mode, the great thing
is that VSCode comes with a `Problems` panel which has a much nicer UI.

Currently there are not too many project templates, you can contribute
more project templates here
[here](https://github.com/bucklescript/bucklescript/tree/master/jscomp/bsb/templates),

\# First example by hand without samples

-   Create a directory called `hello` and create `bsconfig.json` and
    `package.json` as below:

+

**bsconfig.json.**

    {
        "name" : "hello",
        "sources" : { "dir" : "src"}
    }

+

**package.json.**

    {
        "dependencies": {
            "bs-platform": "1.7.0" //
        },
        "scripts" : {
            "build" : "bsb",
            "watch" : "bsb -w" //
        }
    }

-   Version should be updated accordingly

-   Watch mode when developing

    -   Create `src/main_entry.ml` as below:

        **src/main\_entry.ml.**

            let () =
              print_endline "hello world"

    -   Build the app

            npm run build

Now you should see a file called `lib/js/src/main_entry.js` generated as
below:

**lib/js/src/main\_entry.js.**

    // GENERATED CODE BY BUCKLESCRIPT VERSION 1.0.1 , PLEASE EDIT WITH CARE
    'use strict';


    console.log("hello world");

    /*  Not a pure module */

-   The compiler detects this module is impure due to the side effect.

User can also run `watch` mode to see changes instantly while editing.

    npm run watch

> **Tip**
>
> The working code is available
> [here](https://github.com/bucklescript/bucklescript-addons/tree/master/examples/hello):

\# An example with multiple modules

Now we want to create two modules, one file called `fib.ml` which
exports `fib` function, the other module called `main_entry.ml` which
will call `fib`.

-   Create a directory `fib` and create files `bsconfig.json` and
    `package.json`

    **bsconfig.json.**

        {
            "name" : "helo",
            "sources" : { "dir" : "src"}
        }

    **package.json.**

        {
            "dependencies": {
                "bs-platform": "1.7.0"
            },
            "scripts" : {
                "build" : "bsb",
                "watch" : "bsb -w"
            }
        }

-   Create file `src/fib.ml` and file `src/main_entry.ml`

    **src/fib.ml.**

        let fib n =
          let rec aux n a b =
            if n = 0 then a
            else
              aux (n - 1) b (a+b)
          in aux n 1 1

    **src/main\_entry.ml.**

        let () =
          for i = 0 to 10 do
            Js.log (Fib.fib i)
          done

    -   [`Js`](../api/Js.html) module is a built-in module shipped with
        BuckleScript

-   Build the app

        npm install
        npm run build
        node lib/js/src/main_entry.js

If everything goes well, you should see the output as below:

    1
    1
    2
    3
    5
    8
    13
    21
    34
    55
    89

\#\# Built in NPM support

\# Build an OCaml library as a npm package

BuckleScript build system has built in support for NPM packages, please
checkout the section about the bsb for NPM support.

> **Note**
>
> This section covers some basics of how NPM is supported internally,
> normal users are safe to skip this section.

BuckleScript extends the OCaml compiler options with several flags to
provide a better experience for NPM users.

In general, you are expected to see two kinds of build artifacts, the
generated JS files and metadata which your OCaml dependencies rely on.

Since CommonJS has no namespaces, to allow JS files to live in different
directories, we have a flag

    bsc.exe -bs-package-name $npm_package_name -bs-package-output modulesystem:path/to/your/js/dir -c a.ml

By passing this flag, `bsc.exe` will store your `package_name` and
relative path to `package.json` in `.cmj` files. It will also generate
JS files in the directory you specified. You can, and are encouraged to,
store JavaScript files in a hierarchical directory.

For the binary artifacts (Note that this is not necessary if you only
want your libraries to be consumed by JS developers, and it has benefit
since end users don’t need these binary data any more), the convention
is to store all `*.cm` data in a *single* directory
`package.json/lib/ocaml` and Javascript files in a *hierachical*
directory like `package.json/lib/js`

\# To use OCaml library as a npm package

If you follow the layout convention above, using an OCaml package is
pretty straightforward:

    bsc.exe -I path/to/ocaml/package/installed -c a.ml

\# Together

Your command line would be like this:

    bsc.exe -I path/to/ocaml/package1/installed -I path/to/ocaml/package2/installed  -bs-package-name $npm_package_name -bs-package-output commonjs:path/to/lib/js/ -c a.ml

\# Examples

Please visit <https://github.com/bucklescript/bucklescript-addons> for
more examples.

\#\# JS Calling OCaml

Since BuckleScript guarantees that all OCaml functions are exported as
is, no extra work is required to expose OCaml functions to JavaScript.

> **Caution**
>
> -   `external` exports are not exported as JS functions, if you really
>     want to export those external functions, please write `val`
>     instead
>
> -   `operators` are escaped, since Javascript does not support user
>     defined operators. For example, instead of calling
>     `Pervasives.(^)`, you have to call `Pervasives.$caret` from your
>     JavaScript functions
>
If users want to consume some OCaml features only available in OCaml but
not in JS, we recommend users to export it as functions.

For example, data constructors are not available in JS

      type t =
        | Cons of int * t
        | Nil

Currently, we recommend the user expose the constructor as a function so
that it can be constructed from the JS side.

    let cons x y = Cons (x,y)
    let nil = Nil

> **Note**
>
> In the future, we will derive these functions to automate this
> process.

\#\# BuckleScript annotations for Unicode and JS FFI support

To make OCaml work smoothly with JavaScript, we introduced several
extensions to the OCaml language. These BuckleScript extensions
facilitate the integration of native JavaScript code and improve the
generated code.

\# Unicode support (@since 1.5.1)

> **Warning**
>
> In this section, we assume the source is encoded using UTF8.

In OCaml, string is an immutable byte sequence (like GoLang), so if the
user types some Unicode

    Js.log "你好"

It will be translated into

    console.log("\xe4\xbd\xa0\xe5\xa5\xbd");

Luckily, OCaml allows customized multiple-line string support,
BuckleScript **reserves** the delimiter `js` and `j` (`j` is unused so
far).

**Input:.**

    Js.log {js|你好，
    世界|js}

**Output:.**

    console.log("你好，\n世界");

Inside the `js` delimiter, the escape convention is like JavaScript

    Js.log {js|\x3f\u003f\b\t\n\v\f\r\0"'|js}

**Output:.**

    console.log("\x3f\u003f\b\t\n\v\f\r\0\"\'");

\#\# Unicode support with string interpolation (@since 1.7.0)

Like `{js||js}`, `{j||j}` not only allow unicode point, but also
variable interpolation.

For example

    let world = {j|世界|j}
    let hello_world = {j|你好，$world|j}

Users can parenthesize the interpreted variable as below:

    let hello_world = {j|你好，$(world)|j}

Note the syntax of interpolated variable is intentionally designed to be
simple. Its lexical convention is as below:

    identifier := leading_identifier_char identifier_chars
    leading_identifier_char := 'a' .. 'z' | '_'
    identifier_chars := 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' | '\'

\# FFI

Like TypeScript, when building type-safe bindings from JS to OCaml,
users have to write type declarations. In OCaml, unlike TypeScript,
users do not need to create a separate `.d.ts` file, since the type
declarations are an integral part of OCaml.

The FFI is divided into several components:

-   Binding to simple functions and values

-   Binding to high-order functions

-   Binding to object literals

-   Binding to classes

-   Extensions to the language for debugger, regex, and embedding
    arbitrary JS code

\# Binding to simple JS functions values

This part is similar to [traditional
FFI](http://caml.inria.fr/pub/docs/manual-ocaml-4.02/intfc.html), with
syntax as described below:

    external value-name : typexpr = external-declaration attributes
    external-declaration := string-literal

Users need to declare types for foreign functions (JS functions for
BuckleScript or C functions for native compiler) and provide customized
`attributes`.

\#\# Binding to global value: `bs.val`

    external imul : int -> int -> int = "Math.imul" [@@bs.val]
    type dom
    (* Abstract type for the DOM *)
    external dom : dom = "document" [@@bs.val]

`bs.val` attribute is used to bind to a JavaScript value, it can be a
function or plain value.

> **Note**
>
> -   If `external-declaration` is the same as `value-name`, the user
>     can leave `external-declaration` empty. For example:
>
>         external document : dom = "" [@@bs.val]
>
> -   If you want to make a single FFI for both C functions and
>     JavaScript functions, you can give the JavaScript foreign function
>     a different name:
>
>         external imul : int -> int -> int =
>           "c_imul" [@@bs.val "Math.imul"]
>
\#\# Scoped values: `bs.scope` (@since 1.7.2)

In JS library, it is quite common to use a name as namespace, for
example, if the user want to write a binding to
`vscode.commands.executeCommand`, assume `vscode` is a module name, the
user needs to type `commands` properly before typing `executeCommand`,
and in practice, it is rarely useful to call `vscode.commands` alone,
for this reason, we introduce a convient sugar: `bs.scope`

**Example.**

    type param
    external executeCommands : string -> param array -> unit = ""
    [@@bs.scope "commands"] [@@bs.module "vscode"][@@bs.splice]

    let f a b c  =
      executeCommands "hi"  [|a;b;c|]

**Output:.**

    var Vscode = require("vscode");
    function f(a, b, c) {
      Vscode.commands.executeCommands("hi", a, b, c);
      return /* () */0;
    }

NOTE `bs.scope` can also be chained as below:

**Example.**

    external makeBuffer : int -> buffer = "Buffer"
    [@@bs.new] [@@bs.scope "global"]
    external hi : string = ""
    [@@bs.module "z"] [@@bs.scope "a0", "a1", "a2"]
    external ho : string = ""
    [@@bs.val] [@@bs.scope "a0","a1","a2"]
    external imul : int -> int -> int = ""
    [@@bs.val] [@@bs.scope "Math"]
    let f2 ()  =
      makeBuffer 20 , hi , ho, imul 1 2

**Output:.**

    var Z      = require("z");
    function f2() {
      return /* tuple */[
              new (global.Buffer)(20),
              Z.a0.a1.a2.hi,
              a0.a1.a2.ho,
              Math.imul(1, 2)
            ];
    }

\#\# Binding to JavaScript constructor: `bs.new`

`bs.new` is used to create a JavaScript object.

    type t
    external create_date : unit -> t = "Date" [@@bs.new]
    let date = create_date ()

**Output:.**

    var date = new Date();

\#\# Binding to a value from a module: `bs.module`

**Input:.**

    external add : int -> int -> int = "add" [@@bs.module "x"]
    external add2 : int -> int -> int = "add2"[@@bs.module "y", "U"] //
    let f = add 3 4
    let g = add2 3 4

-   `"U"` will hint the compiler to generate a better name for the
    module, see output

**Output:.**

    var U = require("y");
    var X = require("x");
    var f = X.add(3, 4);
    var g = U.add2(3, 4);

> **Note**
>
> -   if `external-declaration` is the same as `value-name`, it can be
>     left empty, for example,
>
>         external add : int -> int -> int = "" [@@bs.module "x"]
>
\#\# Binding the whole module as a value or function

    type http
    external http : http = "http" [@@bs.module] //

-   `external-declaration` is the module name

> **Note**
>
> -   if `external-declaration` is the same as `value-name`, it can be
>     left empty, for example:
>
>         external http : http = "" [@@bs.module]
>
\#\# Binding to method: `bs.send`, `bs.send.pipe`

`bs.send` helps the user send a message to a JS object.

    type id (** Abstract type for id object *)
    external get_by_id : dom -> string -> id =
      "getElementById" [@@bs.send]

The object is always the first argument and actual arguments follow.

**Input:.**

    get_by_id dom "xx"

**Output:.**

    document.getElementById("xx");

`bs.send.pipe` is similar to `bs.send` except that the first argument,
i.e, the object, is put in the position of last argument to help user
write in a *chaining style*:

    external map : ('a -> 'b [@bs]) -> 'b array =
      "" [@@bs.send.pipe: 'a array] //
    external forEach: ('a -> unit [@bs]) -> 'a array =
      "" [@@bs.send.pipe: 'a array]
    let test arr =
        arr
        |> map (fun [@bs] x -> x + 1)
        |> forEach (fun [@bs] x -> Js.log x)

-   For the `[@bs]` attribute in the callback, see
    [???](#Binding to callbacks (high-order function))

> **Note**
>
> -   if `external-declaration` is the same as `value-name`, it can be
>     left empty, for example:
>
>         external getElementById : dom -> string -> id =
>           "" [@@bs.send]
>
\#\# Binding to dynamic key access/set: `bs.set_index`, `bs.get_index`

This attribute allows dynamic access to a JavaScript property

**Input:.**

    type t
    external create : int -> t = "Int32Array" [@@bs.new]
    external get : t -> int -> int = "" [@@bs.get_index]
    external set : t -> int -> int -> unit = "" [@@bs.set_index]

    let _ =
      let i32arr = (create 3) in
      set i32arr 0 42;
      Js.log (get i32arr 0)

**Output:.**

    var i32arr = new Int32Array(3);
    i32arr[0] = 42;
    console.log(i32arr[0]);

\#\# Binding to Getter/Setter: `bs.get`, `bs.set`

This attribute helps get and set the property of a JavaScript object.

    type textarea
    external set_name : textarea -> string -> unit = "name" [@@bs.set]
    external get_name : textarea -> string = "name" [@@bs.get]

\# Splice calling convention: `bs.splice`

In JS, it is quite common to have a function take variadic arguments.
BuckleScript supports typing homogeneous variadic arguments. For
example,

    external join : string array -> string = "" [@@bs.module "path"] [@@bs.splice]
    let v = join [| "a"; "b"|]

**Output:.**

    var Path = require("path");
    var v = Path.join("a","b");

> **Note**
>
> For the external call, if the `array` arguments is not a compile time
> array, the compiler will emit an error message.

\# Special types on external declarations: `bs.string`, `bs.int`,
`bs.ignore`, `bs.as`, `bs.unwrap`

\#\# Using polymorphic variant to model enums and string types There are
several patterns heavily used in existing JavaScript codebases, for
example, the string type is used a lot. BuckleScript FFI allows the user
to model string type in a safe way by using annotated polymorphic
variant.

    external readFileSync :
      name:string ->
      ([ `utf8
       | `my_name [@bs.as "ascii"] //
       ] [@bs.string]) ->
      string = ""
      [@@bs.module "fs"]

    let _ =
      readFileSync ~name:"xx.txt" `my_name

-   Here we intentionally made an example to show how to customize a
    name

**Output:.**

    var Fs = require("fs");
    Fs.readFileSync("xx.txt", "ascii");

Polymorphic variants can also be used to model *enums*.

**Input:.**

    external test_int_type :
      ([ `on_closed
       | `on_open [@bs.as 3] //
       | `in_bin //
       ]
       [@bs.int]) -> int =
      "" [@@bs.val]

    let _ =
      test_int_type `in_bin

-   *\`on\_closed* will be encoded as 0

-   *`on_open`* will be 3 due to the attribute \`bs.as&lt;/literal&gt;

-   *\`in\_bin* will be 4

**Output:.**

    test_int_type(4);

\#\# Using polymorphic variant to model event listener

BuckleScript models this in a type-safe way by using annotated
polymorphic variants.

    type readline
    external on :
        (
        [ `close of unit -> unit
        | `line of string -> unit
        ] //
        [@bs.string])
        -> readline = "" [@@bs.send.pipe: readline]
    let register rl =
      rl
      |> on (`close (fun event -> () ))
      |> on (`line (fun line -> print_endline line))

-   This is a very powerful typing: each event can have its own
    *different types*.

**Output:.**

    function register(rl) {
      return rl.on("close", function () {
                    return /* () */0;
                  })
               .on("line", function (line) {
                  console.log(line);
                  return /* () */0;
                });
    }

\#\# Using polymorphic variant to model arguments of multiple possible
types (@since 1.8.3)

Sometimes a JavaScript function will accept an argument that could have
different types depending upon how it’s used.

    function padLeft(string, padding) {
      if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
      }
      if (typeof padding === "string") {
        return padding + value;
      }
      throw new Error(`Expected string or number, got '${padding}'.`);
    }

You can model such a function in BuckleScript using `[@bs.unwrap]`.

    external padLeft :
      string
      -> ([ `String of string
          | `Int of int
          ] [@bs.unwrap])
      -> string
      = "" [@@bs.val]

Polymorphic variants with `[@bs.unwrap]` will "unwrap" the variant at
the call site so that the JavaScript function is called with the
underlying value.

    let _ = padLeft "Hello World" (`Int 4)
    let _ = padLeft "Hello World" (`String "bs: ")

Output:

    padLeft("Hello World", 4);
    padLeft("Hello World", "bs: ");

> **Warning**
>
> -   These `[@bs.string]`, `[@bs.int]`, and `[@bs.unwrap]` annotations
>     will only have effect in `external` declarations.
>
> -   The runtime encoding of using polymorphic variant is internal to
>     the compiler.
>
> -   With these annotations mentioned above, BuckleScript will
>     automatically transform the internal encoding to the designated
>     encoding for FFI. BuckleScript will try to do such conversion at
>     compile time if it can, otherwise, it will do such conversion in
>     the runtime, but it should be always correct.
>
\#\# Phantom Arguments and ad-hoc polymorphism

`bs.ignore` allows arguments to be erased after passing to JS functional
call, the side effect will still be recorded.

For example,

    external add : (int [@bs.ignore]) -> int -> int -> int = ""
    [@@bs.val]
    let v = add 0 1 2 //

-   the first argument will be erased

**Output:.**

    var v = add (1,2);

This is very useful to combine GADT:

**Input.**

    type _ kind =
      | Float : float kind
      | String : string kind
    external add : ('a kind [@bs.ignore]) -> 'a -> 'a -> 'a = "" [@@bs.val]

    let () =
      Js.log (add Float 3.0 2.0);
      Js.log (add String "x" "y");

**Output.**

    console.log(add(3.0, 2.0));
    console.log(add("x", "y"));

User can also have a payload for the GADT:

    let string_of_kind (type t) (kind : t kind) =
      match kind with
      | Float -> "float"
      | String -> "string"

    external add_dyn : ('a kind [@bs.ignore]) -> string -> 'a -> 'a -> 'a = ""
    [@@bs.val]

    let add2 k x y =
      add_dyn k (string_of_kind k) x y

> **Note**
>
> Using a GADT as a `[@bs.ignore]` argument as described to achieve a
> single polymorphic argument can now also be accomplished with
> `[@bs.unwrap]` above. The GADT + `[@bs.ignore]` approach is slightly
> more flexible and is always guaranteed to have no runtime overhead,
> where `[@bs.unwrap]` could incur slight runtime overhead in some cases
> but could be a more intuitive API for end users.

\#\# Fixed Arguments

Contrary to the Phantom arguments, `_ [@bs.as]` is introduced to attach
constant data.

For example:

    external process_on_exit : (_ [@bs.as "exit"]) -> (int -> unit) -> unit =
      "process.on" [@@bs.val]

    let () =
        process_on_exit (fun exit_code ->
            Js.log( "error code: " ^ string_of_int exit_code ))

**Output:.**

    process.on("exit", function (exit_code) {
          console.log("error code: " + exit_code);
          return /* () */0;
        });

It can also be used in combination with other attributes, for example:

    type process

    external on_exit : (_ [@bs.as "exit"]) -> (int -> unit) -> process =
        "on" [@@bs.send.pipe: process]
    let register (p : process) =
            p |> on_exit (fun i -> Js.log i)

**Output:.**

    function register(p) {
      return p.on("exit", (function (i) {
                    console.log(i);
                    return /* () */0;
                  }));
    }

**Input:.**

    external io_config :
        stdio:(_ [@bs.as "inherit"]) -> cwd:string -> unit -> _ = "" [@@bs.obj]

    let config = io_config ~cwd:"." ()

**Output:.**

    var config = {
      stdio: "inherit",
      cwd: "."
    };

\#\# Fixed Arguments with arbitrary JSON literal (@since 1.7.0)

So the payload can be more flexiblie with JSON literal support

    type t
    external x: t = "" [@@bs.val]

    external on_exit_slice5 :
        int
        -> (_ [@bs.as 3])
        -> (_ [@bs.as {json|true|json}])
        -> (_ [@bs.as {json|false|json}])
        -> (_ [@bs.as {json|"你好"|json}])
        -> (_ [@bs.as {json| ["你好",1,2,3] |json}])
        -> (_ [@bs.as {json| [{ "arr" : ["你好",1,2,3], "encoding" : "utf8"}] |json}])
        -> (_ [@bs.as {json| [{ "arr" : ["你好",1,2,3], "encoding" : "utf8"}] |json}])
        -> (_ [@bs.as "xxx"])
        -> ([`a|`b|`c] [@bs.int])
        -> (_ [@bs.as "yyy"])
        -> ([`a|`b|`c] [@bs.string])
        -> int array
        -> unit
        =
        "xx" [@@bs.send.pipe: t] [@@bs.splice]

    let _ = x |> on_exit_slice5 __LINE__ `a `b [|1;2;3;4;5|]

**Output:.**

    x.xx(114, 3, true, false, ("你好"), ( ["你好",1,2,3] ), ( [{ "arr" : ["你好",1,2,3], "encoding" : "utf8"}] ), ( [{ "arr" : ["你好",1,2,3], "encoding" : "utf8"}] ), "xxx", 0, "yyy", "b", 1, 2, 3, 4, 5)

\# Binding to NodeJS special variables: [bs.node](../api/Node.html)

NodeJS has several file local variables: `__dirname`, `__filename`,
`_module`, and `require`. Their semantics are more like macros instead
of functions.

BuckleScript provides built-in macro support for these variables:

    let dirname : string option = [%bs.node __dirname]
    let filename : string option = [%bs.node __filename]
    let _module : Node.node_module option = [%bs.node _module]
    let require : Node.node_require option = [%bs.node require]

\# Binding to callbacks (high-order function)

High order functions are functions where the callback can be another
function. For example, suppose JS has a map function as below:

    function map (a, b, f){
      var i = Math.min(a.length, b.length);
      var c = new Array(i);
      for(var j = 0; j < i; ++j){
        c[j] = f(a[i],b[i])
      }
      return c ;
    }

A **naive** external type declaration would be as below:

    external map : 'a array -> 'b array -> ('a -> 'b -> 'c) -> 'c array = "" [@@bs.val]

Unfortunately, this is not completely correct. The issue is by reading
the type `'a -> 'b -> 'c`, it can be in several cases:

    let f x y = x + y

    let g x = let z = x + 1 in fun y -> x + z

In OCaml they all have the same type; however, `f` and `g` may be
compiled into functions with different arities.

A naive compilation will compile `f` as below:

    let f = fun x -> fun y -> x + y

    function f(x){
      return function (y){
        return x + y;
      }
    }
    function g(x){
      var z = x + 1 ;
      return function (y){
        return x + z ;
      }
    }

Its arity will be *consistent* but is *1* (returning another function);
however, we expect *its arity to be 2*.

Bucklescript uses a more complex compilation strategy, compiling `f` as

    function f(x,y){
      return x + y ;
    }

No matter which strategy we use, existing typing rules **cannot
guarantee a function of type `'a -> 'b -> 'c` will have arity 2.**

\#\# `[@bs]` for explicit uncurried callback

To solve this problem introduced by OCaml’s curried calling convention,
we support a special attribute `[@bs]` at the type level.

    external map : 'a array -> 'b array -> ('a -> 'b -> 'c [@bs]) -> 'c array
    = "map" [@@bs.val]

Here `('a -> 'b -> 'c [@bs])` will *always be of arity 2*, in general,
`'a0 -> 'a1 ... 'aN -> 'b0 [@bs]` is the same as
`'a0 -> 'a1 ... 'aN -> 'b0` except the former’s arity is guaranteed to
be `N` while the latter is unknown.

To produce a function of type `'a0 -> .. 'aN -> 'b0 [@bs]`, as follows:

    let f : 'a0 -> 'a1 -> .. 'b0 [@bs] =
      fun [@bs] a0 a1 .. aN -> b0
    let b : 'b0 = f a0 a1 a2 .. aN [@bs]

A special case for arity of 0:

    let f : unit -> 'b0 [@bs] = fun [@bs] () -> b0
    let b : 'b0 = f () [@bs]

Note that this extension to the OCaml language is *sound*. If you add an
attribute in one place but miss it in other place, the type checker will
complain.

Another more complex example:

    type 'a return = int -> 'a [@bs]
    type 'a u0 = int -> string -> 'a return [@bs] //
    type 'a u1 = int -> string -> int -> 'a [@bs] //
    type 'a u2 = int -> string -> (int -> 'a [@bs]) [@bs] //

-   `u0` has arity of 2, return a function with arity 1

-   `u1` has arity of 3

-   `u2` has arity of 2, return a function with arity 1

\#\# `[@bs.uncurry]` for implicit uncurried callback (@since 1.5.0)

Note the `[@bs]` annotation already solved the problem completely, but
it has a drawback that it requires users to write `[@bs]` both in
definition site and call site.

For example:

    external map : 'a array -> ('a -> 'b[@bs]) -> 'b array = "" [@@bs.send] //
    map [|1;2;3|] (fun [@bs] x -> x + 1) //

-   `[@bs]` annotation in definition site

-   `[@bs]` annotation in call site

This is less convenient for end users, so we introduce another implicit
annotation `[@bs.uncurry]` so that the compiler will automatically wrap
the curried callback (from OCaml side) to JS uncurried callback. In this
way, the `[@bs.uncurry]` annotation is defined only once.

    external map : 'a array -> ('a -> 'b [@bs.uncurry]) -> 'b array = "" [@@bs.send] //
    map [|1;2;3|] (fun x -> x+ 1) //

-   `[@bs.uncurry]` annotation in definition site

-   Idiomatic OCaml code

> **Note**
>
> In general, `bs.uncurry` is recommended, and compiler will do lots of
> optimizations to resolve the `curry` to `uncurry` calling convention
> at compile time. However, there are some cases the compiler optimizer
> could not do it, in that case, it will be converted runtime.
>
> This means `[@bs]` are completely static behavior (no any runtime
> cost), while `[@bs.uncurry]` is more convenient for end users but in
> some very rare cases it might be slower than `[@bs]`

\#\# Uncurried calling convention as an optimization

**Background:.**

As we discussed before, we can compile any OCaml function as arity 1 to
support OCaml’s curried calling convention.

This model is simple and easy to implement, but the native compilation
is very slow and expensive for all functions.

    let f x y z = x + y + z
    let a = f 1 2 3
    let b = f 1 2

can be compiled as

    function f(x){
      return function (y){
        return function (z){
          return x + y + z
        }
      }
    }
    var a = f (1) (2) (3)
    var b = f (1) (2)

But as you can see, this is *highly inefficient*, since the compiler
already *saw the source definition* of `f`, it can be optimized as
below:

    function f(x,y,z) {return x + y + z}
    var a = f(1,2,3)
    var b = function(z){return f(1,2,z)}

BuckleScript does this optimization in the cross module level and tries
to infer the arity as much as it can.

\# Callback optimization

However, such optimization will not work with *high-order* functions,
i.e, callbacks.

For example,

    let app f x = f x

Since the arity of `f` is unknown, the compiler can not do any
optimization (unless `app` gets inlined), so we have to generate code as
below:

    function app(f,x){
      return Curry._1(f,x);
    }

`Curry._1` is a function to dynamically support the curried calling
convention.

Since we support the uncurried calling convention, you can write `app`
as below

    let app f x = f x [@bs]

Now the type system will infer `app` as type `('a ->'b [@bs]) -> 'a` and
compile `app` as

    function app(f,x){
      return f(x)
    }

> **Note**
>
> In OCaml the compiler internally uncurries every function declared as
> `external` and guarantees that it is always fully applied. Therefore,
> for `external` first-order FFI, its outermost function does not need
> the `[@bs]` annotation.

\#\# Bindings to `this` based callbacks: `bs.this`

Many JS libraries have callbacks which rely on `this` (the source), for
example:

    x.onload = function(v){
      console.log(this.response + v )
    }

Here, `this` would be the same as `x` (actually depends on how `onload`
is called). It is clear that it is not correct to declare `x.onload` of
type `unit -> unit [@bs]`. Instead, we introduced a special attribute
`bs.this` allowing us to type `x` as below:

    type x
    external x: x = "" [@@bs.val]
    external set_onload : x -> (x -> int -> unit [@bs.this]) -> unit = "onload" [@@bs.set]
    external resp : x -> int = "response" [@@bs.get]
    let _ =
      set_onload x begin fun [@bs.this] o v ->
        Js.log(resp o + v )
      end

**Output:.**

    x.onload = (function (v) {
        var o = this ; //
        console.log(o.response + v | 0);
        return /* () */0;
      });

-   The first argument is automatically bound to `this`

`bs.this` is the same as `bs` : except that its first parameter is
reserved for `this` and for arity of 0, there is no need for a redundant
`unit` type:

    let f : 'obj -> 'b [@bs.this] =
      fun [@bs.this] obj -> ....
    let f1 : 'obj -> 'a0 -> 'b [@bs.this] =
      fun [@bs.this] obj a -> ...

> **Note**
>
> There is no way to consume a function of type
> `'obj -> 'a0 .. -> 'aN -> 'b0 [@bs.this]` on the OCaml side. This is
> an intentional design choice, we **don’t encourage** people to write
> code in this style.
>
> This was introduced mainly to be consumed by existing JS libraries.
> User can also type `x` as a JS class too (see later)

\# Binding to JS objects

**Convention:.**

All JS objects of type `'a` are lifted to type `'a Js.t` to avoid
conflict with OCaml’s native object system (we support both OCaml’s
native object system and FFI to JS’s objects), `\##` is used in JS’s
object method dispatch and field access, while `#` is used in OCaml’s
object method dispatch.

**Typing JavaScript objects:.**

OCaml supports object oriented style natively and provides structural
type system. OCaml’s object system has different runtime semantics from
JS object, but they share the same type system, all JS objects of type
`'a` are typed as `'a Js.t`

OCaml provides two kinds of syntaxes to model structural typing:
`< p1 : t1 >` style and `class type` style. They are mostly the same
except that the latter is more feature rich (supporting inheritance) but
more verbose.

\#\# Simple object type

Suppose we have a JS file `demo.js` which exports two properties:
`height` and `width`:

**demo.js.**

    exports.height = 3
    exports.width  = 3

There are different ways to writing binding to module `demo`, here we
use OCaml objects to model module `demo`

    external demo : < height : int ; width : int > Js.t = "" [@@bs.module]

There are two kinds of types on the method name:

-   normal type

        < label : int >
        < label : int -> int >
        < label : int -> int [@bs]>
        < label : int -> int [@bs.this]>

-   method

        < label : int -> int [@bs.meth] >

The difference is that for `method`, the type system will force users to
fulfill its arguments all at the same time, since its semantics depends
on `this` in JavaScript.

For example:

    let test f =
      f##hi 1 //
    let test2 f =
      let u = f##hi in
      u 1
    let test3 f =
      let u = f##hi in
      u 1 [@bs]

-   `##` is JS object property/method dispatch

The compiler would infer types differently

    val test : < hi : int -> 'a [@bs.meth]; .. > -> 'a //
    val test2 : < hi : int -> 'a ; .. > -> 'a
    val test3 : < hi : int -> 'a [@bs]; .. >

-   `..` is a row variable, which means the object can contain more
    methods.

\#\# Complex object type

Below is an example:

    class type _rect = object
      method height : int
      method width : int
      method draw : unit -> unit
    end [@bs] //
    type rect = _rect Js.t

-   `class type` annotated with `[@bs]` is treated as a JS class type,
    it needs to be lifted to `Js.t` too.

For JS classes, methods with arrow types are treated as real methods
(automatically annotated with `[@bs.meth]`) while methods with non-arrow
types are treated as properties.

So the type `rect` is the same as below:

    type rect = < height : int ; width : int ; draw : unit -> unit [@bs.meth] > Js.t

\#\# How to consume JS property and methods

As we said: `##` is used in both object method dispatch and field
access.

    f##property //
    f##property #= v
    f##js_method args0 args1 args2

-   property get should not come with any argument as we discussed
    above, which will be checked by the compiler.

-   Here `method` is of arity 3.

> **Note**
>
> All JS method application is uncurried, JS’s **method is not a
> function**, this invariant can be guaranteed by OCaml’s type checker,
> a classic example shown below:
>
>     console.log('fine')
>     var log = console.log;
>     log('fine') //
>
> -   May cause exception, implementation dependent, `console.log` may
>     depend on `this`
>
In BuckleScript

    let fn = f0##f in
    let a = fn 1 2
    (* f##field a b would think `field` as a method *)

is different from

    let b = f1##f 1 2

The compiler will infer as below:

    val f0 : < f : int -> int -> int > Js.t
    val f1 : < f : int -> int -> int [@bs.meth] > Js.t

If we type `console` properly in OCaml, user could only write

    console##log "fine"
    let u = console##log
    let () = u "fine" //

-   OCaml compiler will complain

> **Note**
>
> If a user were to make such a mistake, the type checker would complain
> by saying it expected `Js.method` but saw a function instead, so it is
> still sound and type safe.

\# getter/setter annotation to JS properties (simplified @since 1.9.2)

Since OCaml’s object system does not have getters/setters, we introduced
two attributes `bs.get` and `bs.set` to help inform BuckleScript to
compile them as property getters/setters.

    type y = <
      height : int [@bs.set no_get] //
    > Js.t
    type y0 = <
      height : int [@bs.set] [@bs.get null] //
    > Js.t
    type y1 = <
      height : int [@bs.set] [@bs.get undefined] //
    > Js.t
    type y2 = <
      height : int [@bs.set] [@bs.get nullable ] //
    > Js.t
    type y3 = <
      height : int [@bs.get nullable] //
    > Js.t

-   `height` is setter only

-   getter return `int Js.null`

-   getter return `int Js.undefined`

-   getter return `int Js.nullable`

-   getter only, return `int Js.nullable`

> **Note**
>
> Getter/Setter also applies to class type label

\#\# Create JS objects using bs.obj

Not only can we create bindings to JS objects, but also we can create JS
objects in a type safe way on the OCaml side:

    let u = [%bs.obj { x = { y = { z = 3}}} ] //

-   `bs.obj` extension is used to mark `{}` as JS objects

**Output:.**

    var u = { x : { y : { z : 3 }}}}

The compiler would infer `u` as type:

    val u : < x : < y : < z : int > Js.t > Js.t > Js.t

To make it more symmetric, extension `bs.obj` can also be applied into
the type level, so you can write:

    val u : [%bs.obj: < x : < y : < z : int > > > ]

Users can also write expression and types together as below:

    let u = [%bs.obj ( { x = { y = { z = 3 }}} : < x : < y : < z : int > > > ]

Objects in a collection also works:

    let xs = [%bs.obj [| { x = 3 } ; { x = 3 } |] : < x : int > array ]
    let ys = [%bs.obj [| { x = 3 } ; { x = 4 } |] ]

**Output:.**

    var xs = [ { x : 3 } , { x : 3 } ]
    var ys = [ { x : 3 } , { x : 4 } ]

\#\# Create JS objects using external

`bs.obj` can also be used as an attribute in external declarations, as
below:

    external make_config : hi:int -> lo:int -> unit -> t = "" [@@bs.obj]
    let v = make_config ~hi:2 ~lo:3

**Output:.**

    var v = { hi : 2 , lo : 3 }

Option argument is also supported:

    external make_config : hi:int -> ?lo:int -> unit -> t = "" [@@bs.obj] //
    let u = make_config ~hi:3 ()
    let v = make_config ~lo:2 ~hi:3 ()

-   In OCaml, the order of label does not matter, and the evaluation
    order of arguments is undefined. Since the order does not matter, to
    make sure the compiler realize all the arguments are fulfilled
    (including optional arguments), it is common to have a `unit` type
    before the result.

**Output:.**

    var u = {hi : 3}
    var v = {hi : 3 , lo: 2}

Now, we can write JS style code in OCaml too (in a type safe way):

    let u = [%bs.obj {
      x = { y = { z = 3 } };
      fn = fun [@bs] u v -> u + v //
      } ]
    let h = u##x##y##z
    let a = u##fn
    let b = a 1 2 [@bs]

-   `fn` property is not method, it does not rely on `this`. We will
    show how to create JS method in OCaml later.

**Output:.**

    var u = { x : { y : { z : 3 } }, fn : function (u, v) {return u + v}}
    var h = u.x.y.z
    var a = u.fn
    var b = a(1,2)

> **Note**
>
> When the field is an uncurried function, a short-hand syntax `#@` is
> available:
>
>     let b x y h = h#@fn x y
>
>     function b (x,y,h){
>       return h.fn(x,y)
>     }
>
> The compiler will infer the type of `b` as
>
>     val b : 'a -> 'b -> < fn : 'a -> 'b -> 'c [@bs] > Js.t -> 'c

\#\# Create JS objects with `this` semantics The objects created above
can not use `this` in the method, this is supported in BuckleScript too.

    let v2 =
      let x = 3. in
      object (self) //
        method hi x y = self##say x +. y
        method say x = x *. self##x ()
        method x () = x
      end [@bs] //

-   `self` is bound to `this` in generated JS code

-   `[@bs]` marks `object .. end` as a JS object

**Output:.**

    var v2 = {
      hi: function (x, y) {
        var self = this ;
        return self.say(x) + y;
      },
      say: function (x) {
        var self = this ;
        return x * self.x();
      },
      x: function () {
        return 3;
      }
    };

Compiler infers the type of `v2` as below:

    val v2 : <
      hi : float -> float -> float [@bs.meth];
      say : float -> float [@bs.meth];
      x : unit -> float [@bs.meth]
    > [@bs]

Below is another example to consume a JS object :

    let f (u : rect) =
      (* the type annotation is un-necessary,
         but it gives better error message
      *)
       Js.log u##height;
       Js.log u##width;
       u##width #= 30;
       u##height #= 30;
       u##draw ()

**Output:.**

    function f(u){
      console.log(u.height);
      console.log(u.width);
      u.width = 30;
      u.height = 30;
      return u.draw()
    }

\# Method chaining

    f
    ##(meth0 ())
    ##(meth1 a)
    ##(meth2 a b)

\#\# Object label translation convention

There are two cases, where we might want to do name mangling for a JS
object method name.

First, in OCaml, some names are keywords, so we want to add an
underscore to avoid a syntax error.

**Key-word method:.**

    f##_open
    f##_MAX_LENGTH

**OUTPUT:.**

    f.open
    f.MAX_LENGTH

Second, it is common to have several types for a single method. To model
this ad-hoc polymorphism, we introduced a small convention when
translating object labels, which is *occasionally* useful as below

**Ad-hoc polymorphism.**

    f##draw__cat (x,y)
    f##draw__dog (x,y)

**OUTPUT:.**

    f.draw(x,y) // f.draw in JS can accept different types
    f.draw(x,y)

> **Note**
>
> 1.  If `__[rest]` appears in the label, index from the right to left.
>
>     -   If index = 0, nothing mangled
>
>     -   If index &gt; 0, `__[rest]` is dropped
>
> 2.  Else if `_` is the first char
>
>     -   If the following char is not *a* .. *z*, drop the first *\_*
>
>     -   Else if the rest happens to be a keyword, drop the first *\_*
>
>     -   Else, nothing mangled
>
\# Return value checking (@since 1.5.1)

In general, the FFI code is error prone, and potentially will leak in
`undefined` or `null` values.

So we introduced auto coercion for return values to gain two benefits:

1.  More safety for FFI code without performance cost (explained later).

2.  More idiomatic OCaml code for users to consume the FFI.

Below is a contrived core example:

    type element
    type dom
    external getElementById : string -> element option = ""
    [@@bs.send.pipe:dom] [@@bs.return nullable] //

    let test dom =
        let elem = dom |> getElementById "haha" in
        match elem with
        | None -> 1
        | Some ui -> Js.log ui ; 2

-   `nullable` attribute will automatically convert null and undefined
    to `option`

**Output:.**

    function test(dom) {
      var elem = dom.getElementById("haha");
      if (elem == null) {
        return 1;
      } else {
        console.log(elem);
        return 2;
      }
    }

Currently 4 directives are supported: `null_to_opt`, `undefined_to_opt`,
`nullable`(introduced in @1.9.0) and `identity`. `null_undefined_to_opt`
works the same as `nullable`, but it is deprecated, `nullable` is
encouraged

> **Note**
>
> `null_to_opt`, `undefined_to_opt` and `nullable` will **semantically**
> convert a nullable value to `option` which is a boxed value, but the
> compiler will do smart optimizations to **remove such boxing
> overhead** when the returned value is destructed in the same routine.
>
> The three directives above require users to write literally
> `_ option`. It is in theory not necessary, but it is required to
> reduce user errors.
>
> When the return type is `unit`: the compiler will append its return
> value with an OCaml `unit` literal to make sure it does return `unit`.
> Its main purpose is to make the user consume FFI in idiomatic OCaml
> code, the cost is **very very small** and the compiler will do smart
> optimizations to remove it when the returned value is not used (mostly
> likely).
>
> When the return type is `bool`, the compiler will coerce its return
> value from JS boolean to OCaml boolean. The cost is also **very
> small** and compiler will remove such coercion when it is not needed.
> Note even if your external FFI does return OCaml `bool` or `unit`,
> such implicit coercion will **cause no harm**.
>
> `identity` will make sure that compiler will do nothing about the
> returned value. It is rarely used, but introduced here for debugging
> purpose.

\# Embedding untyped Javascript code

> **Warning**
>
> This is not encouraged. The user should minimize and localize use
> cases of embedding raw JavaScript code, however, sometimes it’s
> necessary to get the job done.

\#\# Detect global variable existence `bs.external` (@since 1.5.1)

Before we dive into embedding arbitrary JS code, a quite common use case
of embedding untyped JS code is detect a global variable (feature
detection), Bucklescript provides a relatively type safe approach for
such use case: `bs.external` (or `external`),
`[%bs.external a_single_identifier]` is a value of `_ option` type, see
examples below

    let test () =
      match [%external __DEV__] with
      | Some _ -> Js.log "dev mode"
      | None -> Js.log "production mode"

**Output:.**

    function test() {
      var match = typeof (__DEV__) === "undefined" ? undefined : (__DEV__);
      if (match !== undefined) {
        console.log("dev mode");
        return /* () */0;
      }
      else {
        console.log("production mode");
        return /* () */0;
      }
    }

    let test2 () =
      match [%external __filename] with
      | Some f -> Js.log f
      | None -> Js.log "non node environment"

**Output:.**

    function test2() {
      var match = typeof (__filename) === "undefined" ? undefined : (__filename);
      if (match !== undefined) {
        console.log(match);
        return /* () */0;
      }
      else {
        console.log("non node environment");
        return /* () */0;
      }
    }

\#\# Embedding arbitrary JS code as an expression

    let keys : t -> string array [@bs] = [%bs.raw "Object.keys" ]
    let unsafe_lt : 'a -> 'a -> Js.boolean [@bs] = [%bs.raw{|function(x,y){return x < y}|}]

We highly recommend writing type annotations for such unsafe code. It is
unsafe to refer to external OCaml symbols in raw JS code.

\#\# Embedding raw JS code as statements

    [%%bs.raw{|
      console.log ("hey");
    |}]

Other examples:

    let x : string = [%bs.raw{|"\x01\x02"|}]

It will be compiled into:

    var x = "\x01\x02"

Polyfill of `Math.imul`

       [%%bs.raw{|
       // Math.imul polyfill
       if (!Math.imul){
           Math.imul = function (..) {..}
        }
       |}]

> **Warning**
>
> -   So far we don’t perform any sanity checks in the quoted text
>     (syntax checking is a long-term goal).
>
> -   Users should not refer to symbols in OCaml code. It is not
>     guaranteed that the order is correct.
>
\# Debugger support

We introduced the extension `bs.debugger`, for example:

      let f x y =
        [%bs.debugger];
        x + y

which will be compiled into:

      function f (x,y) {
         debugger; // JavaScript developer tools will set an breakpoint and stop here
         x + y;
      }

\# Regex support

We introduced `bs.re` for Javascript regex expressions:

    let f = [%bs.re "/b/g"]

The compiler will infer `f` has type `Js.Re.t` and generate code as
below:

    var f = /b/g

> **Note**
>
> `Js.Re.t` can be accessed and manipulated using the functions
> available in the [`Js.Re`](../api/Js.Re.html) module.

\# Examples

Below is a simple example for the [mocha](https://mochajs.org/) library.
For more examples, please visit
<https://github.com/bucklescript/bucklescript-addons>

\#\# A simple example: binding to mocha unit test library

This is an example showing how to provide bindings to the
[mochajs](https://mochajs.org/) unit test framework.

    external describe : string -> (unit -> unit [@bs]) -> unit = "" [@@bs.val]
    external it : string -> (unit -> unit [@bs]) -> unit = "" [@@bs.val]

Since, `mochajs` is a test framework, we also need some assertion tests.
We can also describe the bindings to `assert.deepEqual` from the nodejs
`assert` library:

    external eq : 'a -> 'a -> unit = "deepEqual" [@@bs.module "assert"]

On top of this we can write normal OCaml functions, for example:

    let assert_equal = eq
    let from_suites name suite =
        describe name (fun [@bs] () ->
             List.iter (fun (name, code) -> it name code) suite
             )

The compiler would generate code as below:

     var Assert = require("assert");
     var List = require("bs-platform/lib/js/list");

    function assert_equal(prim, prim$1) {
     return Assert.deepEqual(prim, prim$1);
     }

    function from_suites(name, suite) {
     return describe(name, function () {
       return List.iter(function (param) {
        return it(param[0], param[1]);
          }, suite);
      });
     }

\#\# Exception handling between OCaml and JS (@since 1.7.0)

In the JS world, exception could be any data, while an OCaml exception
is a structured data format and supports pattern matching. Catching an
OCaml exception on JS side is therefore a no-op.

JS exceptions can be raised from OCaml by using the `JS.Exn.raise*`
functions, and can be caught as an OCaml exception of the type
`Js.Exn.Error` with the JS exception as it’s paylaod typed as
`Js.Exn.t`. The JS Exception can then either be manipulated with the
accessor functions in `Js.Exn`, or casted to a more appropriate type.

    let () =
      try
        Js.Exn.raiseError "oops!"
      with
      | Js.Exn.Error e ->
        match Js.Exn.message e with
        | Some message -> Js.log {j|Error: $message|j}
        | None -> Js.log "An unknown error occurred"

    let maybeParsed =
      match Js.Json.parseExn {| {"x" }|} with
      | value -> Some value
      | exception Js.Exn.Error e ->
        Js.log (Js.Exn.message e);
        None

Please consult the [`Js.Exn` API reference](../api/Js.Exn.html) for more
details

\#\# `bs.open`: Type safe external data-source handling (@@since 1.7.0)

There are some cases, the data-source could either come from JS land or
OCaml land, it is very hard to give precise type information. For
example, for an external promise whose creation could come from JS API,
its failed value caused by `Promise.reject` could be in any shape.

BuckleScript provides a solution to filter out OCaml structured
exception data from the mixed data source, it preserves the type safety
while allow users to deal with mixed source.

It makes use of OCaml’s extensible variant, so that users can mix values
of type `exn` with JS data-source

**Example.**

    let handleData = function [@bs.open]
       | Invalid_argument _ -> 0
       | Not_found -> 1
       | Sys_error _ -> 2

    val handleData : 'a -> int option //

-   For any input source, as long as it matches the exception pattern
    (nested pattern match supported), the matched value is returned,
    otherwise return `None`.

\# Use cases

Take promise for example:

    let v = Js.Promise.reject Not_found
    let handlePromiseFailure = function [@bs.open]
       | Not_found -> Js.log "Not found"; (Js.Promise.resolve ())

    let () =
       v
       |> Js.Promise.catch (fun error ->
            match handlePromiseFailure error with
            | Some x -> x
            | None -> raise UnhandledPromise
        )

Js module
=========

[API reference](https://bucklescript.github.io/bucklescript/api/Js.html)

Js module is shipped with BuckleScript, both the namespace `Js` and
`Node` are preserved.

Null and Undefined
------------------

BuckleScript does not deal with `null` and `undefined` on the language
level. Instead they are defined on the library level, represented by
`Js.Null.empty` and `Js.Undefined.empty` (and `Js.Null_undefined.empty`)
types. But due to this being Ocaml and all, we can’t just pass these
values off as if it was any type we’d like it to be, so in order to
actually use them we need to lift the type we want to use them with. For
this purpose BuckleScript defines the type `'a Js.null`,
`` 'a Js.undefined' and `'a Js.null_undefined `` (for values that can be
both `null`, `undefined` and `'a`). As well as the corresponding modules
`Js.Null`, `Js.Undefined` and `Js.Null_undefined` for working with these
types.

Here’s an example showing `Js.Null` used directly:

    external get_prop_name_maybe : unit -> string Js.null = "" [@@bs.val]
    external set_or_unset_prop : string -> int Js.null -> unit = "" [@@bs.val]

    (* unset property if fond *)
    let s = get_prop_name_maybe ()
    let _ = Js.Null.iter s (function name -> set_or_unset_prop name Js.Null.empty)

    (* set some other property *)
    let _ = set_or_unset_prop "some_other_property" (Js.Null.return "")

You might also want to map these types to `option` for a friendlier and
more idiomatic API, if the distinction between `null` and `undefined`
isn’t important to maintain:

    external try_some_thing : string Js.null -> int Js.null = ...

    let try_some_thing_maybe ( v : string option) : int option =
      Js.Null.to_opt (try_some_thing (Js.Null.from_opt v))

Boolean
-------

"Native" `bool` is for Bob-ish reasons not represented as `true` and
`false` literals in JavaScript. For interop you therefore need to use
the `Js.boolean` and its `Js.true_` and `Js.false_` values. There are
also convenience functions for coercing to and from `bool`: `Js.to_bool`
and `Js.Boolean.to_js_boolean`.

\#\# Extended compiler options

This section is only for people who want roll their own build system
instead of using the recommended build system:
[???](#BuckleScript build system: <literal>bsb</literal>), in general,
it is safe to skip this section. It also adds some tips for people who
debug the compiler.

BuckleScript inherits the command line arguments of the [OCaml
compiler](http://caml.inria.fr/pub/docs/manual-ocaml/comp.html). It also
adds several flags:

\# -bs-main (single directory build)

    bsc.exe -bs-main Main

`bsc.exe` will build module `Main` and all its dependencies and when it
finishes, it will run `node main.js`.

    bsc.exe -c -bs-main Main

The same as above, but will not run `node`.

\# -bs-files

So that you can do

    bsc.exe -c -bs-files *.ml *.mli

the compiler will sort the order of input files before starting
compilation.

BuckleScript supports two compilation modes: script mode and package
mode. In package mode, you have to provide `package.json` on top and set
the options `-bs-package-name`, `-bs-package-output`. In script mode,
such flags are not needed.

\# -bs-package-name The project name of your project. The user is
suggested to make it consistent with the `name` field in `package.json`

\# -bs-packge-output The format is
`module_system:oupt/path/relative/to/package.json` Currently supported
module systesms are: `commonjs`, `amdjs` and `es6`.

For example, when you want to use the `es6` module system, you can do
things like this:

    bsc.exe -bs-package-name your_package -bs-package-output es6:lib/es6 -c xx.ml

> **Note**
>
> The user can supply multiple `-bs-package-output` at the same time.

For example:

    bsc.exe -bs-package-name name -bs-package-output commonjs:lib/js  -bs-package-output amdjs:lib/amdjs -c x.ml

It will generate `x.js` in `lib/js` as a commonjs module, `lib/amdjs` as
an amdjs module at the same time.

You would then need a bundler for the different module systems:
`webpack` supports `commonjs` and `amdjs` while
`google closure compiler` supports all.

\# -bs-gen-tds

Trigger the generation of TypeScript `.d.ts` files. `bsc.exe` has the
ability to also emit `.d.ts` for better interaction with TypeScript.
This is still experimental.

For more options, please see the documentation of `bsc.exe -help`.

\# -bs-no-warn-ffi-type

Turn off warnings on FFI type declarations.

\# -bs-eval

**Example.**

    bsc.exe -dparsetree -drawlambda -bs-eval 'Js.log "hello"'

    [ //
      structure_item (//toplevel//[1,0+0]..[1,0+14])
        Pstr_eval
        expression (//toplevel//[1,0+0]..[1,0+14])
          Pexp_apply
          expression (//toplevel//[1,0+0]..[1,0+6])
            Pexp_ident "Js.log" (//toplevel//[1,0+0]..[1,0+6])
          [
            <label> ""
              expression (//toplevel//[1,0+7]..[1,0+14])
                Pexp_constant Const_string("hello",None)
          ]
    ]
    //
    (setglobal Bs_internal_eval! (seq (js_dump "hello") (makeblock 0)))
    // Generated by BUCKLESCRIPT VERSION 1.0.2 , PLEASE EDIT WITH CARE
    'use strict';


    console.log("hello");

    /*  Not a pure module */

-   Output by flag -dparsetree

-   Output by flag -drawlambda

For this flag, it will not create any intermediate file, which is useful
for learning or troubleshooting.

\# -bs-no-builtin-ppx-ml, -bs-no-builtin-ppx-mli

If the user doesn’t use any bs specific annotations, the user can
explicitly turn it off. Another use case is that users can use `-ppx`
explicitly as below:

    bsc.exe -c -ppx bsppx.exe -bs-no-builtin-ppx-ml c.ml

\# -bs-no-version-header

Don’t print version header.

\#\# Semantic differences from other backends

This is particularly important when porting an existing OCaml
application to JavaScript.

\# Custom data type

In OCaml, the C FFI allows the user to define a custom data type and
customize `caml_compare`, `caml_hash` behavior, etc. This is not
available in our backend (since we have no C FFI).

\# Physical (in)equality

In general, users should only use physical equality as an optimization
technique, but not rely on its correctness, since it is tightly coupled
with the runtime.

\# String char range

Currently, BuckleScript assumes that the char range is `0-255`. The user
should be careful when they pass a JavaScript string to the OCaml side.
Note that we are working on a solution for this problem.

\# Weak map

OCaml’s weak map is not available in BuckleScript. The weak pointer is
replaced by a strict pointer.

\# Integers

OCaml has `int`, `int32`, `nativeint` and `int64` types. - Both `int32`
and `int64` in BuckleScript have the exact same semantics as OCaml. -
`int` in BuckleScript is the same as `int32` while in OCaml it’s
platform dependent. - `nativeint` is treated as JavaScript float, except
for division. For example, `Nativeint.div a b` will be translated into
`a /b | 0`.

> **Warning**
>
> `Nativeint.shift_right_logical x 0` is different from
> `Int32.shift_right_local x 0`. The former is literally translated into
> `x >>> 0` (translated into an unsigned int), while the latter is
> `x | 0`.

\# Printf.printf

The `Printf.print` implementation in BuckleScript requires a newline
(`\n`) to trigger the printing. This behavior is not consistent with the
buffered behavior of native OCaml. The only potential problem we foresee
is that if the program terminates with no newline character, the text
will never be printed.

\# Obj module

We do our best to mimic the native compiler, but we have no guarantee
and there are differences.

\# Hashtbl hash algorithm

BuckleScript uses the same algorithm as native OCaml but the output is
different due to the runtime representation of int/int64/int32 and
float.

\# Marshall Marshall module is not supported yet.

\# Sys.argv, Sys.max\_array\_length, Sys.max\_string\_length Command
line arguments are always empty. This might be fixed in the near future.
`Sys.max_array_length` and `Sys.max_string_length` will be the same as
`max_int`, but it might be respected.

\# Unsupported IO primitives Because of the JavaScript environment
limitation, `Pervasives.stdin` is not supported but both
`Pervasives.stdout` and `Pervasives.stderr` are.

Conditional compilation support - static if
===========================================

It is quite common that people want to write code that works with
different versions of compilers and libraries.

People used to use preprocessors like [C
preprocessor](http://tigcc.ticalc.org/doc/cpp.html) for the C family
languages. In the OCaml community there are several preprocessors:
[cppo](https://github.com/mjambon/cppo),
[ocp-pp](https://github.com/OCamlPro/typerex-build/tree/master/tools/ocp-pp),
camlp4 IFDEF macros, [optcomp](https://github.com/diml/optcomp) and [ppx
optcomp](https://github.com/janestreet/ppx_optcomp).

Instead of using a preprocessor, BuckleScript adds language level static
if compilation to the language. It is less powerful than other
preprocessors since it only supports static if (no `#define`,
`#undefine`, `#include`) but there are several advantages.

-   It’s very small (only around 500 LOC) and highly efficient. There is
    no added pass, allowing everything to be done in a **single pass**.
    It is easy to rebuild the pre-processor in a stand alone file, with
    no dependencies on compiler libs to back-port it to old OCaml
    compilers.

-   It’s purely functional and type safe, easy to work with IDEs like
    Merlin.

Concrete syntax
---------------

    static-if
    | HASH-IF-BOL conditional-expression THEN //
       tokens
    (HASH-ELIF-BOL conditional-expression THEN) *
    (ELSE-BOL tokens)?
    HASH-END-BOL

    conditional-expression
    | conditional-expression && conditional-expression
    | conditional-expression || conditional-expression
    | atom-predicate

    atom-predicate
    | atom operator atom
    | defined UIDENT
    | undefined UIDENT

    operator
    | (= | < | > | <= | >= | =~ )

    atom
    | UIDENT | INT | STRING | FLOAT

-   IF-BOL means `#IF` should be in the beginning of a line

Typing rules
------------

-   type of INT is `int`

-   type of STRING is `string`

-   type of FLOAT is `float`

-   value of UIDENT comes from either built-in values (with documented
    types) or an environment variable, if it is literally `true`,
    `false` then it is `bool`, else if it is parsable by `int_of_string`
    then it is of type int, else if it is parsable by `float_of_string`
    then it is float, otherwise it would be string

-   In `lhs operator rhs`, `lhs` and `rhs` are always the same type and
    return boolean. `=~` is a semantic version operator which requires
    both sides to be string.

Evaluation rules are obvious. `=~` respect semantic version, for
example, the underlying engine

    semver Location.none "1.2.3" "~1.3.0" = false;;
    semver Location.none "1.2.3" "^1.3.0" = true ;;
    semver Location.none "1.2.3" ">1.3.0" = false ;;
    semver Location.none "1.2.3" ">=1.3.0" = false ;;
    semver Location.none "1.2.3" "<1.3.0" = true ;;
    semver Location.none "1.2.3" "<=1.3.0" = true ;;
    semver Location.none "1.2.3" "1.2.3" = true;;

Examples
--------

**lwt\_unix.mli.**

    type open_flag =
        Unix.open_flag =
      | O_RDONLY
      | O_WRONLY
      | O_RDWR
      | O_NONBLOCK
      | O_APPEND
      | O_CREAT
      | O_TRUNC
      | O_EXCL
      | O_NOCTTY
      | O_DSYNC
      | O_SYNC
      | O_RSYNC
    #if OCAML_VERSION =~ ">=3.13" then
      | O_SHARE_DELETE
    #end
    #if OCAML_VERSION =~ ">=4.01" then
      | O_CLOEXEC
    #end

Built in variables and custom variables
---------------------------------------

    ocamlscript>bsc.exe -bs-D CUSTOM_A="ghsigh" -bs-list-conditionals
    OCAML_PATCH "BS"
    BS_VERSION "1.2.1"
    OS_TYPE "Unix"
    BS true
    CUSTOM_A "ghsigh"
    WORD_SIZE 64
    OCAML_VERSION "4.02.3+BS"
    BIG_ENDIAN false

Changes to command line options
-------------------------------

For BuckleScript users, nothing needs to be done (it is baked in the
language level). For non BuckleScript users, we provide an external
pre-processor, so it will work with other OCaml compilers too. so that
it even works without compilation.

**Example.**

    bsc.exe -c lwt_unix.mli
    ocamlc -pp 'bspp.exe' -c lwt_unix.mli
    ocamlc -pp 'ocaml -w -a bspp.ml' -c lwt_unix.mli

> **Warning**
>
> This is a very small extension to the OCaml language, it is backward
> compatible with OCaml language with such exceptions.
>
>     let f x =
>       x
>     #elif //
>
> -   `#elif` at the beginning of a line is interpreted as static if,
>     there is no issue with `#if` or `#end`, since they are already
>     keywords.
>
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

FAQ
===

**Q:** How does IO work in the browser?

**Q:** The compiler does not build?

**A:** In production mode, the compiler is a single file in
`jscomp/bin/compiler.ml`. If it is not compiling, make sure you have the
right OCaml compiler version. Currently the OCaml compiler is a
submodule of BuckleScript. Make sure the exact commit hash matches (we
only update the compiler occasionally).

**Q:** Which version of JavaScript syntax does BuckleScript target?

**A:** BuckleScript targets **ES5**.

**Q:** Does BuckleScript work with merlin?

**A:** Yes, you need edit your `.merlin` file:

B node\_modules/bs-platform/lib/ocaml S
node\_modules/bs-platform/lib/ocaml FLG -ppx
node\_modules/bs-platform/bin/bsppx.exe&lt;/programlisting&gt;
Note there is a [upstream
fix](https://github.com/the-lambda-church/merlin/issues/568) in Merlin,
make sure your merlin is updated.

**Q:** What polyfills does BuckleScript need?

-   *Math.imul*: This polyfill is needed for `int32` multiplication.
    BuckleScript provides this by default (when feature detection
    returns false), no action is required from the user.

-   *TypedArray*: The TypedArray polyfill is not provided by
    BuckleScript and it’s the responsibility of the user to bundle the
    desired polyfill implementation with the BuckleScript generated
    code.

        The following functions from OCaml stdlib
        require the TypedArray polyfill:

    -   Int64.float\_of\_bits

    -   Int64.bits\_of\_float

    -   Int32.float\_of\_bits

    -   Int32.bits\_of\_float

        > **Warning**
        >
        > For the current BuckleScript version, if the user does not
        > bundle the TypedArray polyfill, the JavaScript engine does not
        > support it and user used functions mentioned above, the code
        > will fail at runtime.

**Q:** Uncurried functions cannot be polymorphic?

**A:** E.g. if you try to do this at toplevel:

let id : ('a -&gt; 'a \[@bs\]) = ((fun v -&gt; v)
\[@bs\])&lt;/programlisting&gt;
You’ll get this dreaded error message

Error: The type of this expression, (\[ \`Arity\_1 of '\_a \], '\_a)
Js.fn, contains type variables that cannot be
generalized&lt;/programlisting&gt;
The issue here isn’t that the function is polymorphic. You can use (and
probably have used) polymorphic uncurried functions without any problem
as inline callbacks. But you can’t export them. The issue here is the
combination of using the uncurried calling convention, polymorphism and
exporting (by default). It’s an unfortunate limitation partly due to how
OCaml’s type system incorporates side-effects, and partly due to how
BuckleScript handles uncurrying. The simplest solution is in most cases
to just not export it, by adding an interface to the module.
Alternatively, if you really, really need to export it, you can do so in
its curried form, and then wrap it in an uncurried lambda at the call
site. E.g.:

lat \_ = map (fun v -&gt; id v \[@bs\])&lt;/programlisting&gt;
\#\# High Level compiler workflow

The high level architecture is illustrated below:

    Source Language
      |
      | (Reuse OCaml Parser)
      v
    Surface Syntax Tree
      |
      | (built in Syntax tree transformation)
      v
    Surface Syntax Tree
      |
      | (Reuse OCaml Type checker)
      v
    Typedtree
      |
      | (Reuse OCaml pattern match compiler and erase types)
      | (Patches to pass more information down to Lambda )
      |
    OCaml Lambda IR
      |
      |
      v
    Buckle Lambda IR ------------------+
      |   ^                            |
      |   |                     6 Lambda Passes (lam_* files)
      |   |             Optimization/inlining/dead code elimination
      |   \                            |
      |    \ --------------------------+
      |
      |  Self tail call elimination
      |  Constant folding + propagation
      V
    JS IR (J.ml)  ---------------------+
      |   ^                            |
      |   |                     6 JS Passes (js_* files)
      |   |            Optimization/inlining/dead code elimination
      |   \                            |
      |    \  -------------------------+
      |
      |  Smart printer includes scope analysis
      |
      V
    Javascript Code

\# Design Principles

The current design of BuckleScript follows several high level
principles. While those principles might change in the future, they are
enforced today and can explain certain technical limitations
BuckleScript has.

**Lambda Representation**

As pictured in the diagram above, BuckleScript is primarily based on the
Lambda representation of the OCaml compiler. While this representation
is quite rich, some information is lost from the upstream
representation. The patch to the OCaml compiler tries to enrich this
representation in a non-intrusive way (see next section).

**Minimal Patch to the OCaml compiler**

BuckleScript requires patches to the OCaml compiler. One of the main
reasons is to enrich the Lambda representation so that the generated
code is as nice as possible. A design goal is to keep those patches
minimal and useful for the OCaml compiler in general so that they can
later be integrated.

> **Note**
>
> A common question is to wonder why BuckleScript transpiles an OCaml
> record value to a JavaScript array while a more intuitive
> representation would be a JavaScript object. This technical decision
> is a direct consequence of the above 2 design principles: the Lambda
> layer assumes in a lot of places that a record value is an array and
> such modification would be too large of a change to OCaml compiler.

\# Soundness

BuckleScript preserves the soundness of the OCaml language. Assuming the
FFI is correctly implemented, the type safety is preserved.

\# Minimal new symbol creation

In order to make the JavaScript generated code as close as possible to
the original OCaml core we thrive to introduce as few new symbols as
possible.

\#\# Runtime representation

Below is a description of how OCaml values are encoded in JavaScript,
the **internal** description means **users should not rely on its actual
encoding (and it is subject to change)**. We recommend that you write
setter/getter functions to manipulate safely OCaml values from
JavaScript.

For example, users should not rely on how OCaml `list` is encoded in
JavaScript; instead, the OCaml stdlib provides three functions:
`List.cons`, `List.hd` and `List.tl`. JavaScript code should only rely
on those three functions.

\# Simple OCaml type

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<thead>
<tr class="header">
<th>ocaml type</th>
<th>JavaScript type</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>int</p></td>
<td><p>number</p></td>
</tr>
<tr class="even">
<td><p>nativeint</p></td>
<td><p>number</p></td>
</tr>
<tr class="odd">
<td><p>int32</p></td>
<td><p>number</p></td>
</tr>
<tr class="even">
<td><p>float</p></td>
<td><p>number</p></td>
</tr>
<tr class="odd">
<td><p>bool</p></td>
<td>number
<ul>
<li><p>true → 1</p></li>
<li><p>false → 0</p></li>
</ul></td>
</tr>
<tr class="even">
<td><p>int64</p></td>
<td><p>Array of size two numbers <code>[hi,lo]</code>. <code>hi</code> is signed while <code>lo</code> is unsigned</p></td>
</tr>
<tr class="odd">
<td><p>char</p></td>
<td>number
<p>for example:</p>
<ul>
<li><p><em>a</em> → <code>97</code></p></li>
</ul></td>
</tr>
<tr class="even">
<td><p>string</p></td>
<td><p>string</p></td>
</tr>
<tr class="odd">
<td><p>bytes</p></td>
<td>number array
<blockquote>
<p><strong>Note</strong></p>
<p>We might encode it as buffer in NodeJS.</p>
</blockquote></td>
</tr>
<tr class="even">
<td><p>'a array</p></td>
<td><p>Array</p></td>
</tr>
<tr class="odd">
<td><p>record</p></td>
<td>Array *internal*
<p>For instance:</p>
<pre class="ocaml"><code>type t = { x : int; y : int }
let v = {x = 1; y = 2}</code></pre>
<p>Output:</p>
<pre class="js"><code>var v = [1,2]</code></pre></td>
</tr>
<tr class="even">
<td><p>tuple</p></td>
<td>Array
<p>For example:</p>
<ul>
<li><p>(3,4) → [3,4]</p></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>``'a option`</p></td>
<td>*internal*
<p>For example:</p>
<ul>
<li><p><code>None</code> → <code>0</code></p></li>
<li><p><code>Some a</code> → <code>[a]</code></p></li>
</ul></td>
</tr>
<tr class="even">
<td><p>list</p></td>
<td>*internal*
<p>For example:</p>
<ul>
<li><p><code>[]</code> → <code>0</code></p></li>
<li><p><code>x::y</code> → <code>[x,y]</code></p></li>
<li><p><code>1::2::[3]</code> → <code>[ 1, [ 2, [ 3, 0 ] ] ]</code></p></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Variant</p></td>
<td>*internal* (subject to change)
<p>Simple Variants: (Variants with only one non-nullary constructor)</p>
<pre class="ocaml"><code>type tree =
  | Leaf
  | Node of int * tree * tree
(* Leaf --&gt; 0 *)
(* Node(a,b,c) --&gt; [a,b,c]*)</code></pre>
<p>Complex Variants: (Variants with more than one non-nullary constructor)</p>
<pre class="ocaml"><code>type u =
     | A of string
     | B of int
(* A a --&gt; [a].tag=0 -- tag 0 assignment is optional *)
(* B b --&gt; [b].tag=1 *)</code></pre></td>
</tr>
<tr class="even">
<td><p>Polymorphic variant</p></td>
<td>*internal*
<pre class="ocaml"><code>`a (* 97 *)
`a 1 2 (* [97, [1,2] ]*)</code></pre></td>
</tr>
<tr class="odd">
<td><p>exception</p></td>
<td><p><strong>internal</strong></p></td>
</tr>
<tr class="even">
<td><p>extension</p></td>
<td><p><strong>internal</strong></p></td>
</tr>
<tr class="odd">
<td><p>object</p></td>
<td><p><strong>internal</strong></p></td>
</tr>
<tr class="even">
<td><p><code>Js.boolean</code></p></td>
<td>boolean
<p>For example:</p>
<ul>
<li><p>Js.true_ → true</p></li>
<li><p>Js.false_ → false</p></li>
</ul>
<p><strong>Js module.</strong></p>
<pre class="ocaml"><code>type boolean
val to_bool: boolean -&gt; bool</code></pre>
<p><strong><a href="../api/Js.Boolean.html">Js.Boolean</a> module.</strong></p>
<pre><code>val to_js_boolean: bool -&gt; Js.boolean</code></pre></td>
</tr>
<tr class="odd">
<td><p><code>'a Js.Null.t</code></p></td>
<td>Either `'a` or `null`. `Js.Null.empty` represents `null` too.
<p><strong><a href="../api/Js.Null.html">Js.Null</a> module.</strong></p>
<pre class="ocaml"><code>val to_opt : &#39;a t -&gt; &#39;a option
val from_opt : &#39;a option -&gt; &#39;a t
val return : &#39;a -&gt; &#39;a t
val test : &#39;a t -&gt; bool</code></pre></td>
</tr>
<tr class="even">
<td><p><code>'a Js.Undefined.t</code></p></td>
<td>Either `'a` or `undefined`. Same operations as `'a Js.Null.t`. `Js.Undefined.empty` represents `undefined` too.</td>
</tr>
<tr class="odd">
<td><p><code>'a Js.Null_undefined.t</code></p></td>
<td>Either `'a`, `null` or `undefined`. Same operations as `'a Js.Null.t`.
<p><code>Js.Null_undefined.undefined</code> represents <code>undefined</code>, <code>Js.Null_undefined.null</code> represents <code>null</code>.</p>
<p>This module’s null tests check for both <code>null</code> and <code>undefined</code>; if you know the value’s only ever going to be <code>null</code> and not undefined, use <code>Js.Null</code> instead. Likewise for <code>Js.Undefined</code>.</p></td>
</tr>
</tbody>
</table>

> **Note**
>
> `Js.to_opt` is optimized when the `option` is not escaped

> **Note**
>
> In the future, we will have a *debug* mode, in which the corresponding
> js encoding will be instrumented with more information

As we clarified before, the internal representation should not be relied
upon. We are working to provide a ppx extension as below:

    type t =
      | A
      | B of int * int
      | C of int * int
      | D [@@bs.deriving{export}]

So that it will a automatically provide `constructing` and `destructing`
functions:

    val a : t
    val b : int -> int -> t
    val c : int -> int -> t
    val d : int

    val a_of_t : t -> bool
    val d_of_t : t -> bool
    val b_of_t : t -> (int * int ) Js.Null.t
    val c_of_t : t -> (int * int ) Js.Null.t

\#\# Integration with Reason

You can play with Reason using the playground [Facebook
Reason](https://bucklescript.github.io/bucklescript/reason-demo)

> **Note**
>
> You should always use the command line as your production tool.

There is a stand alone example
[here](https://github.com/bucklescript/bucklescript-addons/blob/master/examples/reason-demo/package.json).

\#\# Contributions

First, thanks for your interest in contributing! There are plenty of
ways to make contributions, like blogging, sharing your experience, open
sourcing your libraries using BuckleScript. They are all deeply
appreciated.

This section will focus on how to contribute to this repo.

\# Development set-up

-   Having [opam](https://opam.ocaml.org/) installed

        opam switch 4.02.3+buckle-master # use our OCaml compiler
        opam install camlp4  

    `Camlp4` is used to generate OCaml code for processing large AST.
    (`j.ml` file), if you don’t change `j.ml` (most likely you won’t),
    so you probably don’t need it

-   Having [NodeJS](https://nodejs.org/) installed

-   Having Make installed

-   OS: Mac/Linux (Note BuckleScript works on Windows, but the dev mode
    is not tested)

**Below assume that you are working in `jscomp` directory, and that
you’ve followed instructions from [???](#Minimal dependencies) to build
OCaml.**

\# Contributing to `bsb.exe`

The build target is

    make -C bin bsb.exe

So whenever you change files relevant to the build tool `bsb.exe`, try
it and do some test. If it works, send a pull request!

Note that for most binaries in BuckleScript, we also have a **release
mode**, which will pack all relevant files into a single file. This is
important, since it will cut all our dev-dependencies, so the user does
not need install those tools.

You can verify it by typing

    make snapshotml # see the diffs in jscomp/bin

But please **don’t commit** those changes in PR, it will cause painful
merge conflicts.

\# Contributing to `bsc.exe`

    make -C bin bsc.exe # build the compiler in dev mode

    make libs # build all libs using the dev compiler

There is also a snapshot mode,

    make snapshotml

This will actually snapshot your changes into a single ml file and used
in npm distribution. But please **don’t commit** those changes in PR, it
will cause painful merge conflicts.

\# Contributing to the runtime

BuckleScript runtime implementation is currently a mix of OCaml and
JavaScript. (`jscomp/runtime` directory). The JavaScript code is defined
in the `.ml` file using the `bs.raw` syntax extension.

The goal is to implement the runtime **purely in OCaml** and you can
help contribute.

Each new PR should include appropriate testing.

Currently all tests are in `jscomp/test` directory and you should either
add a new test file or modify an existing test which covers the part of
the compiler you modified.

-   Add the filename in `jscomp/test/test.mllib`

-   Add a suite test

The specification is in `jscomp/test/mt.ml`

For example some simple tests would be like:

    let suites : _ Mt.pair_suites =
       ["hey", (fun _ -> Eq(true, 3 > 2));
           "hi", (fun _ -> Neq(2,3));
           "hello", (fun _ -> Approx(3.0, 3.0));
           "throw", (fun _ -> ThrowAny(fun _ -> raise 3))
           ]
    let () = Mt.from_pair_suites __FILE__ suites

-   Run the tests

Suppose you have mocha installed, if not, try `npm install mocha`

`mocha -R list jscomp/test/your_test_file.js`

To build libs, tests and run all tests:

`make libs && make -C test all && npm test`

-   See the coverage

`npm run cover`

\# Contributing to the documentation

You’ll need [Asciidoctor](http://asciidoctor.org/) installed and on your
`PATH`. Go into `site/docsource/`, modify the section you want, and run
`build.sh`. You can check the `build.compile` file for debug output.

\# Contributing to the API reference

The API reference is generated from doc comments in the source code.
[Here](https://github.com/bucklescript/bucklescript/blob/99650/jscomp/others/js_re.mli#L146-L161)'s
a good example

Some tips and guidelines:

-   The first sentence or line should be a very short summary. This is
    used in indexes and by tools like merlin.

-   Ideally, every function should have **at least one** `@example`

-   Cross-reference another definition with `{! identifier}`. But use
    them sparingly, they’re a bit verbose (currently, at least).

-   Wrap non-cross-referenced identifiers and other code in `[ ... ]`

-   Escape `{`, `}`, `[`, `]` and `@` using `\`

-   It’s possible to use `{%html ...}` to generate custom html, but use
    this very, very sparingly.

-   A number of "documentation tags" are provided that would be nice to
    use, but unfortunately they’re often not supported for
    \`external\`s. Which is of course most of the API.

-   `@param` usually doesn’t work. Use `{b <param>} ...` instead

-   `@returns` usually doesn’t work. Use `{b returns} ...` instead.

-   Always use `@deprecated` when applicable.

-   Always use `@raise` when applicable.

-   Always provide a `@see` tag pointing to MDN for more information
    when available.

See [Ocamldoc
documentation](http://caml.inria.fr/pub/docs/manual-ocaml/ocamldoc.html#sec333)
for a lot more details.

To generate the html, run `make docs` in `jscomp/`.

Html generation uses a custom generator located in `odoc_gen/` and
custom styles located in `docs/api_static`.

\#\# Comparisons

\# Difference from
[js\_of\_ocaml](https://github.com/ocsigen/js_of_ocaml)

Js\_of\_ocaml is a popular compiler which compiles OCaml’s bytecode into
JavaScript. It is the inspiration for this project, and has already been
under development for several years and is ready for production. In
comparison, BuckleScript, while moving fast, is still a very young
project. BuckleScript’s motivation, like `js_of_ocaml`, is to unify the
ubiquity of the JavaScript platform and the truly sophisticated type
system of OCaml, however, there are some areas where we view things
differently from `js_of_ocaml`. We describe below, some of these
differences, and also refer readers to some of the original informal
[discussions](https://github.com/ocsigen/js_of_ocaml/issues/338).

-   Js\_of\_ocaml takes low-level bytecode from OCaml compiler,
    BuckleScript takes the high-level rawlambda representation from
    OCaml compiler

-   Js\_of\_ocaml focuses more on existing OCaml ecosystem(opam) while
    BuckleScript’s major goal is to target npm

-   Js\_of\_ocaml and BuckleScript have slightly different runtime
    encoding in several places, for example, BuckleScript encodes OCaml
    Array as JS Array while js\_of\_ocaml requires its index 0 to be of
    value 0.

Both projects are improving quickly, so this can change in the future!

Library API documentation
=========================

There is a small library that comes with `bs-platform`, its
documentation is
[here](http://bucklescript.github.io/bucklescript/api/).

CHANGES
=======

1.3.2
=====

-   Features

    -   Significantly improve `bsb` experience (TODO: install
        instruction)

1.2.1 + dev
===========

-   Features

    -   it’s for deterministic build

    -   -   add `-bs-syntax-only`

    -   

1.1.2
=====

-   Fixes

    -   

-   Features

    -   Provide bspp.exe for official compiler

1.1.1
=====

-   Features

    -   -   -   so that `bs.obj`, `obj`, `bs.raw`, `raw`, etc will both
        work. Note that all attributes will still be qualified

    -   -   

1.03
====

-   Features

    -   

-   Incompatible changes (due to proper Windows support):

    -   `bsc`, `bspack` and `bsppx` are renamed into `bsc.exe`,
        `bspack.exe` and `bsppx.exe`

    -   no symlink from .bin any more.

    **Old symlinks.**

    tmp&gt;ls -al node\_modules/.bin/ total 96 drwxr-xr-x 14 hzhang295
    staff 476 Sep 20 17:26 . drwxr-xr-x 4 hzhang295 staff 136 Sep 20
    17:27 .. lrwxr-xr-x 1 hzhang295 staff 22 Sep 20 17:26 bsc -&gt;
    ../bs-platform/bin/bsc lrwxr-xr-x 1 hzhang295 staff 25 Sep 20 17:26
    bspack -&gt; ../bs-platform/bin/bspack lrwxr-xr-x 1 hzhang295 staff
    24 Sep 20 17:26 bsppx -&gt;
    ../bs-platform/bin/bsppx&lt;/programlisting&gt;

Now these symlinks are removed, you have to refer to
`bs-platform/bin/bsc.exe`

1.02
====

-   Bug fixes and enhancement

    -   

-   Features

    -   By default, `bsc.exe` will warn when it detect some ocaml
        datatype is passed from/to external FFi

    -   

1.01
====

-   FFI

    -   support fields and mutable fields in JS object creation

    -   Introduce phantom arguments (`bs.ignore`) for ad-hoc

-   Bug fixes and enhancement

    -   

1.0
===

Initial release
