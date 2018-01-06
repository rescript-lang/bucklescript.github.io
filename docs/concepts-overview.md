---
title: Concepts Overview
---

Before starting the next few sections, here are a helpful things to know:

## OCaml

This is the backing of BuckleScript. BuckleScript is a fork of OCaml, specifically `v4.02.3` (upgrade impending!). This doc site assumes basic knowledge of OCaml; you can learn OCaml through [Real World OCaml](https://realworldocaml.org/) or, if you're learning Reason anyway, start with the [Reason site](https://reasonml.github.io/).

**This documentation site will mostly cover just the extra bits we've added to OCaml to enable good JS interoperability**.

## Reason

An alternative syntax for OCaml that's more familiar to JS programmers and reduces the learning overhead a bit. Reason works with OCaml, since apart from the syntax they share most other things. This also means Reason works with BuckleScript. The latter has some first-class support for some other utilities of Reason.

## OPAM

This is OCaml's official package manager. Since BuckleScript uses NPM and Yarn, you won't need OPAM as a beginner. We will mention it for advanced workflows.

## Binding/External/Interop/FFI

These are all jargon for working with BuckleScript <-> JavaScript.

Binding: make a JavaScript value available to BuckleScript. "I bound to this JavaScript value", "I wrote bindings to this JS library" (aka I wrapped the JS library to expose a more idiomatic BuckleScript API), etc.

External: in the context of BuckleScript, this is one of the primary feature for binding to a JS value.

Interop: short for "interoperability".

FFI: Foreign Function Interface. The general term for things like "external", "interop" and "binding". Basically means calling a value from the other language.
