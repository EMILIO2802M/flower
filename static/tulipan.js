/* Generate a dotted heart inside .heart-stage using a parametric heart curve.
   Creates `count` dots and animates them appearing in sequence. */

function createHeartDots(container) {
  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const cx = width / 2;
  const cy = height / 2.6; // lift a bit
  const scale = Math.min(width, height) / 40;
  const outlineCount = Math.max(600, Math.round(1000 * (scale / 10)));
  const interiorCount = Math.max(300, Math.round(520 * (scale / 10)));
  const delays = [];

  // Add a blurred SVG silhouette under the dots to define the heart shape
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'heart-silhouette');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  const pathEl = document.createElementNS(svgNS, 'path');
  // build path by sampling the parametric heart curve
  const steps = 240;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const px = cx + x * scale * 0.95;
    const py = cy - y * scale * 0.95;
    if (i === 0) d += `M ${px} ${py}`;
    else d += ` L ${px} ${py}`;
  }
  d += ' Z';
  pathEl.setAttribute('d', d);
  pathEl.setAttribute('fill', '#ff0018');
  pathEl.setAttribute('fill-opacity', '0.18');
  svg.appendChild(pathEl);
  container.appendChild(svg);
  // use the same path to clip the container so dots appear only inside the heart silhouette
  try {
    container.style.clipPath = `path('${d.replace(/'/g, "\\'")}')`;
    container.style.webkitClipPath = `path('${d.replace(/'/g, "\\'")}')`;
  } catch (e) {
    // clip-path may fail on some browsers — ignore silently
  }

  // Helper: heart parametric
  function heartXY(t, radJitter = 0) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const jitter = (Math.random() - 0.5) * radJitter;
    const px = cx + (x * (scale * (1 + jitter)));
    const py = cy - (y * (scale * (1 + jitter)));
    return { px, py };
  }

  // Create dense outline dots (higher probability near curve)
  // function to compute normal vector approximate
  function normalAt(t) {
    const h = 0.0001;
    const p1 = heartXY(t);
    const p2 = heartXY(t + h);
    const tx = p2.px - p1.px;
    const ty = p2.py - p1.py;
    // normal = (-ty, tx)
    const nx = -ty;
    const ny = tx;
    const len = Math.sqrt(nx * nx + ny * ny) || 1;
    return { nx: nx / len, ny: ny / len };
  }

  for (let i = 0; i < outlineCount; i++) {
    const t = Math.PI * 2 * (i / outlineCount);
    const { px, py } = heartXY(t, 0);
    // add several points along normal to create thick rim
    const n = normalAt(t);
    const rimOffset = (Math.random() * 8 - 2) + (Math.random() - 0.5) * 2;
    const ox = px + n.nx * rimOffset;
    const oy = py + n.ny * rimOffset;
    const dot = document.createElement('div');
    dot.className = 'heart-dot outline';
    const s = 1 + Math.round(Math.random() * 3);
    dot.style.width = `${s}px`;
    dot.style.height = `${s}px`;
    dot.style.left = `${ox + (Math.random() - 0.5) * 3}px`;
    dot.style.top = `${oy + (Math.random() - 0.5) * 3}px`;
    // start scattered
    const startX = cx + (Math.random() - 0.5) * width * 1.8;
    const startY = cy + (Math.random() - 0.5) * height * 1.8;
    const dx = Math.round(startX - px);
    const dy = Math.round(startY - py);
    dot.style.transform = `translate(${dx}px, ${dy}px) scale(${0.6 + Math.random() * 0.6})`;
    dot.style.opacity = '0';
    const delay = Math.round(Math.random() * 420) + (i % 120) * 4;
    dot.style.transition = `transform 680ms cubic-bezier(0.18,0.9,0.3,1) ${delay}ms, opacity 420ms ease ${delay}ms`;
    container.appendChild(dot);
    delays.push(delay);
    requestAnimationFrame(() => {
      dot.style.opacity = '1';
      dot.style.transform = `translate(0px, 0px) scale(1)`;
    });
  }

  // Interior grain
  for (let i = 0; i < interiorCount; i++) {
    const t = Math.PI * 2 * Math.random();
    const r = Math.random();
    const { px, py } = heartXY(t, 0.6);
    // push interior points slightly toward center
    const ix = cx + (px - cx) * (0.62 + Math.random() * 0.28) + (Math.random() - 0.5) * 8;
    const iy = cy + (py - cy) * (0.62 + Math.random() * 0.28) + (Math.random() - 0.5) * 8;
    const dot = document.createElement('div');
    dot.className = 'heart-dot inner';
    const s = 1 + Math.round(Math.random() * 3);
    dot.style.width = `${s}px`;
    dot.style.height = `${s}px`;
    dot.style.left = `${ix}px`;
    dot.style.top = `${iy}px`;
    const startX = cx + (Math.random() - 0.5) * width * 1.8;
    const startY = cy + (Math.random() - 0.5) * height * 1.8;
    const dx = Math.round(startX - ix);
    const dy = Math.round(startY - iy);
    dot.style.transform = `translate(${dx}px, ${dy}px) scale(${0.5 + Math.random() * 0.7})`;
    dot.style.opacity = '0';
    const delay = Math.round(Math.random() * 520) + (i % 80) * 3;
    dot.style.transition = `transform 820ms cubic-bezier(0.18,0.9,0.3,1) ${delay}ms, opacity 320ms ease ${delay}ms`;
    container.appendChild(dot);
    delays.push(delay);
    requestAnimationFrame(() => {
      dot.style.opacity = '1';
      dot.style.transform = `translate(0px, 0px) scale(1)`;
    });
  }

  // Vertical seam stronger: create clustered bright trail
  createCenterTrail(container, cx, cy, height, true);

  // bottom drip: create few larger drops moving downward
  createDrip(container, cx, cy + scale * 28, height);

  // after all dots scheduled, set a timeout to trigger a final pulse when animations finish
  const maxDelay = delays.length ? Math.max(...delays) : 0;
  const formationTime = maxDelay + 950; // allow transitions to finish
  setTimeout(() => {
    container.classList.add('heart-formed');
    const dots = container.querySelectorAll('.heart-dot');
    dots.forEach((d, idx) => {
      const beatDelay = (idx % 30) * 6;
      d.style.transition = `transform 360ms ease ${beatDelay}ms`;
      d.style.transform = 'scale(1)';
    });
    container.classList.add('heartbeat');
  }, formationTime);
}

