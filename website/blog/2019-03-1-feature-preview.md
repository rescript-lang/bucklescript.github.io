---
title: First class bs.variadic  support in next release
---

In previous releases, when an external is marked `bs.variadic` (was `bs.splice`), its tail arguments need to be applies statically, otherwise user will get a compile error.

For example

```
external join : string array -> string = "" 
[@@bs.module "path"]  [@@bs.variadic]

let _ = join [| "a"; "b"|] (* ok *)
let f b = join b (* compile error *)
```

More importantly, such compile error is leaky in such cases

```
let f = join
```

In next  release, we are going to lift such restriction to support it in all cases. 

We are unclear how to support it in first class in the combination of `bs.new` and `bs.variadic`, so such external declaration will trigger a compile error.

Once we figure out how to support variadic arguments in `bs.new`, we can lift such restriction.

