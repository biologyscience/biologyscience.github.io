const
    gooseLeft = document.getElementById('gooseLeft'),
    gooseRight = document.getElementById('gooseRight'),
    buttonYes = document.getElementById('yes'),
    buttonNo = document.getElementById('no'),
    bottomContent = document.getElementById('bottomContent');

let
    x = 0,
    z = 0;

const
    yes = ['YES !!!', 'hehee', 'lulul', 'KesavRam = Goose confirmed', 'Pro u', 'eheh bore', 'hi ig', '<s> enough </s>', 'bue :)'],
    no = ['goose aa', 'close and click yes', 'I SAID CLICK YES', 'gooseu', 'MENTAL !!!', 'Button is Disabled'];

setInterval(() => {
    document.body.style.backgroundImage = 'linear-gradient(' + x + 'deg, rgb(26, 215, 245), rgb(161, 71, 235))';
    x++;
    if (x === 360) { x = 0; }
}, 50);

buttonYes.onclick = () =>
{
    if (z === no.length - 1) { z = 0; }

    bottomContent.innerHTML = yes[Math.floor(Math.random() * (yes.length - 1))];

    bottomContent.style.animation = 'shake 200ms';

    setTimeout(() => { bottomContent.style.animation = ''; }, 200);
};

buttonNo.onclick = () =>
{
    if (z === no.length - 1)
    {
        bottomContent.innerHTML = no[no.length - 1];
        bottomContent.style.animation = 'shake 200ms';
    }

    else
    {
        bottomContent.innerHTML = no[z];
        bottomContent.style.animation = 'shake 200ms';
        z++;
    }

    setTimeout(() => { bottomContent.style.animation = ''; }, 200);
};