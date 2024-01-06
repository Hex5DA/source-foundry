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

