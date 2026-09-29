const copyButton = document.querySelector('#copy-button');
const copyStatus = document.querySelector('#copy-status');
copyButton.addEventListener('click', async () => {
  const post = document.querySelector('#post-copy');
  try {
    await navigator.clipboard.writeText(post.textContent);
    copyButton.textContent = 'Skopiowano ✓';
    copyStatus.textContent = 'Tekst jest w schowku.';
    setTimeout(() => { copyButton.textContent = 'Kopiuj tekst'; }, 3000);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(post);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Tekst zaznaczony. Skopiuj go skrótem ⌘C lub Ctrl+C.';
  }
});

const timeLabel = seconds => {
  const time = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
  return `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`;
};

document.querySelectorAll('video').forEach(video => {
  const player = document.createElement('div');
  player.className = 'player';
  video.before(player);
  player.append(video);
  const controls = document.createElement('div');
  controls.className = 'player-controls';
  controls.innerHTML = '<button type="button" class="play-button" aria-label="Odtwórz film">▶</button><span class="player-time">0:00 / 0:16</span><input class="player-seek" type="range" min="0" max="16" step="0.1" value="0" aria-label="Pozycja w filmie"><button type="button" class="fullscreen-button" aria-label="Pełny ekran">⛶</button>';
  player.append(controls);
  const play = controls.querySelector('.play-button');
  const seek = controls.querySelector('.player-seek');
  const time = controls.querySelector('.player-time');
  const fullscreen = controls.querySelector('.fullscreen-button');
  const toggle = () => {
    if (video.paused) video.play().catch(() => { video.controls = true; });
    else video.pause();
  };
  const update = () => {
    play.textContent = video.paused ? '▶' : 'Ⅱ';
    play.setAttribute('aria-label', video.paused ? 'Odtwórz film' : 'Wstrzymaj film');
    seek.max = Number.isFinite(video.duration) ? video.duration : 16;
    seek.value = video.currentTime;
    seek.setAttribute('aria-valuetext', `${timeLabel(video.currentTime)} z ${timeLabel(video.duration)}`);
    time.textContent = `${timeLabel(video.currentTime)} / ${timeLabel(video.duration || 16)}`;
  };
  play.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  seek.addEventListener('input', () => { video.currentTime = Number(seek.value); });
  ['loadedmetadata', 'timeupdate', 'pause', 'ended'].forEach(event => video.addEventListener(event, update));
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (player.requestFullscreen) await player.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } catch { video.controls = true; }
  });
  video.controls = false;
  video.addEventListener('play', () => {
    update();
    document.querySelectorAll('video').forEach(other => {
      if (other !== video) other.pause();
    });
  });
});
