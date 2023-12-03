const { getImgurLinksFromText } = require("./getImgurLinksFromText");

describe('getImgurLinksFromText', () => {
  const URL_1 = 'https://i.imgur.com/1111111.jpg';
  const URL_2 = 'https://i.imgur.com/2222222.jpg';
  const URL_3 = 'https://i.imgur.com/2222222.mp4';

  it('should return links', () => {
    const links = getImgurLinksFromText(`   ${URL_1}   `);
    expect(links).toEqual([URL_1]);
  })
  it('should return mp4 links', () => {
    const links = getImgurLinksFromText(`   ${URL_3}   `);
    expect(links).toEqual([URL_3]);
  })
  it('should return multiple links', () => {
    const links = getImgurLinksFromText(`   ${URL_1}     asdada asdasd  ${URL_2}   `);
    expect(links).toEqual([URL_1, URL_2]);
  })
});
