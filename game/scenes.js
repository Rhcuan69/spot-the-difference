// Twin Garden — scene art. Every picture is drawn from code: no image files, no
// copied art. Each scene paints a base picture; a "variant" set names the
// differences that change on the right-hand panel. A difference is fair when
// its spot is easy to point at once you see it, and hard while you have not.

export const PANEL_W = 600;
export const PANEL_H = 440;

// Small helpers shared by the painters.
function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Scene 1 — Morning Garden (easy). A cottage, a tree, a fence, a flower bed.
// ---------------------------------------------------------------------------
function drawGarden(ctx, v) {
  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#8ec8ee');
  sky.addColorStop(1, '#e8f4c8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 300);

  // Sun with rays (diff: sunrays — the right picture has a bare sun).
  ctx.fillStyle = '#ffd93b';
  circle(ctx, 78, 66, 34);
  ctx.fillStyle = '#f7b731';
  circle(ctx, 78, 66, 26);
  if (!v.has('sunrays')) {
    ctx.strokeStyle = '#f7b731';
    ctx.lineWidth = 5;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      line(ctx, 78 + Math.cos(a) * 40, 66 + Math.sin(a) * 40,
        78 + Math.cos(a) * 54, 66 + Math.sin(a) * 54, 5, '#f7b731');
    }
  }

  // Clouds.
  ctx.fillStyle = '#ffffff';
  ellipse(ctx, 220, 70, 52, 20);
  ellipse(ctx, 250, 60, 40, 18);
  ellipse(ctx, 470, 48, 46, 16);
  ellipse(ctx, 495, 58, 34, 14);

  // Hills.
  ctx.fillStyle = '#7cc46a';
  ellipse(ctx, 130, 470, 260, 150);
  ctx.fillStyle = '#69b457';
  ellipse(ctx, 480, 480, 280, 160);

  // Cottage.
  ctx.fillStyle = '#f3e2c2';
  ctx.fillRect(300, 180, 170, 140);
  ctx.fillStyle = '#c65b4e';
  poly(ctx, [[288, 182], [385, 118], [482, 182]]);
  // Chimney and smoke (diff: smoke — the right picture has no smoke).
  ctx.fillStyle = '#a98467';
  ctx.fillRect(428, 108, 24, 62);
  if (!v.has('smoke')) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    circle(ctx, 440, 96, 12);
    circle(ctx, 452, 80, 15);
    circle(ctx, 438, 62, 11);
  }
  // Door.
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(362, 248, 46, 72);
  circle(ctx, 398, 286, 4);
  ctx.fillStyle = '#ffd93b';
  circle(ctx, 398, 286, 4);
  // Window with curtains (diff: window — curtains closed on the right).
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(318, 206, 44, 44);
  ctx.fillStyle = '#9fd4ef';
  ctx.fillRect(322, 210, 36, 36);
  if (v.has('window')) {
    ctx.fillStyle = '#e8873a';
    ctx.fillRect(322, 210, 36, 36);
    line(ctx, 340, 210, 340, 246, 2, '#b45f22');
  } else {
    ctx.fillStyle = '#e8873a';
    ctx.fillRect(322, 210, 8, 36);
    ctx.fillRect(350, 210, 8, 36);
  }
  line(ctx, 340, 210, 340, 246, 2, '#ffffff');
  line(ctx, 322, 228, 358, 228, 2, '#ffffff');
  // Second window.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(420, 206, 44, 44);
  ctx.fillStyle = '#9fd4ef';
  ctx.fillRect(424, 210, 36, 36);
  line(ctx, 442, 210, 442, 246, 2, '#ffffff');
  line(ctx, 424, 228, 460, 228, 2, '#ffffff');

  // Tree with apples (diff: apple — one apple is gone on the right).
  ctx.fillStyle = '#6b4a2b';
  ctx.fillRect(138, 250, 22, 80);
  ctx.fillStyle = '#4e9b47';
  circle(ctx, 150, 210, 62);
  circle(ctx, 105, 240, 44);
  circle(ctx, 195, 240, 44);
  ctx.fillStyle = '#e23b2e';
  const apples = [[128, 196], [168, 222], [196, 196], [118, 246], [150, 252]];
  for (const [ax, ay] of apples) {
    if (v.has('apple') && ax === 168 && ay === 222) continue;
    circle(ctx, ax, ay, 8);
  }

  // Fence with a cat (diff: cat — the cat is gone on the right).
  ctx.fillStyle = '#d9b380';
  for (let x = 20; x < 580; x += 34) {
    ctx.fillRect(x, 330, 14, 44);
    poly(ctx, [[x, 330], [x + 7, 320], [x + 14, 330]]);
  }
  ctx.fillRect(10, 344, 580, 8);
  ctx.fillRect(10, 362, 580, 8);
  if (!v.has('cat')) {
    ctx.fillStyle = '#3a3a3a';
    ellipse(ctx, 250, 316, 16, 12);
    circle(ctx, 264, 300, 9);
    poly(ctx, [[258, 293], [261, 285], [265, 292]]);
    poly(ctx, [[266, 292], [270, 285], [272, 293]]);
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.moveTo(236, 318);
    ctx.quadraticCurveTo(222, 306, 228, 296);
    ctx.quadraticCurveTo(234, 304, 240, 312);
    ctx.closePath();
    ctx.fill();
  }

  // Flower bed (diff: flower — one bloom turns blue on the right).
  const bed = [[60, 396], [120, 386], [180, 398], [240, 388], [300, 396], [540, 396]];
  for (const [fx, fy] of bed) {
    ctx.strokeStyle = '#3f7a4e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fx, fy + 18);
    ctx.lineTo(fx, fy);
    ctx.stroke();
    const isTarget = fx === 120 && fy === 386;
    ctx.fillStyle = isTarget && v.has('flower') ? '#4a7de0' : '#e23b2e';
    for (let p = 0; p < 5; p++) {
      const a = (p * Math.PI * 2) / 5 - Math.PI / 2;
      circle(ctx, fx + Math.cos(a) * 8, fy + Math.sin(a) * 8, 6);
    }
    ctx.fillStyle = '#ffd93b';
    circle(ctx, fx, fy, 5);
  }

  // Butterfly (diff: butterfly — it flew away on the right).
  if (!v.has('butterfly')) {
    ctx.fillStyle = '#b06fd6';
    ellipse(ctx, 512, 116, 10, 7);
    ellipse(ctx, 530, 116, 10, 7);
    ellipse(ctx, 514, 128, 8, 6);
    ellipse(ctx, 528, 128, 8, 6);
    line(ctx, 521, 112, 521, 132, 2, '#2e2a22');
  }

  // Path stones.
  ctx.fillStyle = '#d9cba8';
  ellipse(ctx, 385, 345, 26, 9);
  ellipse(ctx, 385, 380, 30, 10);
  ellipse(ctx, 385, 415, 34, 11);
}

