# sourcefoundry - a idiomatic `git server`

a small, simple, idiomatic `git` frontend.

## bugs

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