function createCenterTrail(container, cx, cy, height, strong = false) {
  const trailCount = strong ? Math.round(height / 1.6) : Math.round(height / 2);
  for (let i = 0; i < trailCount; i++) {
    const y = cy - height * 0.45 + (i / trailCount) * height * 0.9 + (Math.random() - 0.5) * 4;
    const x = cx + (Math.random() - 0.5) * (strong ? 4 : 8);
    const t = document.createElement('div');
    t.className = 'trail-dot';
    const size = strong ? (1 + Math.random() * 3) : (1 + Math.random() * 2);
    t.style.width = `${size}px`;
    t.style.height = `${size}px`;
    t.style.left = `${x}px`;
    t.style.top = `${y}px`;
    t.style.opacity = `${0.6 + Math.random() * 0.4}`;
    t.style.transform = `scale(${0.6 + Math.random() * 1.2})`;
    container.appendChild(t);
  }
}

function createDrip(container, x, y, height) {
  const drops = 16;
  for (let i = 0; i < drops; i++) {
    const drop = document.createElement('div');
    drop.className = 'trail-dot drip';
    const size = 2 + Math.round(Math.random() * 3);
    drop.style.width = `${size}px`;
    drop.style.height = `${size * 1.6}px`;
    drop.style.left = `${x + (Math.random() - 0.5) * 8}px`;
    drop.style.top = `${y + Math.random() * 20 + i * 6}px`;
    drop.style.opacity = `${0.7 + Math.random() * 0.3}`;
    container.appendChild(drop);
    // animate slight fall
    const delay = i * 80 + 600;
    drop.style.transition = `top 800ms cubic-bezier(0.2,0.9,0.2,1) ${delay}ms, opacity 900ms ease ${delay}ms`;
    requestAnimationFrame(() => {
      drop.style.top = `${y + 30 + i * 10}px`;
      drop.style.opacity = '0.5';
    });
  }
}

function initHeart() {
  const heartStage = document.querySelector('.heart-stage');
  if (!heartStage) return;
  // clear any previous
  heartStage.innerHTML = '';
  createHeartDots(heartStage);
  // responsive: regenerate on resize
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      heartStage.innerHTML = '';
      createHeartDots(heartStage);
    }, 220);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeart);
} else {
  initHeart();
}