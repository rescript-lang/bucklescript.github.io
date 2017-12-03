---
id: embed-raw-javascript
title: Embed Raw JavaScript
---

We're introducing this **last-resort** escape hatch first, in case you're ever stuck trying the other more legitimate APIs and wanna move on. Here's how you can drop a chunk of JavaScript right into your BuckleScript file:

```ocaml
let add = [%bs.raw {|
  function(a, b) {
    console.log('hello from raw JavaScript!');
    return a + b;
  }
|}]

let _ = Js.log (add 1 2)
```

Reason syntax:

```reason
let add = [%bs.raw {|
  function(a, b) {
    console.log('hello from raw JavaScript!');
    return a + b
  }
|}];

Js.log(add(1, 2));
```

The `{|foo|}` syntax stands for OCaml/BuckleScript/Reason's multi-line, "quoted string" syntax. Think of them as the equivalent of JavaScript's template literals. No escaping is needed inside that string.

**Careful** with the OCaml/Reason syntax here. `[%bs.raw foo]` allows you to embed an expression. To embed a statement, use `[%%bs.raw foo]`:

```ocaml
[%%bs.raw "var a = 1"]
```

### Debugger

You can also drop a `[%bs.debugger]` expression in a body:

```ocaml
let f x y =
  [%bs.debugger];
  x + y
```

Reason syntax:

```reason
let f = (x, y) => {
  [%bs.debugger];
  x + y
};
```

Output:

```js
function f (x,y) {
  debugger; // JavaScript developer tools will set an breakpoint and stop here
  x + y;
}
```

### Detect Global Variables

BuckleScript provides a relatively type safe approach for such use case: `bs.external`. `[%bs.external a_single_identifier]` is a value of type `option`. Example:

```ocaml
match [%bs.external __DEV__] with
| Some _ -> Js.log "dev mode"
| None -> Js.log "production mode"
```

Reason syntax

```reason
switch [%bs.external __DEV__] {
| Some(_) => Js.log("dev mode")
| None => Js.log("production mode")
};
```

Output:

```js
var match = typeof (__DEV__) === "undefined" ? undefined : (__DEV__);

if (match !== undefined) {
  console.log("dev mode");
} else {
  console.log("production mode");
}
```

Another example:

```ocaml
match [%bs.external __filename] with
| Some f -> Js.log f
| None -> Js.log "non-node environment"
```

Reason syntax

```reason
switch [%bs.external __filename] {
| Some(f) => Js.log(f)
| None => Js.log("non-node environment")
};
```

Output:

```js
var match = typeof (__filename) === "undefined" ? undefined : (__filename);

if (match !== undefined) {
  console.log(match);
} else {
  console.log("non-node environment");
}
```

### Tips & Tricks

Embedding raw JS snippets is **highly discouraged**, though also highly useful if you're just starting out. As a matter of fact, the first few Reason BuckleScript projects were converted through:

- pasting raw JS snippets inside a file
- examining the JS output (identical)
- gradually extract a few values and functions and making sure the output still looks OK

At the end, we get a fully safe, converted Reason BuckleScript file whose JS output is clean enough that we can confidently assert that no new bug has been introduced during the conversion process.

We have a small guide on this iteration [here](https://reasonml.github.io/guide/javascript/interop). Feel free to peruse it later.
