---
id: common-data-types
title: Common Data Types
---

## Shared Data Types

BuckleScript's primitives such as `string`, `float`, `array` and a few others have a rather interesting property: they compile to the exact same thing in JavaScript! Thanks to this, there's close to no API to learn for these data types.

This means that if you receive e.g. a string from the JS side, you can use it **without conversion** on the BS side, and vice-versa. In other words, string and others are "_guaranteed public representations_".

P.S. if you need an overview of the language primitives themselves, see [the Reason docs](https://reasonml.github.io/guide/language).

**BuckleScript uses the same standard library as OCaml**; see the docs [here](https://reasonml.github.io/api/) (in Reason syntax). **Additionally**, we provide the bindings to all the familiar JS primitives [here](https://bucklescript.github.io/bucklescript/api/Js). You can mix and match these two.

### String

Immutable on both sides, as expected. [BuckleScript String API](https://reasonml.github.io/api/String.html). [JS String API](https://bucklescript.github.io/bucklescript/api/Js.String.html#VALdefault).

#### Unicode Support

OCaml string is an immutable byte sequence. If the user types some unicode:

```ocaml
Js.log "你好"
```

It'll compile to the follow JS:

```js
console.log("\xe4\xbd\xa0\xe5\xa5\xbd");
```

Which gives you cryptic console output. To rectify this, BuckleScript exposes a special `js` annotation to the default [quoted string syntax](https://reasonml.github.io/guide/language/string-and-char/#quoted-string) built into the language. Use it like this:

```ocaml
Js.log {js|你好，
世界|js}
```

This'll correctly output:

```js
console.log("你好，\n世界");
```

#### Interpolation

For convenience, we also expose another special tag quoted string annotation, `j`, which supports the equivalent of JS' string interpolation:

```ocaml
let world = {j|世界|j}
let helloWorld = {j|你好，$world|j}
```

You can surround the variable in parentheses too: `{j|你好，$(world)|j}`.

### Float

BuckleScript floats are JS numbers, vice-versa. The OCaml standard library doesn't come with a Float module. JS Float API is [here](https://bucklescript.github.io/bucklescript/api/Js.Float.html).

### Int

**Ints are 32-bits**! Be careful, you can potentially treat them as JS numbers and vice-versa, but if the number's large, then you better treat JS numbers as floats. For example, we bind to Js.Date using `float`s. Js Int API [here](https://bucklescript.github.io/bucklescript/api/Js.Int.html).

### Array

Idiomatic OCaml arrays are supposed to be fix-sized. This constraint is relaxed on the BuckleScript size. You can change its length using the usual [JS Array API](https://bucklescript.github.io/bucklescript/api/Js.Array.html#VALdefault). BuckleScript's own Array API is [here](https://reasonml.github.io/api/Array.html).

## Private Data Types

Record, variant (including `option` and `list`), object and others can be exported as well, but you should **not** rely on their internal representation on the JS side. Aka, don't grab a BS list and start manipulating its structure on the JS side.

However, for record and variant, we provide [generation of converters and accessors](generate-converters-accessors.md). Once you convert e.g. a record to a JS object, you can naturally use them on the JS side.

For list, use `Array.of_list` and `Array.to_list` in the [Array](https://reasonml.github.io/api/Array.html) module. `option` will be treated later on.

### Design Decisions

As to why we don't compile list to JS array or vice-versa, it's because OCaml array and JS array share similar characteristics: mutable, similar read/write performance, etc. List, on the other hand, is immutable and has different access perf characteristics.

The same justification applies for records. OCaml records are fixed, nominally typed, and in general doesn't work well with JS objects. We do provide excellent facilities to bind to JS objects in the [object section](object.md).

<!-- TODO: playground link -->
<!-- TODO: API docs revamp -->
