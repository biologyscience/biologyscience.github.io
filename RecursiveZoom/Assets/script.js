const divVideo = document.getElementById('video');
const vidVideo = document.getElementById('main');
const imgPause = document.getElementById('pause');
const imgPlay = document.getElementById('play');

imgPause.style.transition = 'opacity 1s';
imgPause.style.opacity = 0.9;

vidVideo.addEventListener('mouseenter', () =>
{
    vidVideo.play();

    imgPause.style.transition = 'opacity 200ms';
    imgPlay.style.transition = 'opacity 200ms';

    imgPause.style.opacity = 0;
    imgPlay.style.opacity = 0.9;

    setTimeout(() => { imgPlay.style.transition = 'opacity 1s'; }, 300);
    setTimeout(() => { imgPlay.style.opacity = 0; }, 1000);
});

vidVideo.addEventListener('mouseleave', () =>
{
    vidVideo.pause();

    imgPause.style.transition = 'opacity 1s';
    imgPause.style.opacity = 0.9;
});