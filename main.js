#!/usr/bin/env node

// load using import
const { globSync } = require('glob');
const { join } = require('path');
const { program } = require("commander");
const process = require("process");
const { readFile, writeFile } = require('fs/promises');
const { getImgurLinksFromText } = require('./src/getImgurLinksFromText');
const { mkdirSync, existsSync } = require('fs');
const fetch = require('node-fetch');

program
  .command('find')
  .option('-d, --search-directory <dir>', 'relative directory to search')
  .option('-g, --glob-match <glob>', 'glob pattern to match e.g: "md,html,js"')
  .option('-o, --output-dir <dir>', 'relative directory to save imgur links to')
  .option('-s, --show-links', 'shows the found imgur links')
  .option('-f, --fetch-images', 'fetch images from imgur links')
  .option('-q, --quiet', 'prevent console output')
  .action(async function (options) {
    const relativePath = options.searchDirectory || '.';
    const globMatch = options.globMatch || 'md,html,js,css';
    const shouldLog = !options.quiet;
    if (shouldLog) {
      console.log(`Searching for imgur links...`);
      console.log(`     directory: ${relativePath}`);
      console.log(`matching files: ${globMatch} (glob pattern)`);
    }
    const files = getFilePaths(relativePath, globMatch);
    if (!files.length) {
      console.log(`No files found...`);
      return;
    }
    shouldLog && console.log(`Found ${files.length} files matching glob pattern`);
    const imgurLinks = await getImgurLinks(files);
    if (!imgurLinks.length) {
      console.log(`No imgur links found...`);
      return;
    }
    shouldLog && console.log(`Found ${imgurLinks.length} imgur links!`);
    options.showLinks && console.log(`${imgurLinks.join('\n')}`);
    const imgurLinksUnique = [...new Set(imgurLinks)];
    const hasDuplicates = imgurLinksUnique.length !== imgurLinks.length;
    if (hasDuplicates) {
      shouldLog && console.log(`Found ${imgurLinks.length - imgurLinksUnique.length} duplicate links`);
    }
    if (options.fetchImages) {
      shouldLog && console.log(`🚀 Fetching ${imgurLinksUnique.length} images from imgur!`);
      const outputDirectory = join(process.cwd(), options.outputDir || '_imgur');
      shouldLog && console.log(` using output directory: ${outputDirectory}`);
      if (!existsSync(outputDirectory)) {
        mkdirSync(outputDirectory)
        shouldLog && console.log(` created output directory...`);
      }
      await Promise.all(imgurLinksUnique.map((link, index) => downloadImgurLinkToCache(index + 1, link, outputDirectory, shouldLog)));
    }
  })

program
  .parse(process.argv);

function getFilePaths(relativePath, globMatch) {
  const path = join(process.cwd(), relativePath);
  const pathWithGlob = join(path, `./**/*.{${globMatch}}`);
  const files = globSync(pathWithGlob);
  return files;
}

async function getImgurLinks(filePaths) {
  const files = await Promise.all(filePaths.map(f => readFile(f)))
  const fileContents = files.map(f => f.toString());
  const imgurLinks = fileContents.map(contents => getImgurLinksFromText(contents));
  return imgurLinks.flat();
}

async function downloadImgurLinkToCache(index, imgurLink, outputDirectory, shouldLog) {
  const filePath = join(outputDirectory, imgurLink.split('/').pop());
  if (existsSync(filePath)) {
    shouldLog && console.log(`${index}. ✅ already downloaded ${imgurLink} to ${filePath}`);
    return;
  }
  shouldLog && console.log(`${index}. ⬇ ... downloading ${imgurLink} to ${filePath}`);
  try {
    const res = await fetch(imgurLink);
    const file = await res.buffer();
    await writeFile(filePath, file);
    shouldLog && console.log(`${index}. ✅ successfully downloaded ${imgurLink} to ${filePath}`);
  } catch (error) {
    console.error(`${index}. ❌ error downloading ${imgurLink}`, error);
  }
}
