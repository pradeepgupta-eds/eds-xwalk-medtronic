// Live Medtronic ocean/sky hero background clip.
const HERO_BG_VIDEO = 'https://www.medtronic.com/content/dam/medtronic-wide/public/channel-configuration/adobe-target/corporate/images/hp-hero-ras-bckgrnd-cnpt.mp4';

/**
 * Build a full-bleed, looping, muted background <video> for the hero band.
 * Autoplay + muted + playsinline so mobile browsers play it inline; the CSS
 * image/gradient fallback shows if the video can't load or play.
 * @param {string} src Video URL
 * @returns {HTMLVideoElement}
 */
function buildBgVideo(src) {
  const video = document.createElement('video');
  video.className = 'hero-video-bg';
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.muted = true;
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'auto');
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('tabindex', '-1');
  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  video.append(source);
  return video;
}

/**
 * loads and decorates the hero-video block.
 * Promotes an authored video link (if present) to the background video;
 * otherwise falls back to the live Medtronic ocean/sky background clip. Honors
 * prefers-reduced-motion by leaving the CSS image/gradient fallback in place.
 * @param {Element} block The hero-video block element
 */
export default function decorate(block) {
  const wrapper = block.closest('.hero-video-wrapper') || block.parentElement;
  if (!wrapper) return;

  // Respect reduced-motion: skip the video, let the CSS background show.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Prefer an authored video link inside the block; else use the live clip.
  const videoLink = [...block.querySelectorAll('a')]
    .find((a) => /\.(mp4|webm|m3u8)(\?|$)/i.test(a.href));
  const src = videoLink ? videoLink.href : HERO_BG_VIDEO;
  if (videoLink) videoLink.remove();

  const video = buildBgVideo(src);
  wrapper.prepend(video);
}
