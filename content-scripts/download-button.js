(() => {
  const path_split = window.location.pathname.split("/").slice(2);
  const page_type = path_split.length == 1 ? "author" : "audio";
  const download_button = html_to_element(
    '<button type="button" id="download"' +
      'style="font-size: 1.2em; width: 100%; height: 2em">' +
      "</button>"
  );

  let insert_after, click_function;
  if (page_type == "author") {
    download_button.textContent = `Download all from u/${path_split[0]}`;
    insert_after = "header";
    click_function = download_all_audios;
  } else if (page_type == "audio") {
    download_button.textContent = "Download";
    insert_after = "div.jp-type-single";
    click_function = download_audio;
  }

  document
    .querySelector(insert_after)
    .insertAdjacentElement("afterend", download_button);
  download_button.addEventListener("click", click_function);
})();

function html_to_element(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

function download_all_audios() {
  let urls = [...document.querySelectorAll("div.sound-details a")].map(
    (a) => a.href
  );

  const confirmation = window.confirm(
    "Each audio will be opened and closed in a new tab, " +
      "downloads will start automatically. Audios in total: " +
      urls.length
  );
  if (!confirmation) return;

  chrome.runtime
    .sendMessage({
      urls,
    })
  
}

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
