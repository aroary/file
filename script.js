/* wapi setup */
const wapi = wapiInit("https://auth.web10.app");
wapi.SMROnReady([{ service: "aroary-file", cross_origins: ["aroary.com", "aroary.github.io", "localhost", "127.0.0.1"] }], []);
auth.onclick = wapi.openAuthPortal;

function intitiate() {
    auth.innerHTML = "log out";
    auth.onclick = () => {
        wapi.signOut();
        window.location.reload();
    }
    const t = wapi.readToken() || {};
    message.innerHTML = "hello " + t["username"];
    readFile();
}

if (wapi.isSignedIn()) intitiate();
else wapi.authListen(intitiate);

var id;

/* CRUD Calls */
function readFile() {
    wapi
        .read("aroary-file", {})
        .then(response => {
            if (response.data.length) {
                file.textContent = response.data[0].contents;
                id = response.data[0]._id;
            } else {
                createFile("");
                readFile();
            }
        })
        .catch(console.error);
}

function createFile(contents) {
    wapi
        .create("aroary-file", { contents })
        .then(readFile)
        .catch(console.error);
}

function updateFile(contents) {
    wapi
        .update("aroary-file", { _id: id }, { $set: { contents } })
        .then(readFile)
        .catch(console.error);
}

function lw() {
    if (lineWrap.checked) file.style.whiteSpace = "pre-wrap";
    else file.style.whiteSpace = "pre";
}

function cs() {
    if (checkSpelling.checked) file.spellcheck = true;
    else file.spellcheck = false;
}

function dm() {
    const root = document.querySelector(':root');
    if (darkMode.checked) {
        root.style.setProperty('--theme-bg', 'black');
        root.style.setProperty('--theme-fg', 'white');
    }
    else {
        root.style.setProperty('--theme-bg', 'white');
        root.style.setProperty('--theme-fg', 'black');
    }
}

function rv() {
    if (renderView.checked) {
        view.style.display = "block";
        cFile.style.width = "50%";
    }
    else {
        view.style.display = "none";
        cFile.style.width = "100%";
    }
}

lw();
cs();
dm();
rv()

document.onkeydown = e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        updateFile(file.value);
    }
};

function download(data, name) {
    const a = document.createElement("a");
    a.download = name;
    a.href = window.URL.createObjectURL(new Blob([data], { type: 'text/plain' }));
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function render(mime) {
    switch (mime) {
        case "text/plain":
            rendered.innerHTML = `<div style="border:2px ridge grey;"><code white-space:pre;">${file.value}</code></div>`;
            break;
        case "text/html":
            rendered.innerHTML = `<iframe style="background-color:white;" srcdoc="${file.value}"></iframe>`;
            break;
        case "image/png":
        case "image/jpg":
        case "image/gif":
        case "image/jpeg":
        case "image/webp":
        case "image/bmp":
        case "image/tiff":
        case "image/vnd":
        case "image/svg+xml":
        case "application/pdf":
            try {
                atob(file.value);
                rendered.innerHTML = `<img style="border:2px ridge grey;" src="data:${mime};base64,${file.value}">`;
            } catch (_) {
                rendered.innerHTML = `<img style="border:2px ridge grey;" src="data:${mime};base64,${btoa(file.value)}">`;
            }
            break;
        case "audio/mpeg":
        case "audio/ogg":
        case "audio/wav":
        case "audio/webm":
            try {
                atob(file.value);
                rendered.innerHTML = `<audio style="border:2px ridge grey;" controls><source src="data:${mime};base64,${file.value}"></audio>`;
            } catch (_) {
                rendered.innerHTML = `<audio style="border:2px ridge grey;" controls><source src="data:${mime};base64,${btoa(file.value)}"></audio>`;
            }
            break;
        case "video/mp4":
        case "video/ogg":
        case "video/webm":
            try {
                atob(file.value);
                rendered.innerHTML = `<video style="border:2px ridge grey;" controls><source src="data:${mime};base64,${file.value}"></video>`;
            } catch (_) {
                rendered.innerHTML = `<video style="border:2px ridge grey;" controls><source src="data:${mime};base64,${btoa(file.value)}"></video>`;
            }
            break;
        case "application/json":
            try {
                rendered.innerHTML = `<code style="border:2px ridge grey;" style="white-space:pre;">${JSON.stringify(JSON.parse(file.value), null, 2)}</code>`;
            } catch (e) {
                rendered.innerHTML = `<code style="border:2px ridge grey;color:red;">${e}</code>`;
            }
            break;
        default:
            break;
    }
}

// data:image/jpeg;base64,