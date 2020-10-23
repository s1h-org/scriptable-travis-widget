# scriptable-travis-widget
An iOS 14 widget for [travis-ci.com](https://travis-ci.com) built with [Scriptable](https://scriptable.app/) which display recents build states for a given repository.

## Small Widget

<img src="https://github.com/s1h-org/scriptable-travis-widget/blob/main/gfx/small.jpg" width="400">

## Medium Widget

<img src="https://github.com/s1h-org/scriptable-travis-widget/blob/main/gfx/medium.jpg" width="400">

## Large Widget

<img src="https://github.com/s1h-org/scriptable-travis-widget/blob/main/gfx/large.jpg" width="400">

# Installation

The Travis widget requires a few things to properly work:

1. [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188?ign-mpt=uo%3D4), obviously (v1.5.0 or later)
2. A Travis API token for [travis-ci.com](https://travis-ci.com)
3. The repo slug (owner/name) of the repository you want to view in your widget

## Travis

- Get the [Travis CLI client](https://github.com/travis-ci/travis.rb#installation)
- Login:
`travis login --com`
- Retrieve a token:
`travis token`

## Scriptable

- If not yet done, install [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188?ign-mpt=uo%3D4)
- Copy the source code of `travis.js` (click "raw" on the upper right)
- Open Scriptable
- Add a new script and paste the copied source
- Give the script a descriptive name (e.g. Travis) and save it ("Done")
- Add a new "Scriptable" widget to your homescreen
- While still in wiggle mode, tap the widget to configure it
- Choose your saved script for "Script"
- Select "Run Script" for "When Interacting"
- As parameter, add the following JSON data, adjusted to your setup:
`{"repository": "repo_owner/repo_name", "token": "your_travis_api_token"}`

<img src="https://github.com/s1h-org/scriptable-travis-widget/blob/main/gfx/config.jpg" width="400">
