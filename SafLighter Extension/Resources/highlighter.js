let highlightDiv = `
    &nbsp;
    <img src="dots/yellow_dot.svg" class="flasafhighlighterdot" onclick="FLASafHighlighterFunctionsFromWeb.dotClick('yellow', this)"/>
    &#8239;
    <img src="dots/orange_dot.svg" class="flasafhighlighterdot" onclick="FLASafHighlighterFunctionsFromWeb.dotClick('orange', this)"/>
    &#8239;
    <img src="dots/green_dot.svg" class="flasafhighlighterdot" onclick="FLASafHighlighterFunctionsFromWeb.dotClick('green', this)"/>
    &#8239;
    <img src="dots/pink_dot.svg" class="flasafhighlighterdot" onclick="FLASafHighlighterFunctionsFromWeb.dotClick('pink', this)"/>
    &#8239;
    <img src="dots/blue_dot.svg" class="flasafhighlighterdot" onclick="FLASafHighlighterFunctionsFromWeb.dotClick('blue', this)"/>
    &#8239;
    <img src="dots/close.svg" class="flasafhighlighterclose" onclick="FLASafHighlighterFunctionsFromWeb.dotHide(this)"/>
    &nbsp;
`

const tagNames = ["flasaflighteryellowlight", "flasaflighteryellowdark", "flasaflighterorangelight", "flasaflighterorangedark", "flasaflightergreenlight", "flasaflightergreendark", "flasaflighterbluelight", "flasaflighterbluedark", "flasaflighterpinklight", "flasaflighterpinkdark"];

let currentHighlightDiv = null;

let currentSelection = null;

class FLASafHighlighterFunctions {
    static displayHighlights(inputData) {
        for (const highlight of inputData) {
            const tree = highlight["parents"];
            let tag = document.documentElement;
            let newList = [];
            let i = 0;
            
            while (i < tree.length) {
                newList = [];
                for (const child of tag.children) {
                    if (child.tagName.toLowerCase() == tree[i][0]) {
                        newList.push(child);
                    }
                }
                if (newList[tree[i][1]] != undefined) {
                    tag = newList[tree[i][1]];
                } else {
                    i = tree.length;
                    tag = null;
                }
                i += 1;
            }
            
            const toHighlight = highlight["text"];
            
            if (tag.innerHTML.includes(toHighlight)) {
                const thPosition = highlight["position"]
                let newInnerArray = [];
                let splitContent = tag.innerHTML.split(toHighlight);
                i = 0;
                while (i <= thPosition) {
                    newInnerArray.push(splitContent[i]);
                    i += 1;
                }
                newInnerArray = [newInnerArray.join(toHighlight)];
                newInnerArray.push(splitContent[i]);
                const highlightColor = highlight["color"];
                let lightOrDark = "light";
                if (tinycolor(window.getComputedStyle(tag).getPropertyValue("color")).getBrightness() > 128) {
                    lightOrDark = "dark";
                }
                newInnerArray = [newInnerArray.join("<flasaflighter" + highlightColor + lightOrDark + " id=\"" + highlight["id"] + "\">" + toHighlight + "</flasaflighter" + highlightColor + lightOrDark + ">")];
                i += 1;
                
                while (i < splitContent.length) {
                    newInnerArray.push(splitContent[i]);
                    i += 1;
                }
                const newInner = newInnerArray.join(toHighlight);
                
                tag.innerHTML = newInner;
            }
        }
        
        for (const tagName of tagNames) {
            for (let element of document.getElementsByTagName(tagName)) {
                element.addEventListener("contextmenu", async function(ev) {
                    ev.preventDefault();
                    if (element.classList.contains("flasaflighterhighlightdisabeld") == false) {
                        element.classList.add("flasaflighterhighlightdisabeld");
                        let data = await FLASafHighlighterFunctions.retreiveData();
                        const currentURL = window.location.href;
                        let cleanURL = currentURL.split("#")[0];
                        if (cleanURL.endsWith("/")) {
                            cleanURL = cleanURL.split("/");
                            cleanURL.pop();
                            cleanURL = cleanURL.join("/");
                        }
                        for (const dataitem of data[cleanURL]) {
                            if (dataitem["id"] == element.id) {
                                data[cleanURL].splice(data[cleanURL].indexOf(dataitem), 1);
                                await browser.storage.local.clear();
                                await browser.storage.local.set(data);
                            }
                        }
                        return false;
                    } else {
                        return true;
                    }
                }, false);
            }
        }
    }

