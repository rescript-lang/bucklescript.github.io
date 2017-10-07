Js module
=========

[API reference](https://bucklescript.github.io/bucklescript/api/Js.html)

Js module is shipped with BuckleScript, both the namespace `Js` and
`Node` are preserved.

Null and Undefined
------------------

BuckleScript does not deal with `null` and `undefined` on the language
level. Instead they are defined on the library level, represented by
`Js.Null.empty` and `Js.Undefined.empty` (and `Js.Null_undefined.empty`)
types. But due to this being Ocaml and all, we can’t just pass these
values off as if it was any type we’d like it to be, so in order to
actually use them we need to lift the type we want to use them with. For
this purpose BuckleScript defines the type `'a Js.null`,
`` 'a Js.undefined' and `'a Js.null_undefined `` (for values that can be
both `null`, `undefined` and `'a`). As well as the corresponding modules
`Js.Null`, `Js.Undefined` and `Js.Null_undefined` for working with these
types.

Here’s an example showing `Js.Null` used directly:

    external get_prop_name_maybe : unit -> string Js.null = "" [@@bs.val]
    external set_or_unset_prop : string -> int Js.null -> unit = "" [@@bs.val]

    (* unset property if fond *)
    let s = get_prop_name_maybe ()
    let _ = Js.Null.iter s (function name -> set_or_unset_prop name Js.Null.empty)

    (* set some other property *)
    let _ = set_or_unset_prop "some_other_property" (Js.Null.return "")

You might also want to map these types to `option` for a friendlier and
more idiomatic API, if the distinction between `null` and `undefined`
isn’t important to maintain:

    external try_some_thing : string Js.null -> int Js.null = ...

    let try_some_thing_maybe ( v : string option) : int option =
      Js.Null.to_opt (try_some_thing (Js.Null.from_opt v))

Boolean
-------

"Native" `bool` is for Bob-ish reasons not represented as `true` and
`false` literals in JavaScript. For interop you therefore need to use
the `Js.boolean` and its `Js.true_` and `Js.false_` values. There are
also convenience functions for coercing to and from `bool`: `Js.to_bool`
and `Js.Boolean.to_js_boolean`.
