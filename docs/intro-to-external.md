---
id: intro-to-external
title: Intro to External
---

Many parts of the interop system uses a concept called `external`, so we'll specially introduce it here.

`external` is a keyword for declaring a value in BuckleScript/OCaml/Reason:

```ocaml
external myCFunction : int -> string = "theCFunctionName"
```

Reason syntax:

```reason
external myCFunction : int => string = "theCFunctionName"
```

It's like a `let`, except that the body of an external is, as seen above, a string. That string usually has specific meanings depending on the context. For native OCaml, it usually points to a C function of that name. For BuckleScript, these externals are usually decorated with certain `[@bs.blabla]` attributes.

Once declared, you can use an `external` as a normal value.

BuckleScript `external`s are inlined into their callers during compilation and completely erased. In practice, when you e.g. bind to a JavaScript function on the BS side and use it, all trace of such binding disappear from the output.

**Note**: do also use `external`s and the `[bs.blabla]` attributes in the interface files. Otherwise the inlining won't happen.

## Special Identity External

One external worth mentioning is the following one:

```ocaml
external myShadyConversion : foo -> bar = "%identity"
```

Reason syntax:

```reason
external myShadyConversion : foo => bar = "%identity"
```

This is a final escape hatch which does nothing but converting from the type `foo` to `bar`. In the following sections, if you ever fail to write a JS binding, you can fall back to use this one. But try not to.
