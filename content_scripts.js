
console.log("YT FS Chat Extension: Loaded");
console.log("LEzGo!");
var hasChat = 0;



function ytchat_toggle() {

    const yt_fs_elem = document.querySelector("body.no-scroll video.html5-main-video")
    const chat_box = document.querySelector('#chatbox')
    const tgl_img = document.querySelector('#chat-arrow')

    const status = chat_box?.getAttribute("status");

    if (status === 1) {
        chat_box.classList.remove("ytext-cbopen");
        chat_box.classList.add("ytext-cbclose");
        yt_fs_elem.classList.remove("ytext-open");
        yt_fs_elem.classList.add("ytext-close");
        chat_box.setAttribute("status", 0);
        tgl_img.src = chrome.runtime.getURL('/images/open.png');
    } else {
        chat_box.classList.add("ytext-cbopen");
        chat_box.classList.remove("ytext-cbclose");
        yt_fs_elem.classList.add("ytext-open");
        yt_fs_elem.classList.remove("ytext-close");
        chat_box.setAttribute("status", 1);
        tgl_img.src = chrome.runtime.getURL('/images/close.png');
    }
}

function set_fs_chat() {

    console.log('Setting FS Chat')

    const yt_fs_elem = document.querySelector("body.no-scroll video.html5-main-video");
    const yt_chat_elem = document.querySelector("ytd-live-chat-frame#chat");
    const yt_fs_chat = document.querySelector("body.no-scroll div.html5-video-container #chat");

    if (yt_fs_chat) {
        const chatBox = document.createElement('div');
        const chatHide = document.createElement('div');

        chatBox.style.backgroundImage = "url('" + chrome.runtime.getURL('/images/loading.gif') + "')";
        chatBox.setAttribute("id", 'chatbox');
        chatBox.setAttribute("status", 1);
        chatBox.appendChild(chatHide);
        chatBox.insertAdjacentHTML('beforeend', yt_chat_elem.innerHTML);

        chatHide.setAttribute("id", 'hide-chat');
        chatHide.onclick = ytchat_toggle;

        const tgl_img = document.createElement('img');

        tgl_img.setAttribute("id", 'chat-arrow');
        tgl_img.src = chrome.runtime.getURL('/images/close.png');

        chatHide.appendChild(tgl_img);

        yt_fs_elem.parentNode?.parentNode?.appendChild(chatBox);

        const chat_box = document.querySelector('#chatbox');

        yt_fs_elem.classList.add("ytext-open");
        yt_fs_elem.classList.remove("ytext-close");

        chat_box.classList.add("ytext-cbopen");
        chat_box.classList.remove("ytext-cbclose");
    }
}

function classChanged(mutationsList) {
    mutationsList.forEach(mutation => {
        if (mutation.attributeName === 'class') {
            if (document.querySelector('body').classList.contains('no-scroll')) {
                console.log("Is Full Screen");
                set_fs_chat();
            } else {
                console.log("Is NOT Full Screen");

                let chatbox = document.querySelectorAll('#chatbox');
                chatbox.forEach(function (box) {
                    box.remove();
                });

            }
        }
    });
}


window.addEventListener('load', function () {

    console.log("YT FS Chat Extension: Page Loaded");

    const findChatTry = 0;
    const waitforchat = setInterval(function () {
        if (findChatTry === 10) {
            clearInterval(waitforchat);
            console.log("No Chat Found")
            return;
        }
        yt_chat_elem = document.querySelectorAll("ytd-live-chat-frame#chat");
        if (yt_chat_elem.length > 0) {
            clearInterval(waitforchat);
            console.log("WE ARE LIVE!")
            var body = document.querySelector("body");
            body.classList.add("YTFSChat");
            const FSobserver = new MutationObserver(classChanged)
            FSobserver.observe(body, { attributes: true });
        }
    }, 1000);
});


