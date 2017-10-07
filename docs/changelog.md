CHANGES
=======

1.3.2
-----

-   Features

    -   Significantly improve `bsb` experience (TODO: install
        instruction)

1.2.1 + dev
-----------

-   Features

    -   it’s for deterministic build

    -   -   add `-bs-syntax-only`

    -   

1.1.2
-----

-   Fixes

    -   

-   Features

    -   Provide bspp.exe for official compiler

1.1.1
-----

-   Features

    -   -   -   so that `bs.obj`, `obj`, `bs.raw`, `raw`, etc will both
        work. Note that all attributes will still be qualified

    -   -   

1.03
----

-   Features

    -   

-   Incompatible changes (due to proper Windows support):

    -   `bsc`, `bspack` and `bsppx` are renamed into `bsc.exe`,
        `bspack.exe` and `bsppx.exe`

    -   no symlink from .bin any more.

    **Old symlinks.**

    tmp&gt;ls -al node\_modules/.bin/ total 96 drwxr-xr-x 14 hzhang295
    staff 476 Sep 20 17:26 . drwxr-xr-x 4 hzhang295 staff 136 Sep 20
    17:27 .. lrwxr-xr-x 1 hzhang295 staff 22 Sep 20 17:26 bsc -&gt;
    ../bs-platform/bin/bsc lrwxr-xr-x 1 hzhang295 staff 25 Sep 20 17:26
    bspack -&gt; ../bs-platform/bin/bspack lrwxr-xr-x 1 hzhang295 staff
    24 Sep 20 17:26 bsppx -&gt;
    ../bs-platform/bin/bsppx&lt;/programlisting&gt;

Now these symlinks are removed, you have to refer to
`bs-platform/bin/bsc.exe`

1.02
----

-   Bug fixes and enhancement

    -   

-   Features

    -   By default, `bsc.exe` will warn when it detect some ocaml
        datatype is passed from/to external FFi

    -   

1.01
----

-   FFI

    -   support fields and mutable fields in JS object creation

    -   Introduce phantom arguments (`bs.ignore`) for ad-hoc

-   Bug fixes and enhancement

    -   

1.0
---

Initial release
