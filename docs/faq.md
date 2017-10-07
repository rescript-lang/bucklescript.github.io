FAQ
===

**Q:** How does IO work in the browser?

**Q:** The compiler does not build?

**A:** In production mode, the compiler is a single file in
`jscomp/bin/compiler.ml`. If it is not compiling, make sure you have the
right OCaml compiler version. Currently the OCaml compiler is a
submodule of BuckleScript. Make sure the exact commit hash matches (we
only update the compiler occasionally).

**Q:** Which version of JavaScript syntax does BuckleScript target?

**A:** BuckleScript targets **ES5**.

**Q:** Does BuckleScript work with merlin?

**A:** Yes, you need edit your `.merlin` file:

B node\_modules/bs-platform/lib/ocaml S
node\_modules/bs-platform/lib/ocaml FLG -ppx
node\_modules/bs-platform/bin/bsppx.exe&lt;/programlisting&gt;
Note there is a [upstream
fix](https://github.com/the-lambda-church/merlin/issues/568) in Merlin,
make sure your merlin is updated.

**Q:** What polyfills does BuckleScript need?

-   *Math.imul*: This polyfill is needed for `int32` multiplication.
    BuckleScript provides this by default (when feature detection
    returns false), no action is required from the user.

-   *TypedArray*: The TypedArray polyfill is not provided by
    BuckleScript and it’s the responsibility of the user to bundle the
    desired polyfill implementation with the BuckleScript generated
    code.

        The following functions from OCaml stdlib
        require the TypedArray polyfill:

    -   Int64.float\_of\_bits

    -   Int64.bits\_of\_float

    -   Int32.float\_of\_bits

    -   Int32.bits\_of\_float

        > **Warning**
        >
        > For the current BuckleScript version, if the user does not
        > bundle the TypedArray polyfill, the JavaScript engine does not
        > support it and user used functions mentioned above, the code
        > will fail at runtime.

**Q:** Uncurried functions cannot be polymorphic?

**A:** E.g. if you try to do this at toplevel:

let id : ('a -&gt; 'a \[@bs\]) = ((fun v -&gt; v)
\[@bs\])&lt;/programlisting&gt;
You’ll get this dreaded error message

Error: The type of this expression, (\[ \`Arity\_1 of '\_a \], '\_a)
Js.fn, contains type variables that cannot be
generalized&lt;/programlisting&gt;
The issue here isn’t that the function is polymorphic. You can use (and
probably have used) polymorphic uncurried functions without any problem
as inline callbacks. But you can’t export them. The issue here is the
combination of using the uncurried calling convention, polymorphism and
exporting (by default). It’s an unfortunate limitation partly due to how
OCaml’s type system incorporates side-effects, and partly due to how
BuckleScript handles uncurrying. The simplest solution is in most cases
to just not export it, by adding an interface to the module.
Alternatively, if you really, really need to export it, you can do so in
its curried form, and then wrap it in an uncurried lambda at the call
site. E.g.:

lat \_ = map (fun v -&gt; id v \[@bs\])&lt;/programlisting&gt;
