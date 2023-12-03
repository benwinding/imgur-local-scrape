## imgur-local-scrape

If you're like me, you likely use "imgur.com" to host images on a bunch of random websites. But [imgur might be removing old images](https://www.reddit.com/r/TheoryOfReddit/comments/12tinfp/imgur_has_announced_that_they_will_be_removing/) that aren't accessed very often...

This package allows you to search for all "i.imgur.com/...." links and download them to a local directory.

## Installation

```
yarn add -g imgur-local-scrape
# or
npm i -g imgur-local-scrape
```

## Usage

Search for all "i.imgur.com/...." links in `./source` directory

```
imgur-local-scrape find -d ./src -s
```

Fetch all "imgur" links in `src` and save to `src/imgur` directory:

```
imgur-local-scrape find -d ./src -f -o ./src/imgur
```

## CLI

```
Usage: imgur-local-scrape find [options]

Options:
  -d, --search-directory <dir>  relative directory to search
  -g, --glob-match <glob>       glob pattern to match e.g: "md,html,js"
  -o, --output-dir <dir>        relative directory to save imgur links to
  -s, --show-links              shows the found imgur links
  -f, --fetch-images            fetch images from imgur links
  -q, --quiet                   prevent console output
  -h, --help                    display help for command
```