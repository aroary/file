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

document.onkeydown = e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        updateFile(file.value);
    }
};