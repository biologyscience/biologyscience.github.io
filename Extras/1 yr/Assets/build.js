const
    span = 
    {
        woah: document.getElementById('woah'),
        woahContent: document.getElementById('woahContent'),
        clickMepopup: document.getElementById('clickMepopup')
    };

//

span.woah.onclick = () =>
{
    let x = 0;

    const int = setInterval(() =>
    {
        if (span.woahContent.style.opacity >= 0.8) return clearInterval(int);

        x = x + 0.1;

        span.woahContent.style.opacity = x.toString();
    }, 50);
};