/**
 * Hero Impact variant.
 * Renders a LIGHT, two-column hero (eyebrow + headline + supporting copy on the
 * left, a media card on the right) with an overlaid statistics bar across the
 * lower area of the media card. Matches the source design of the Medtronic
 * "Our Impact" hero ("A healthy life. A healthy planet. For everyone.").
 *
 * Distinct from hero-video (light, but a centered white content card with no
 * stats) and from hero-stats (has the stats strip but is a dark, full-bleed
 * band). This variant keeps the light layout AND the overlaid stats bar.
 * @param {Element} block The hero-impact block element
 */
export default function decorate(block) {
  // Promote any link that points at a video file to a looping, muted,
  // autoplaying background video so the media card matches the source design.
  const videoLink = [...block.querySelectorAll('a')].find((a) => /\.(mp4|webm|m3u8)(\?|$)/i.test(a.href));
  if (videoLink) {
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.muted = true;
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.className = 'hero-impact-bg';
    const source = document.createElement('source');
    source.src = videoLink.href;
    video.append(source);
    videoLink.closest('div')?.prepend(video);
    videoLink.remove();
  }

  // Tag a trailing list of "figure + label" pairs as the overlaid stats bar.
  // Authors express each statistic as a short list item / paragraph run; the
  // last list becomes the stats strip laid over the media card.
  const stats = block.querySelector('ul');
  if (stats) stats.classList.add('hero-impact-bar');
}
