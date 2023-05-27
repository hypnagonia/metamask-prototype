const explorerURL = 'https://etherscan.io'

export const explorerNFTURL = (address: String) => `${explorerURL}/token/${address}`


export const formatPrice = (value: any) => {
  const price = 1
  const bi = BigInt(value || 0) / BigInt(10 ** 14);
  const v = parseInt(bi.toString()) / 10000;

  let res
  if (price && v > 0) {
    res = (v * +price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currency: "USD",
    });
  }

  return res
}

export const getWindowParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  const v = urlParams.get(param)
  return v as string
}


export const setWindowParam = (param: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set(param, value)
  const updatedQueryString = searchParams.toString();
  const newUrl = `${window.location.pathname}?${updatedQueryString}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

export const throttle = (delay = 1000) => {
  let timeoutId: any
  let timePassed = 1

  return (f: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timePassed = Date.now() - timePassed
    } else {
      timePassed = 0
    }

    timeoutId = setTimeout(() => {
      f()
      timeoutId = null
    }, delay - timePassed)

    timePassed = Date.now()
  }
}

export const tweet = (text: string, url = window.location.href) => {
  const tweetText = encodeURIComponent(text) // Replace with your tweet text
  const tweetUrl = encodeURIComponent(url) // Replace with the URL you want to share
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`
  window.open(twitterUrl, '_blank');
}