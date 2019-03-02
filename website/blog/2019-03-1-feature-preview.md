---
title: First-class `bs.variadic` Support in the Next Release
---

In previous releases, when a `bs.variadic` external (previously called `bs.splice` prior to version `4.08`) is present, its tail arguments needed to be applied statically. In other words, the `external` marked with `bs.variadic`, when used, requires a _literal_ array:

```ocaml
external join : string array -> string = ""
[@@bs.module "path"][@@bs.variadic]

let _ = join [|"a"; "b"|] (* this is ok *)
let f b = join b (* compiler error when you try to abstract `join` *)
```

```reason
[@bs.module "path"][@bs.variadic]
external join: array(string) => string = ""

let _ = join([|"a", "b"|]) /* this is ok */
let f = b => join(b) /* compiler error when you try to abstract `join` */
```

More importantly, such compilation error was leaky in cases such as this one:

```ocaml
let f = join
```

```reason
let f = join
```

In the next release, we are going to lift such restriction. You'll be able to call an external marked with `bs.variadic` with an array reference, not just a literal array.

Caveat: it's unclear how to support such first class `bs.variadic` call in conjunction with `bs.new`, so an external declaration that contains both will trigger a compilation error. We'll try to figure out this particular case in the future too.