    static async retreiveData() {
        const data = await browser.storage.local.get(null);
        return data;
    }

    static getOffset(el) {
        const rect = el.getBoundingClientRect();
        return {
            bottom: rect.bottom + window.scrollY,
            top: rect.top + window.scrollY,
            right: rect.right + window.scrollX,
            left: rect.left + window.scrollX,
        };
    }
    
    static getHDiv() {
        return this.highlightDiv;
    }
}

window.addEventListener("load", async function(event) {
    const currentURL = window.location.href;
    let cleanURL = currentURL.split("#")[0];
    if (cleanURL.endsWith("/")) {
        cleanURL = cleanURL.split("/");
        cleanURL.pop();
        cleanURL = cleanURL.join("/");
    }
    const data = await FLASafHighlighterFunctions.retreiveData()
    if (Object(data[cleanURL]) != undefined) {
        try {
            FLASafHighlighterFunctions.displayHighlights(Object(data[cleanURL]));
        } catch(e) {}
    }
    const toReplace = ["dots/yellow_dot.svg", "dots/orange_dot.svg", "dots/green_dot.svg", "dots/pink_dot.svg", "dots/blue_dot.svg", "dots/close.svg"];
    currentHighlightDiv = highlightDiv;
    for (const src of toReplace) {
        let newURL = browser.runtime.getURL(src);
        currentHighlightDiv = currentHighlightDiv.split(src).join(newURL);
    }
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = browser.runtime.getURL("flasafhighlighterdot.js");
    document.getElementsByTagName('head')[0].appendChild(script);
    let script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = browser.runtime.getURL("extlib/tinycolor.js");
    document.getElementsByTagName('head')[0].appendChild(script2);
});

document.addEventListener('mouseup', () => {
    let sel = document.getSelection();
    if (sel.toString() != "" && sel.toString() != currentSelection) {
        currentSelection = sel.toString();
        const offset = FLASafHighlighterFunctions.getOffset(sel.anchorNode.parentNode);
        const height = offset.bottom - offset.top;
        let posY = Math.round((((sel.anchorOffset + sel.toString().length) / sel.anchorNode.parentNode.innerHTML.length) * height) + offset.top);
        let posX = (offset.left + offset.right) / 2;
        let newdiv = document.createElement("flasafhighlighterpopupdiv");
        newdiv.innerHTML = currentHighlightDiv;
        newdiv.style.top = posY.toString() + "px";
        posX = posX - (newdiv.clientWidth / 2);
        newdiv.style.left = posX.toString() + "px";
        document.body.appendChild(newdiv);
    } else {
        for (var element of document.getElementsByTagName("flasafhighlighterpopupdiv")) {
            element.remove();
        }
    }
});
                                
document.addEventListener("FLASafLighterAppendToList", async function(info) {
    let content = info.detail;
    let data = await FLASafHighlighterFunctions.retreiveData();
    if (data[content["url"]] != undefined) {
        data[content["url"]].push(content["identifier"]);
    } else {
        data[content["url"]] = [content["identifier"]];
    }
    await browser.storage.local.clear();
    await browser.storage.local.set(data);
    
    for (const tagName of tagNames) {
        for (let element of document.getElementsByTagName(tagName)) {
            element.replaceWith(element.cloneNode(true));
        }
        for (let element of document.getElementsByTagName(tagName)) {
            element.addEventListener("contextmenu", async function(ev) {
                ev.preventDefault();
                if (element.classList.contains("flasaflighterhighlightdisabeld") == false) {
                    element.classList.add("flasaflighterhighlightdisabeld");
                    let data = await FLASafHighlighterFunctions.retreiveData();
                    for (const dataitem of data[content["url"]]) {
                        if (dataitem["id"] == element.id) {
                            data[content["url"]].splice(data[content["url"]].indexOf(dataitem), 1);
                            await browser.storage.local.clear();
                            await browser.storage.local.set(data);
                        }
                    }
                    return false;
                } else {
                    return true;
                }
            }, false);
        }
    }
});
