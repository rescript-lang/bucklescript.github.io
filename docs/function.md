---
id: function
title: Function
---

Binding to JS functions is like binding to a normal value:

```ocaml
external encodeURI: string -> string = "encodeURI" [@@bs.val]
let result = encodeURI "hello"
```

Reason syntax:

```reason
[@bs.val] external encodeURI : string => string = "encodeURI";
let result = encodeURI("hello");
```
