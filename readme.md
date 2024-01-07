# sourcefoundry - a idiomatic `git server`

a small, simple, idiomatic `git` frontend.

regex
1) \b__(?<catch>[a-zA-Z0-9]+).html?$|\b_([a-zA-Z0-9]+)

## bugs

- can't load external resources
- need `"`/`'` around directive paths
- public directories shoudl be configurable
- `/layouts/default.html` -> `/default.html` (path roots)
- if `server.onload` is blocking, the page will freeze. 
  > a [configurable] max timeout?
- seperate `ssr` into own pkg (seperate from server again)
  >> can use as a library, ie. for `tern` or as binary, ie. for SSG
  >> SSG: just change buoldsteps
          support github pages - github CI to rebuild on push!
- change `skua` colours - darker background in dark mode, table themes?
- ditch `skua` for `SRCFNDRY` (doesn't fit vibe - see `stagit`)
- regex paths in `tern` - eg. file path as slug.
- `skua` responsive forms / form styling

## pipeline

1. `smew`
2. copy static files to `dist/`
3. [minify `dist/`](https://github.com/wilsonzlin/minify-html)
4. [cull CSS (read: `skua`)](https://github.com/purifycss/purifycss)
5. `tern`

## simple text format

to continue a line, write on a new,
  indented line.
this line will be rendered beneath the other.

this line will be rendered with a 1 line gap.

a list is written with 1 arbritrary character, followed by a space
- so this
! this
* and this are all valid.

all are valid but hold differing semantics.
newlines work the same in list items, too (just offset):
- this is
    all on 1 line
  whereas this is on another line, but in the same point
- now this is another bullet point

headings are written between dash characters. the number of characters on each
  side is ignored, and different characters give different orders of headings.

=== HIGH-ORDER HEADING ===

by convention, there is only 1 per document and it is written
  in ALL CAPS

- low order heading -

a parser may also wish to take note of prefixes.
prefixes are ALL-CAPS words followed by a colon, usually at the beginning of sentences
  or punctuation like brackets.
eg.
TODO: NTS: FIX: NOTE: LINK:

an inline quote is written between >>/<<s, like so:
regular text >> quoted text << and more regular text

a block quote is written like so
>>> long, multine quotes go like
    so. indentation before the
    closing << doesn't matter     <<<
    ~ me, 2022

by semantics, attribution is denoted via a `~` character.

"verbatim blocks" are denoted with 3 backticks (`)s 
a format specifier may optionally follow.

```python
print("fancy!")
```

or can be inlined using singular backticks `like so`.
verbatim blocks should be rendered in a monospace font.

asterisks denote *bold*.
underscores denote _italics_.

as a matter of style, '' is preferred over "".

pair-value texts can be expressed like such, where values
  should be aligned (irrespective of alignment in the source).

'some term' some value 
'2nd term'  2nd value
'another' should still be aligned, despite the values not
            matching up in the source.

TODO: tables?

