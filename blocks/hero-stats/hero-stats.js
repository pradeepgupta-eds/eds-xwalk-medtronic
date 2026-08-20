/**
 * Hero Stats variant.
 * Renders a full-bleed dark hero with an optional looping background video
 * (falls back to a background image / picture when no video link is present),
 * an eyebrow + headline + supporting copy, and an overlaid statistics bar.
 * @param {Element} block The hero-stats block element
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
    video.className = 'hero-stats-bg';
    const source = document.createElement('source');
    source.src = videoLink.href;
    video.append(source);
    videoLink.closest('div')?.prepend(video);
    videoLink.remove();
  }

  // Tag a trailing list of "figure + label" pairs as the overlaid stats bar.
  // Authors express each statistic as a short paragraph run; the last content
  // group (a list or a run of short paragraphs) becomes the stats strip.
  const stats = block.querySelector('ul');
  if (stats) stats.classList.add('hero-stats-bar');
}
