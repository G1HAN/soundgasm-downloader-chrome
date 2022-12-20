const list = document.getElementById("open-tabs");
const template =
  '<a href="#" class="list-group-item list-group-item-action"></a>';

document.getElementById("download-all").addEventListener("click", async () => {
  const tabs = await chrome.tabs.query({ url: "https://soundgasm.net/u/*/*" });
  for (const tab of tabs) {
    await download_audio(tab.id);
  }
});

(async () => {
  const tabs = await chrome.tabs.query({ url: "https://soundgasm.net/u/*/*" });

  if (tabs.length == 0) {
    insert_tab(undefined, "No audios open");
    document.getElementById("auto-hide").style.display = "none";
    return;
  }

  for (const tab of tabs) {
    const url = new URL(tab.url);
    const path = url.pathname.split("/").slice(2);
    const title = path[1].replace(/-/g, " ");
    const author = path[0];

    insert_tab(tab.id, `${title} - u/${author}`);
  }
})();

function insert_tab(tab_id, text) {
  const item = html_to_element(template);
  item.addEventListener("click", () => download_audio(tab_id));
  item.appendChild(document.createTextNode(text));
  list.appendChild(item);
}

function html_to_element(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

async function download_audio(tab_id) {
  return await chrome.tabs.executeScript(tab_id, {
    file: "/content-scripts/injected-download.js",
  });
}
