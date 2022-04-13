const
    span = 
    {
        woah: document.getElementById('woah'),
        woahContent: document.getElementById('woahContent'),
        name: document.getElementById('name')
    },

    div =
    {
        bottomButtons: document.getElementById('bottomButtons')
    };

span.woah.onclick = () =>
{
    if (span.woahContent.innerHTML.length > 0) return;

    const woahContent =
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

    span.woahContent.innerHTML = woahContent;

    let x = 0;

    const int = setInterval(() =>
    {
        if (span.woahContent.style.opacity >= 0.9) return clearInterval(int);

        x = x + 0.1;

        span.woahContent.style.opacity = x.toString();
    }, 50);
};

span.name.onclick = () =>
{
    if (div.bottomButtons.innerHTML.length > 0) return;

    const bottomButtonsConent =
    `<button id="discord">
        <a href="https://discord.com/users/580322451729154049">
        <img id="discord" src="Assets/Discord.svg">
        </a>
    </button>

    <button id="github">
        <a href="https://github.com/biologyscience">
        <img id="github" src="Assets/GitHub.svg">
        </a>
    </button>

    <button id="reddit">
        <a href="https://www.reddit.com/user/BIOLOGYSCIENCE">
        <img id="reddit" src="Assets/Reddit.svg">
        </a>
    </button>

    <button id="steam">
        <a href="https://steamcommunity.com/id/biologyscience">
        <img id="steam" src="Assets/Steam.svg">
        </a>
    </button>`;

    const a = { steam: document.getElementById('link:steam') }

    div.bottomButtons.innerHTML = bottomButtonsConent;

    document.body.scrollTo({left: 0, top: document.body.scrollHeight, behavior: 'smooth'});

    let x = 0;

    const int = setInterval(() =>
    {
        if (div.bottomButtons.style.opacity >= 1) return clearInterval(int);

        x = x + 0.01;

        div.bottomButtons.style.opacity = x.toString();
    }, 10);
};