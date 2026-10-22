(function (root) {
  'use strict';
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  function createRig(portrait, clean, makeCanvas) {
    makeCanvas = makeCanvas || (() => document.createElement('canvas'));
    const size = 1024;
    function layer(box, path) {
      const out = makeCanvas(); out.width = out.height = size;
      const c = out.getContext('2d'); c.save();
      if (path) { c.beginPath(); path(c); c.clip(); }
      c.drawImage(portrait, 0, 0, size, size); c.restore();
      if (box) {
        const [x, y, w, h] = box;
        const maskCanvas = makeCanvas(); maskCanvas.width = maskCanvas.height = size;
        const m = maskCanvas.getContext('2d');
        // A scaled radial alpha mask feathers the skin around the captured eye.
        m.translate(x + w / 2, y + h / 2); m.scale(w / 2, h / 2);
        const mask = m.createRadialGradient(0, 0, .65, 0, 0, 1);
        mask.addColorStop(0, '#fff'); mask.addColorStop(1, 'rgba(255,255,255,0)');
        m.fillStyle = mask; m.fillRect(-1, -1, 2, 2);
        c.globalCompositeOperation = 'destination-in'; c.drawImage(maskCanvas, 0, 0);
        c.globalCompositeOperation = 'source-over';
      }
      return out;
    }
    const eyeBoxes = [[355, 438, 100, 55], [546, 441, 106, 55]];
    const eyes = eyeBoxes.map(box => layer(box));
    const mouth = layer([414, 645, 166, 84]);
    // Both lips retain the original painted texture. A shared curved seam keeps
    // their outlines aligned while the lower lip moves to reveal the cavity.
    const topLip = layer(null, c => {
      c.moveTo(420, 672); c.bezierCurveTo(435, 666, 458, 654, 475, 660);
      c.bezierCurveTo(488, 668, 496, 658, 507, 661);
      c.bezierCurveTo(525, 664, 547, 674, 567, 673);
      c.lineTo(567, 680); c.bezierCurveTo(525, 688, 468, 690, 420, 680); c.closePath();
    });
    const bottomLip = layer(null, c => {
      c.moveTo(420, 680); c.bezierCurveTo(468, 690, 525, 688, 567, 680);
      c.bezierCurveTo(546, 709, 522, 719, 495, 716);
      c.bezierCurveTo(466, 717, 437, 700, 420, 680); c.closePath();
    });
    function drawEye(c, i, openness) {
      const [x, y, w, h] = eyeBoxes[i], cx = x + w / 2, cy = y + h / 2;
      const a = clamp(openness);
      if (a > .09) {
        c.save(); c.translate(cx, cy + (1 - a) * 4); c.scale(1, Math.max(.02, a));
        c.drawImage(eyes[i], -cx, -cy); c.restore();
      }
      if (a < .22) {
        c.save(); c.globalAlpha = 1 - a / .22; c.strokeStyle = '#715045'; c.lineWidth = 2.4;
        c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 10, cy + 4);
        c.quadraticCurveTo(cx, cy + 15, x + w - 10, cy + 4); c.stroke(); c.restore();
      }
    }
    function drawMouth(c, openness) {
      const a = clamp(openness);
      if (a < .02) { c.drawImage(mouth, 0, 0); return; }
      const gap = 43 * a;
      c.save(); c.beginPath(); c.moveTo(422, 678);
      c.bezierCurveTo(468, 686, 524, 685, 565, 678);
      c.bezierCurveTo(551, 690 + gap, 449, 691 + gap, 422, 678); c.closePath();
      c.fillStyle = '#4c2630'; c.fill(); c.clip();
      c.fillStyle = '#f5e6db'; c.fillRect(432, 680, 124, Math.min(10, gap * .3));
      c.fillStyle = '#b56770'; c.beginPath(); c.ellipse(496, 687 + gap, 39, gap * .37, 0, 0, Math.PI * 2); c.fill(); c.restore();
      c.drawImage(topLip, 0, 0); c.drawImage(bottomLip, 0, gap * .62);
    }
    function render(ctx, values, w, h) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#d4e1ec'; ctx.fillRect(0, 0, w, h);
      const fit = Math.min(w, h) / size;
      ctx.save(); ctx.translate(w / 2, h / 2);
      ctx.rotate(clamp(values.roll || 0, -.2, .2));
      ctx.scale(fit * 1.035, fit * 1.035); ctx.translate(-size / 2, -size / 2);
      ctx.drawImage(clean, 0, 0, size, size);
      drawEye(ctx, 0, values.eyeL); drawEye(ctx, 1, values.eyeR); drawMouth(ctx, values.mouth);
      ctx.restore();
    }
    return { render };
  }
  function extractPose(points, aspect = .75) {
    if (!points || points.length < 468) return null;
    const distance = (a, b) => Math.hypot(points[a].x - points[b].x, (points[a].y - points[b].y) * aspect);
    const eyeA = distance(159, 145) / Math.max(.001, distance(33, 133));
    const eyeB = distance(386, 374) / Math.max(.001, distance(263, 362));
    const A = points[33], B = points[263];
    const sorted = [{x: 1 - A.x, y: A.y, eye: eyeA}, {x: 1 - B.x, y: B.y, eye: eyeB}].sort((a, b) => a.x - b.x);
    return {eyeL: sorted[0].eye, eyeR: sorted[1].eye,
      mouth: distance(13, 14) / Math.max(.001, distance(61, 291)),
      roll: Math.atan2((sorted[1].y - sorted[0].y) * aspect, sorted[1].x - sorted[0].x)};
  }
  function mapPose(raw, baseline) {
    return {eyeL: clamp((raw.eyeL / Math.max(.05, baseline.eyeL) - .22) / .78),
      eyeR: clamp((raw.eyeR / Math.max(.05, baseline.eyeR) - .22) / .78),
      mouth: clamp((raw.mouth - baseline.mouth - .015) / .30),
      roll: clamp(raw.roll - baseline.roll, -.2, .2)};
  }
  const api = {createRig, extractPose, mapPose};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PortraitRig = api;
})(typeof window !== 'undefined' ? window : globalThis);