// ---------------------------------------------------------------------------
// Scene 2 — Harbour at Dusk (medium). Lighthouse, boats, pier, gulls.
// ---------------------------------------------------------------------------
function drawHarbour(ctx, v) {
  // Dusk sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#3d2b63');
  sky.addColorStop(0.55, '#c65b7c');
  sky.addColorStop(1, '#f2a65a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 260);

  // Setting sun.
  ctx.fillStyle = '#ffdf6b';
  circle(ctx, 500, 200, 34);
  ctx.fillStyle = 'rgba(255,223,107,0.35)';
  circle(ctx, 500, 200, 52);

  // Gulls (diff: gull — one of the three is missing on the right).
  ctx.strokeStyle = '#2e2a22';
  ctx.lineWidth = 3;
  const gulls = [[210, 84], [250, 66], [296, 92]];
  for (const [gx, gy] of gulls) {
    if (v.has('gull') && gx === 250 && gy === 66) continue;
    ctx.beginPath();
    ctx.moveTo(gx - 12, gy);
    ctx.quadraticCurveTo(gx - 4, gy - 8, gx, gy);
    ctx.quadraticCurveTo(gx + 4, gy - 8, gx + 12, gy);
    ctx.stroke();
  }

  // Sea.
  ctx.fillStyle = '#274b73';
  ctx.fillRect(0, 260, PANEL_W, 180);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const wy = 286 + i * 24;
    ctx.beginPath();
    ctx.moveTo(20 + i * 30, wy);
    ctx.quadraticCurveTo(90 + i * 30, wy - 6, 160 + i * 30, wy);
    ctx.stroke();
  }

  // Lighthouse (diff: beam — its light is off on the right).
  ctx.fillStyle = '#f3ead8';
  poly(ctx, [[86, 330], [98, 120], [142, 120], [154, 330]]);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(92, 210, 56, 26);
  ctx.fillRect(96, 158, 48, 26);
  ctx.fillStyle = '#2e2a22';
  ctx.fillRect(94, 100, 52, 22);
  ctx.fillStyle = '#ffd93b';
  ctx.fillRect(104, 106, 32, 12);
  if (!v.has('beam')) {
    ctx.fillStyle = 'rgba(255,223,107,0.45)';
    poly(ctx, [[136, 112], [330, 60], [330, 150]]);
    circle(ctx, 120, 112, 10);
  }
  ctx.fillStyle = '#2e2a22';
  ctx.fillRect(88, 330, 64, 10);

  // Sailboat (diff: sail — white sail turns red on the right).
  ctx.fillStyle = '#6b4a2b';
  poly(ctx, [[268, 300], [352, 300], [336, 318], [284, 318]]);
  line(ctx, 310, 300, 310, 216, 4, '#6b4a2b');
  ctx.fillStyle = v.has('sail') ? '#c0392b' : '#ffffff';
  poly(ctx, [[310, 220], [310, 296], [344, 296]]);
  ctx.fillStyle = '#f2a65a';
  poly(ctx, [[306, 232], [306, 296], [280, 296]]);

  // Small boat with a flag (diff: flag — the flag is gone on the right).
  ctx.fillStyle = '#7a4a2b';
  poly(ctx, [[420, 330], [500, 330], [488, 346], [432, 346]]);
  line(ctx, 462, 330, 462, 268, 3, '#7a4a2b');
  if (!v.has('flag')) {
    ctx.fillStyle = '#e23b2e';
    poly(ctx, [[462, 268], [492, 276], [462, 284]]);
  }

  // Buoy (diff: buoy — orange turns yellow on the right).
  ctx.fillStyle = v.has('buoy') ? '#ffd93b' : '#e8722a';
  ellipse(ctx, 520, 366, 18, 12);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(512, 356, 16, 5);

  // Pier (diffs: crate, rope).
  ctx.fillStyle = '#8a6b45';
  ctx.fillRect(340, 330, 260, 14);
  ctx.fillStyle = '#6b4a2b';
  for (let x = 350; x < 600; x += 26) ctx.fillRect(x, 330, 4, 14);
  ctx.fillRect(360, 344, 10, 60);
  ctx.fillRect(560, 344, 10, 60);
  // Crate on the pier (diff: crate — gone on the right).
  if (!v.has('crate')) {
    ctx.fillStyle = '#b98a4a';
    ctx.fillRect(412, 296, 36, 34);
    line(ctx, 412, 296, 448, 330, 2, '#7a5a2e');
    line(ctx, 448, 296, 412, 330, 2, '#7a5a2e');
  }
  // Rope coil (diff: rope — gone on the right).
  if (!v.has('rope')) {
    ctx.strokeStyle = '#e8d9a0';
    ctx.lineWidth = 4;
    circle(ctx, 380, 380, 14);
    ctx.strokeStyle = '#c9b478';
    ctx.beginPath();
    ctx.arc(380, 380, 8, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------------------
// Scene 3 — Forest Camp (hard). Night, tent, campfire, owl, lantern.
// ---------------------------------------------------------------------------
function drawForest(ctx, v) {
  // Night sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#101a33');
  sky.addColorStop(1, '#274b73');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 300);

  // Stars (diff: star — the brightest one is gone on the right).
  ctx.fillStyle = '#ffffff';
  const stars = [[60, 60], [140, 40], [230, 70], [330, 44], [420, 60], [560, 44], [90, 120]];
  for (const [sx, sy] of stars) circle(ctx, sx, sy, 2);
  if (!v.has('star')) {
    ctx.fillStyle = '#ffe98a';
    circle(ctx, 80, 80, 5);
    line(ctx, 80, 70, 80, 90, 2, '#ffe98a');
    line(ctx, 70, 80, 90, 80, 2, '#ffe98a');
  }

  // Moon.
  ctx.fillStyle = '#f4ead0';
  circle(ctx, 500, 70, 30);
  ctx.fillStyle = '#d9cba8';
  circle(ctx, 490, 62, 6);
  circle(ctx, 508, 78, 4);

  // Pine trees.
  function pine(x, y, s) {
    ctx.fillStyle = '#2c5a37';
    poly(ctx, [[x, y - 150 * s], [x - 52 * s, y - 40 * s], [x + 52 * s, y - 40 * s]]);
    poly(ctx, [[x, y - 110 * s], [x - 42 * s, y - 10 * s], [x + 42 * s, y - 10 * s]]);
    ctx.fillStyle = '#4a3220';
    ctx.fillRect(x - 8 * s, y - 12 * s, 16 * s, 22 * s);
  }
  pine(60, 330, 1.0);
  pine(560, 340, 1.1);
  pine(520, 300, 0.7);

  // Ground.
  ctx.fillStyle = '#1e3d24';
  ctx.fillRect(0, 300, PANEL_W, 140);
  ctx.fillStyle = '#2c5a37';
  ellipse(ctx, 300, 452, 320, 40);

  // Owl on a branch (diff: owl — it flew off on the right).
  line(ctx, 90, 170, 190, 150, 6, '#4a3220');
  if (!v.has('owl')) {
    ctx.fillStyle = '#8a6b45';
    ellipse(ctx, 120, 140, 20, 26);
    circle(ctx, 120, 112, 16);
    ctx.fillStyle = '#ffffff';
    circle(ctx, 113, 110, 5);
    circle(ctx, 127, 110, 5);
    ctx.fillStyle = '#2e2a22';
    circle(ctx, 113, 110, 2);
    circle(ctx, 127, 110, 2);
    ctx.fillStyle = '#e8a13a';
    poly(ctx, [[120, 116], [116, 122], [124, 122]]);
    ctx.fillStyle = '#8a6b45';
    ellipse(ctx, 102, 142, 7, 14);
    ellipse(ctx, 138, 142, 7, 14);
  }

  // Lantern hanging from a branch (diff: lantern — unlit on the right).
  line(ctx, 190, 150, 260, 132, 5, '#4a3220');
  line(ctx, 224, 132, 224, 156, 2, '#2e2a22');
  if (!v.has('lantern')) {
    ctx.fillStyle = 'rgba(255,223,107,0.35)';
    circle(ctx, 224, 178, 34);
  }
  ctx.fillStyle = v.has('lantern') ? '#5a5a5a' : '#ffd93b';
  ctx.beginPath();
  ctx.roundRect(210, 156, 28, 40, 6);
  ctx.fill();
  ctx.fillStyle = '#2e2a22';
  ctx.fillRect(216, 150, 16, 6);
  ctx.fillRect(216, 196, 16, 5);

  // Tent (diff: door — open on the right, showing a warm glow).
  ctx.fillStyle = '#c65b4e';
  poly(ctx, [[250, 360], [340, 230], [430, 360]]);
  ctx.fillStyle = '#a84a3e';
  poly(ctx, [[340, 230], [430, 360], [386, 360]]);
  if (v.has('door')) {
    ctx.fillStyle = '#ffd93b';
    poly(ctx, [[322, 360], [340, 296], [358, 360]]);
    ctx.fillStyle = '#2e2a22';
    poly(ctx, [[334, 360], [340, 320], [346, 360]]);
  } else {
    ctx.fillStyle = '#8a3a32';
    poly(ctx, [[322, 360], [340, 296], [358, 360]]);
    line(ctx, 340, 296, 340, 360, 2, '#5e2620');
  }
  line(ctx, 340, 230, 340, 360, 3, '#8a3a32');

  // Campfire (diff: flame — small and blue on the right).
  ctx.fillStyle = '#4a3220';
  line(ctx, 288, 396, 316, 384, 7, '#4a3220');
  line(ctx, 316, 396, 288, 384, 7, '#4a3220');
  ctx.fillStyle = '#8a8a8a';
  ellipse(ctx, 302, 398, 26, 8);
  if (v.has('flame')) {
    ctx.fillStyle = '#5a8de0';
    ellipse(ctx, 302, 378, 10, 16);
    ctx.fillStyle = '#9fc4f0';
    ellipse(ctx, 302, 382, 5, 9);
  } else {
    ctx.fillStyle = 'rgba(255,150,40,0.35)';
    circle(ctx, 302, 376, 30);
    ctx.fillStyle = '#ff8c2a';
    ellipse(ctx, 302, 372, 16, 26);
    ctx.fillStyle = '#ffd93b';
    ellipse(ctx, 302, 380, 9, 16);
  }

  // Mushrooms (diff: mushroom — one is missing on the right).
  function mushroom(x, y, s) {
    ctx.fillStyle = '#f3ead8';
    ctx.fillRect(x - 3 * s, y, 6 * s, 12 * s);
    ctx.fillStyle = '#e23b2e';
    ctx.beginPath();
    ctx.arc(x, y, 12 * s, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    circle(ctx, x - 5 * s, y - 6 * s, 2);
    circle(ctx, x + 4 * s, y - 8 * s, 2);
  }
  mushroom(500, 400, 1.0);
  mushroom(528, 406, 0.8);
  if (!v.has('mushroom')) mushroom(556, 402, 0.7);

  // Backpack by the tent (diff: pack — gone on the right).
  if (!v.has('pack')) {
    ctx.fillStyle = '#3f7a4e';
    ctx.beginPath();
    ctx.roundRect(448, 330, 34, 40, 10);
    ctx.fill();
    ctx.fillStyle = '#2c5a37';
    ctx.fillRect(448, 344, 34, 6);
    ctx.fillStyle = '#d9a441';
    ctx.fillRect(460, 322, 10, 10);
  }
}

export const SCENES = [
  {
    id: 'garden',
    name: 'Morning Garden',
    blurb: 'A sunny cottage garden. Warm up your eyes.',
    timeLimit: 180,
    draw: drawGarden,
    differences: [
      { id: 'sunrays', x: 78, y: 66, r: 42, label: 'the sun lost its rays' },
      { id: 'smoke', x: 440, y: 80, r: 30, label: 'the chimney smoke vanished' },
      { id: 'apple', x: 168, y: 222, r: 24, label: 'an apple is missing from the tree' },
      { id: 'window', x: 340, y: 228, r: 30, label: 'the curtains closed' },
      { id: 'cat', x: 250, y: 308, r: 30, label: 'the cat left the fence' },
      { id: 'flower', x: 120, y: 386, r: 26, label: 'a red flower turned blue' },
      { id: 'butterfly', x: 521, y: 120, r: 26, label: 'the butterfly flew away' },
    ],
  },
  {
    id: 'harbour',
    name: 'Harbour at Dusk',
    blurb: 'A lighthouse, two boats and a pier at sunset.',
    timeLimit: 150,
    draw: drawHarbour,
    differences: [
      { id: 'beam', x: 120, y: 112, r: 36, label: 'the lighthouse beam went dark' },
      { id: 'sail', x: 316, y: 258, r: 34, label: 'the big sail turned red' },
      { id: 'gull', x: 250, y: 66, r: 24, label: 'a gull is missing from the sky' },
      { id: 'buoy', x: 520, y: 364, r: 26, label: 'the buoy changed colour' },
      { id: 'crate', x: 430, y: 313, r: 28, label: 'the crate vanished from the pier' },
      { id: 'flag', x: 472, y: 276, r: 22, label: 'the little boat lost its flag' },
      { id: 'rope', x: 380, y: 380, r: 26, label: 'the rope coil is gone' },
    ],
  },
  {
    id: 'forest',
    name: 'Forest Camp',
    blurb: 'A campfire night under the pines. Look closely.',
    timeLimit: 120,
    draw: drawForest,
    differences: [
      { id: 'star', x: 80, y: 80, r: 22, label: 'the brightest star went out' },
      { id: 'owl', x: 120, y: 132, r: 32, label: 'the owl flew off its branch' },
      { id: 'lantern', x: 224, y: 176, r: 26, label: 'the lantern went dark' },
      { id: 'door', x: 340, y: 330, r: 30, label: 'the tent door opened' },
      { id: 'flame', x: 302, y: 376, r: 30, label: 'the campfire flame turned blue' },
      { id: 'mushroom', x: 556, y: 398, r: 24, label: 'a mushroom is missing' },
      { id: 'pack', x: 465, y: 350, r: 28, label: 'the backpack is gone' },
    ],
  },
];
