/* wapi setup */
const wapi = wapiInit("https://auth.web10.app");
wapi.SMROnReady([{ service: "aroary-file", cross_origins: ["aroary.com", "aroary.github.io", "localhost", "127.0.0.1"] }], []);
auth.onclick = wapi.openAuthPortal;

function intitiate() {
    auth.innerHTML = "log out";
    auth.onclick = () => window.location.reload(wapi.signOut());
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

lw();

function cs() {
    if (checkSpelling.checked) file.spellcheck = true;
    else file.spellcheck = false;
}

cs();

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

dm();

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