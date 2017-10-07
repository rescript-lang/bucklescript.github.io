\#\# Exception handling between OCaml and JS (@since 1.7.0)

In the JS world, exception could be any data, while an OCaml exception
is a structured data format and supports pattern matching. Catching an
OCaml exception on JS side is therefore a no-op.

JS exceptions can be raised from OCaml by using the `JS.Exn.raise*`
functions, and can be caught as an OCaml exception of the type
`Js.Exn.Error` with the JS exception as it’s paylaod typed as
`Js.Exn.t`. The JS Exception can then either be manipulated with the
accessor functions in `Js.Exn`, or casted to a more appropriate type.

    let () =
      try
        Js.Exn.raiseError "oops!"
      with
      | Js.Exn.Error e ->
        match Js.Exn.message e with
        | Some message -> Js.log {j|Error: $message|j}
        | None -> Js.log "An unknown error occurred"

    let maybeParsed =
      match Js.Json.parseExn {| {"x" }|} with
      | value -> Some value
      | exception Js.Exn.Error e ->
        Js.log (Js.Exn.message e);
        None

Please consult the [`Js.Exn` API reference](../api/Js.Exn.html) for more
details

\#\# `bs.open`: Type safe external data-source handling (@@since 1.7.0)

There are some cases, the data-source could either come from JS land or
OCaml land, it is very hard to give precise type information. For
example, for an external promise whose creation could come from JS API,
its failed value caused by `Promise.reject` could be in any shape.

BuckleScript provides a solution to filter out OCaml structured
exception data from the mixed data source, it preserves the type safety
while allow users to deal with mixed source.

It makes use of OCaml’s extensible variant, so that users can mix values
of type `exn` with JS data-source

**Example.**

    let handleData = function [@bs.open]
       | Invalid_argument _ -> 0
       | Not_found -> 1
       | Sys_error _ -> 2

    val handleData : 'a -> int option // 

-   For any input source, as long as it matches the exception pattern
    (nested pattern match supported), the matched value is returned,
    otherwise return `None`.

\# Use cases

Take promise for example:

    let v = Js.Promise.reject Not_found
    let handlePromiseFailure = function [@bs.open]
       | Not_found -> Js.log "Not found"; (Js.Promise.resolve ())

    let () =
       v
       |> Js.Promise.catch (fun error ->
            match handlePromiseFailure error with
            | Some x -> x
            | None -> raise UnhandledPromise
        )
