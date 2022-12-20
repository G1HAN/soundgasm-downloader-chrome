(() => {
  download_audio();
  return true;
})();

function download_audio() {
  const url = get_audio_url();
  const title = get_audio_title();
  const author = get_audio_author();

  console.debug("URL:", url);
  console.debug("Title:", title);
  console.debug("Author:", author);

  if (!url || !title || !author) {
    console.warn("No url, title or author found");
    return;
  }

  chrome.runtime.sendMessage({ url, title, author }).catch(console.error);
}

function get_audio_url() {
  const script_tag = Array.from(document.getElementsByTagName("script")).find(
    (script) => script.src == ""
  );
  const script_text = script_tag.textContent;
  const url_expression = /https:\/\/media\.soundgasm\.net\/sounds\/.+\.m4a/;

  const result = url_expression.exec(script_text);
  return result ? result[0] : null;
}

function get_audio_title() {
  return document.querySelector("div.jp-details div.jp-title").textContent;
}

function get_audio_author() {
  return document.querySelector("body div a[href^='https://soundgasm.net/u/']")
    .textContent;
}
