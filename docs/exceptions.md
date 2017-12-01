---
id: exceptions
title: Exceptions
---

In the JS world, exception could be any data, while an OCaml exception is a structured data format and supports pattern matching. Catching an OCaml exception on JS side is therefore doesn't work as intended.

JS exceptions can be raised from the BuckleScript side by using the [`JS.Exn.raise*`](https://bucklescript.github.io/bucklescript/api/Js.Exn.html) functions, and can be caught as a BS exception of the type `Js.Exn.Error` with the JS exception as its payload, typed as `Js.Exn.t`. The JS Exception can then either be manipulated with the accessor functions in `Js.Exn`, or casted to a more appropriate type.

```ocaml
try
  Js.Exn.raiseError "oops!"
with
| Js.Exn.Error e ->
  match Js.Exn.message e with
  | Some message -> Js.log {j|Error: $message|j}
  | None -> Js.log "An unknown error occurred"
```

Reason syntax:

```reason
try (
  Js.Exn.raiseError("oops!")
) {
| Js.Exn.Error(e) =>
  switch (Js.Exn.message(e)) {
  | Some(message) => Js.log({j|Error: $message|j})
  | None => Js.log("An unknown error occurred")
  }
};
```
