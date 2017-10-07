\#\# JS Calling OCaml

Since BuckleScript guarantees that all OCaml functions are exported as
is, no extra work is required to expose OCaml functions to JavaScript.

> **Caution**
>
> -   `external` exports are not exported as JS functions, if you really
>     want to export those external functions, please write `val`
>     instead
>
> -   `operators` are escaped, since Javascript does not support user
>     defined operators. For example, instead of calling
>     `Pervasives.(^)`, you have to call `Pervasives.$caret` from your
>     JavaScript functions
>
If users want to consume some OCaml features only available in OCaml but
not in JS, we recommend users to export it as functions.

For example, data constructors are not available in JS

      type t =
        | Cons of int * t
        | Nil

Currently, we recommend the user expose the constructor as a function so
that it can be constructed from the JS side.

    let cons x y = Cons (x,y)
    let nil = Nil

> **Note**
>
> In the future, we will derive these functions to automate this
> process.
