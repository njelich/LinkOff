# LinkOff - LinkedIn Filter and Customizer 🧹

## LOOKING FOR NEW MAINTAINER, APPLY [HERE](https://github.com/njelich/LinkOff/issues/54)

LinkOff cleans and customizes LinkedIn. It filters out the junk, leaving behind the posts and page elements that you want to see.

<p>
  <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/users/maanaljajdhhnllllmhmiiboodmoffon?label=Chrome%20users">
  <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/rating/maanaljajdhhnllllmhmiiboodmoffon">
  <img alt="Mozilla Add-on" src="https://img.shields.io/amo/users/linkoff-clean-your-feed?label=Firefox%20users">
  <img alt="Mozilla Add-on" src="https://img.shields.io/amo/rating/linkoff-clean-your-feed">
  <img alt="GitHub manifest version" src="https://img.shields.io/github/manifest-json/v/njelich/linkoff">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/njelich/linkoff">
  <img alt="GitHub" src="https://img.shields.io/github/license/njelich/linkoff">
<p/>

[![Preview LinkOff](https://j.gifs.com/4QE44n.gif)](https://www.youtube.com/watch?v=rGQneD68f1w)

Links: [Chrome Web Store](https://chrome.google.com/webstore/detail/linkoff-clean-your-feed/maanaljajdhhnllllmhmiiboodmoffon) | [Firefox Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/linkoff-clean-your-feed/) | [Edge Extensions (Guide)](https://www.howtogeek.com/411830/how-to-install-google-chrome-extensions-in-microsoft-edge/) | [Brave, Vivaldi (click the Add button)](https://chrome.google.com/webstore/detail/linkoff-clean-your-feed/maanaljajdhhnllllmhmiiboodmoffon) | [Opera Add-Ons (guide)](https://addons.opera.com/en/extensions/details/install-chrome-extensions/) | [LinkedIn Thread](https://www.linkedin.com/posts/njelich_from-the-idea-to-submission-in-only-12-hours-activity-6785679700992778240-lhRB)

Make your LinkedIn experience better, instantly! With fewer distractions and better filtered content your sales, lead generation and networking will be a smoother and more enjoyable experience.

No more seeing unwanted likes and comments by your connections. Block the feed or filter it using custom keywords and find the connections and posts you want more easily. Job seeking? Advanced job filtering coming soon. While you are waiting, clean up your inbox - it can do it!

Also available on Firefox. Coming soon to Opera and other browsers.

🚀 Features

> ⭐️ Option to hide the whole feed
>
> ⭐️ Post filtering by content (polls, videos, promoted, shared, etc)
>
> ⭐️ Hide posts by companies or specific people
>
> ⭐️ Filter by custom keywords (politics, coronavirus, vaccination, Noah Jelich, whatever)
>
> ⭐️ Hide posts shown due to interactions (comments, reactions, followed by connections)
>
> ⭐️ Hide irrelevant old posts (older than an hour, day, week, month)

> ⭐️ Select messages for mass deletion (clean your inbox)
>
> ⭐️ MESSAGE FILTERS COMING SOON

> ⭐️ Unfollow all collections

> ⭐️ JOB FILTERING COMING SOON

> ⭐️ Block ads on LinkedIn (banners, and sidebar)
>
> ⭐️ Hide LinkedIn learning and course recommendations
>
> ⭐️ Hide community panel and follow recommendations
>
> ⭐️ Stop LinkedIn premium upsell pestering
>
> ⭐️ Toggle-able dark mode

> ⭐️ Fully configurable to suit your need!
>
> ⭐️ Completely FREE and with NO ADS

> ⭐️ Made with ❤️ by Noah Jelich

🚀 Frequently Asked Questions

> ⭐️ Are you going to make a Tampermonkey/Greasemonkey script?
>
> Unfortunately, no. I do not have time to maintain any more code
> ⭐️ What about Vivaldi/Brave/Edge/Opera and other browsers?
>
> The extension can be natively installed on all chromium browsers
> ⭐️ What about Safari and MacOs?
>
> The store charges 100$ per year to post apps, which I cannot afford
> ⭐️ How can I use this on mobile?
>
> Since neither Chrome or Firefox allow for extensions in mobile browsers, you need to install a chromium distribution that does. I recommend Kiwi Browser (if you have any issues, please report them, still testing mobile support)

### Contributing

Please create an issue before submitting a pull request.

Use npm to install dependencies, simply run `npm i`. To rebuild the CSS from SCSS run `npm run css-build`.

To install the extension locally follow the instructions below for your browser.

**Firefox**

- Type about:debugging in the Firefox URL bar and press enter.
- Click This Firefox on the left, and then Load Temporary Add-on... in the middle
- Navigate to the location of the folder you unzipped, select the manifest.json file inside.

**Chromium**

- Type chrome://extensions in the Chrome URL bar and press enter.
- Enable developer mode using the toggle on the right
- Click Load Unpacked on the left side of the screen.
- Navigate to the location of the folder you unzipped, and select it.

#### Commit message format

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `<header>` format should be as follows:

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: common|home|feed|messages|jobs|misc... or empty
  │
  └─⫸ Commit Type: feat|fix|perf
```

##### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

##### Type

If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

##### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

##### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

##### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.
