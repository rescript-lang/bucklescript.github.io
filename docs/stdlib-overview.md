---
title: Overview
---

BuckleScript is mostly just OCaml, so they share the same standard library. The OCaml syntax version is [here](https://caml.inria.fr/pub/docs/manual-ocaml-4.02/stdlib.html). The Reason syntax version is [here](https://reasonml.github.io/api/index.html).

**Note** that BuckleScript is currently at OCaml v4.02.3. We will upgrade to a newer OCaml later on.

In addition, we provide a few extra modules, documented [here](https://bucklescript.github.io/bucklescript/api/):

- `Dom`: contains DOM types. The DOM is very hard to bind to, so we've decided to only keep the types in the stdlib and let users bind to the subset of DOM they need downstream.
- `Node`: for node-specific APIs. Experimental; contribution welcome!
- `Js`: all the familiar JS APIs and modules are here! E.g. if you want to use the [JS Array API](https://bucklescript.github.io/bucklescript/api/Js.Array.html) over the [OCaml Array API](https://caml.inria.fr/pub/docs/manual-ocaml-4.02/libref/Array.html) because you're more familiar with the former, go ahead.
