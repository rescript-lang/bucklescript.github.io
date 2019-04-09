---
title: Release 5.0.1
---

`bs-platform@5.0.1` preview is available, try `npm i -g bs-platform@beta-4.02`! A detailed a list of changes is available [here](https://github.com/BuckleScript/bucklescript/blob/master/Changes.md#501)

Some notable new features in this release:

- react jsx v3 is available which means zero-cost for react-bindings (@rickyvetter will talk about it in a separate post)

- bs.inline for library authors. Our compilers have a pretty good inlining heuristics by default, in this release, we allow some user input for some fine-tuned inlining behavior. Read this (https://github.com/BuckleScript/bucklescript/issues/3472) for more use cases.
    A typical usage is as below
    ```
    module Platform = struct
        let ios = "ios" [@@bs.inline]
    end    
    ```
    If user wants to write an interface, it has to carry the payload though:
    ```
    module Platform : sig
        val ios : string [@@bs.inlne "ios"]
    end = struct
        let ios = "ios" [@@bs.inlne]
    end    
    ```
    It is a bit verbose for library authors, but this should be transparent to library users.



We are also actively working on a new offical release targeted to OCaml 4.06 for the forthcoming [reason-conf](https://www.reason-conf.com/), below is proposed release schedule:

We are going to support OCaml 4.06 and 4.02 at the same time for a while.

The corresponding versions for `bs-platform` would be 5.(targeting 4.02 OCaml) and 6. (targeting 4.06).

`5.*` is recommended for production usage, bug fix is prioritized (tagged as `beta-4.02` for pre-rleases)

`6.*` is expected to have some issues but encouraged to experiment until we make an official announcement it is great for production. (tagged as `beta-4.06` for pre-releases)