/**
 * Hero Video variant.
 * Renders a prominent banner with an optional looping background video
 * (falls back to a background image / picture when no video link is present),
 * headline, supporting copy and a call-to-action.
 * @param {Element} block The hero-video block element
 */
export default function decorate(block) {
  // Promote any link that points at a video file to a looping, muted,
  // autoplaying background video so the hero matches the source design.
  const videoLink = [...block.querySelectorAll('a')].find((a) => /\.(mp4|webm|m3u8)(\?|$)/i.test(a.href));
  if (videoLink) {
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.muted = true;
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.className = 'hero-video-bg';
    const source = document.createElement('source');
    source.src = videoLink.href;
    video.append(source);
    videoLink.closest('div')?.prepend(video);
    videoLink.remove();
  }
}
