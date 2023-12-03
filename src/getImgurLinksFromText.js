function getImgurLinksFromText(fileContent) {
  const regex = /https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]{7,})\.([a-zA-Z0-9]{3})/g;
  const matches = fileContent.match(regex);

  const links = [];
  if (matches) {
    matches.forEach((match) => {
      links.push(match);
    });
  }
  return links;
}

exports.getImgurLinksFromText = getImgurLinksFromText;
