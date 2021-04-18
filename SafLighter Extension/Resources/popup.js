document.addEventListener('DOMContentLoaded', async function() {
    let loading = document.getElementById("books_loading");
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        loading.style.filter = "invert(100%)"
    }
    const currentURL = await getURL();
    let cleanURL = currentURL.split("#")[0]
    if (cleanURL.endsWith("/")) {
        cleanURL = cleanURL.split("/")
        cleanURL.pop()
        cleanURL = cleanURL.join("/")
    }
    const data = await retreiveData()
    let elements = data[cleanURL];
    let highlights = document.getElementById("highlights")
    for (var element of elements) {
        highlights.innerHTML += "<li><table><tbody><tr><td class=\"col1 " + element["color"] + "\">●</td><td class=\"col2\">" + element["text"] + "</td></tr></tbody></table></li>";
    }
    loading.style.display = "none";
    let clearBtn = document.getElementById("clb");
    console.log(clearBtn);
    clearBtn.addEventListener("click", async function() {
        await browser.storage.local.clear();
    }, false);
});

async function retreiveData() {
    const data = await browser.storage.local.get(null);
    return data;
}

async function getURL() {
    const data = await browser.tabs.query({currentWindow: true, active: true})
    return data[0].url;
}
