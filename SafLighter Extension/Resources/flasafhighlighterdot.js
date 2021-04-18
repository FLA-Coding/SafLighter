class FLASafHighlighterFunctionsFromWeb {
    static getHTMLOfSelection () {
        let range;
        if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            return range.htmlText;
        } else if (window.getSelection) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
                const clonedSelection = range.cloneContents();
                let div = document.createElement('div');
                div.appendChild(clonedSelection);
                if (div.innerHTML.startsWith("<")) {
                    if (div.innerHTML.endsWith(">")) {
                        let inner = div.innerHTML.split(">");
                        inner.shift();
                        inner = inner.join(">").split("<");
                        inner.pop();
                        div.innerHTML = inner.join("<");
                        return div.innerHTML;
                    } else {
                        let inner = div.innerHTML.split(">");
                        inner.shift();
                        div.innerHTML = inner.join(">");
                        return div.innerHTML;
                    }
                } else {
                    if (div.innerHTML.endsWith(">")) {
                        let inner = div.innerHTML.split("<");
                        inner.pop();
                        div.innerHTML = inner.join("<");
                        return div.innerHTML;
                    } else {
                        return div.innerHTML;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    
    static dotClick(color, el) {
        const sel_string = this.getHTMLOfSelection();
        let appendToList = false;
        let sel_parent = null;
        let occurences = [];
        const id = Date.now();
        if (sel_string != false) {
            const sel = document.getSelection();
            sel_parent = sel.anchorNode.parentNode;
            const sel_anchor = sel.anchorOffset;
            if (sel_parent.innerHTML.indexOf(sel_string) != -1) {
                let k = true;
                let html = sel_parent.innerHTML;
                while (k) {
                    let occ = html.indexOf(sel_string) + 1;
                    if (occ != 0) {
                        occurences.push(occ);
                        html = html.replace(sel_string, "<!--flasaflighter_provisional-->");
                    } else {
                        k = false;
                    }
                }
                var closest = occurences.reduce(function(prev, curr) {
                    return (Math.abs(curr - sel_anchor) < Math.abs(prev - sel_anchor) ? curr : prev);
                });

                k = 0;
                html = sel_parent.innerHTML;
                let lightOrDark = "light";
                if (tinycolor(window.getComputedStyle(sel_parent).getPropertyValue("color")).getBrightness() > 128) {
                    lightOrDark = "dark";
                }
                window.getSelection().removeAllRanges();
                let d = true;
                for (k of occurences) {
                    if (k != closest) {
                        if (d) {
                            html = html.replace(sel_string, "<!--flasaflighter_provisional-->");
                        }
                    } else {
                        d = false;
                    }
                }
                html = html.replace(sel_string, "<flasaflighter" + color + lightOrDark + " id=\"" + id + "\">" + sel_string + "</flasaflighter" + color + lightOrDark + ">");
                html = html.split("<!--flasaflighter_provisional-->").join(sel_string)
                sel_parent.innerHTML = html;
                appendToList = true;
            }
        }
        el.parentNode.parentNode.removeChild(el.parentNode);
        if (appendToList) {
            const currentURL = window.location.href;
            let cleanURL = currentURL.split("#")[0];
            if (cleanURL.endsWith("/")) {
                cleanURL = cleanURL.split("/");
                cleanURL.pop();
                cleanURL = cleanURL.join("/");
            }
            let k = 0;
            let posRelToParent = null;
            for (const child of sel_parent.parentElement.children) {
                if (child.tagName.toLowerCase() == sel_parent.tagName.toLowerCase()) {
                    if (child == sel_parent) {
                        posRelToParent = k;
                    }
                    k += 1;
                }
            }
            let parents = [[sel_parent.tagName.toLowerCase(), posRelToParent]];
            let currentParent = sel_parent;
            let d = true;
            while (d) {
                currentParent = currentParent.parentElement;
                let currentTag = currentParent.tagName.toLowerCase();
                if (currentTag != "html") {
                    k = 0;
                    for (const child of currentParent.parentElement.children) {
                        if (child.tagName.toLowerCase() == currentTag) {
                            if (child == currentParent) {
                                posRelToParent = k;
                            }
                            k += 1;
                        }
                    }
                    parents.push([currentTag, posRelToParent]);
                } else {
                    d = false
                }
            }
            parents.reverse()
            
            const data = {
                "url": cleanURL,
                "identifier": {
                    "parents": parents,
                    "position": occurences.length - 1,
                    "text": sel_string,
                    "color": color,
                    "id": id
                }
            };
            
            let eventDetail = {"detail": data};
            var myEvent = new document.defaultView.CustomEvent("FLASafLighterAppendToList", eventDetail);
            document.dispatchEvent(myEvent);
        }
    }

    static dotHide(el) {
        el.parentNode.parentNode.removeChild(el.parentNode);
    }
}
