// This fixes the `#` problem in `[#ゆうかりんちゃんねる]`
// TODO: API still isn't happy
function urlEncode (url) {
  return url.replace(/#/g, '%23')
  // return url.split('/').map(encodeURIComponent).join('/')
}

export default urlEncode
