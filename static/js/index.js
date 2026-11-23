/* CADKnitter project page.
 *  - Interactive 3D results (Three.js r128, OBJ + MTL)
 *  - Tabbed qualitative-comparison galleries (data in results-data.js)
 *  - KnitCAD dataset scroller
 * Videos are loaded lazily and only play while on screen.
 */
(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var VIDEO_DIR = './static/videos/results/';
  var POSTER_DIR = './static/images/results/';

  // ------------------------------------------------------------------
  // Interactive 3D samples
  // ------------------------------------------------------------------

  var SAMPLES = [
    {
      id: 'sample_01',
      prompt: 'Make a solid piece shaped like a hexagon [...], with flat parallel ends and six flat sides, and add a smooth, round hole straight through the center so it can slide onto the round shaft of the given object.'
    },
    {
      id: 'sample_02',
      prompt: 'Create a thick, smooth circular ring with a hole in the middle, sized so it can easily slide over the long, straight shaft of the given object and rest flat against the wide circular flange at the base.'
    },
    {
      id: 'sample_03',
      prompt: 'Make a long, straight bar with a rectangular shape and flat ends so that it can slide fully into the lengthwise notch along the side of the given block, fitting snugly within the cutout space.'
    },
    {
      id: 'sample_04',
      prompt: 'Make a piece with a long round stick that has a six-sided short block connected to one end, so that the round stick can fit closely through the hole in the center of the ring-shaped disk [...]'
    },
    {
      id: 'sample_05',
      prompt: 'Make a block that is shaped like a rectangle with straight sides, and add three holes going all the way through one of its big flat faces [...] so the big hole can fit the straight round stick of the given object.'
    },
    {
      id: 'sample_06',
      prompt: 'Create a flat rectangular block with two round holes going all the way through one of the larger flat faces, so this face can line up and attach to the flat, featureless face of the given solid block.'
    }
  ];

  var COND_COLOR = 0x20b0f0;
  var GEN_COLOR = 0xf5b37a;

  function modelPaths(sample, kind) {
    var name = sample.id + '_' + kind;
    return { base: './output/' + name + '/', obj: name + '.obj', mtl: name + '.mtl' };
  }

  function createViewer(container, sample) {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    var width = container.clientWidth || 320;
    var height = container.clientHeight || 240;

    var camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2, 1.6, 2);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe3ea, 0.55));
    var key = new THREE.DirectionalLight(0xffffff, 0.75);
    key.position.set(5, 10, 7.5);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-5, -4, -6);
    scene.add(fill);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.autoRotate = !REDUCED_MOTION;
    controls.autoRotateSpeed = 1.2;
    controls.minDistance = 1;
    controls.maxDistance = 8;

    var group = new THREE.Group();
    scene.add(group);

    var viewer = {
      container: container,
      scene: scene,
      camera: camera,
      renderer: renderer,
      controls: controls,
      group: group,
      pending: 2,
      running: false,
      frame: null
    };

    var status = document.createElement('div');
    status.className = 'viewer-status';
    status.textContent = 'Loading…';
    container.appendChild(status);
    viewer.status = status;

    loadModel(viewer, modelPaths(sample, 'cond'), COND_COLOR);
    loadModel(viewer, modelPaths(sample, 'output'), GEN_COLOR);

    if (window.ResizeObserver) {
      new ResizeObserver(function () { resizeViewer(viewer); }).observe(container);
    }
    return viewer;
  }

  function loadModel(viewer, p, fallbackColor) {
    var objUrl = p.base + encodeURIComponent(p.obj);

    function withoutMaterials() {
      new THREE.OBJLoader().load(objUrl, function (object) {
        object.traverse(function (child) {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: fallbackColor, metalness: 0.1, roughness: 0.7 });
          }
        });
        modelLoaded(viewer, object);
      }, undefined, function () { modelFailed(viewer); });
    }

    new THREE.MTLLoader().load(p.base + encodeURIComponent(p.mtl), function (materials) {
      materials.preload();
      new THREE.OBJLoader().setMaterials(materials).load(objUrl, function (object) {
        modelLoaded(viewer, object);
      }, undefined, withoutMaterials);
    }, undefined, withoutMaterials);
  }

  function modelLoaded(viewer, object) {
    viewer.group.add(object);
    viewer.pending -= 1;
    if (viewer.pending > 0) return;

    // Centre and scale both parts together so they keep their relative placement.
    var box = new THREE.Box3().setFromObject(viewer.group);
    var center = box.getCenter(new THREE.Vector3());
    var size = box.getSize(new THREE.Vector3());
    var maxDim = Math.max(size.x, size.y, size.z) || 1;
    var scale = 1.6 / maxDim;
    viewer.group.scale.setScalar(scale);
    viewer.group.position.copy(center.multiplyScalar(-scale));

    viewer.status.remove();
    renderOnce(viewer);
  }

  function modelFailed(viewer) {
    viewer.status.textContent = '3D model unavailable';
  }

  function renderOnce(viewer) {
    viewer.controls.update();
    viewer.renderer.render(viewer.scene, viewer.camera);
  }

  function startViewer(viewer) {
    if (viewer.running) return;
    viewer.running = true;
    (function loop() {
      if (!viewer.running) return;
      viewer.frame = requestAnimationFrame(loop);
      renderOnce(viewer);
    })();
  }

  function stopViewer(viewer) {
    viewer.running = false;
    if (viewer.frame) cancelAnimationFrame(viewer.frame);
    viewer.frame = null;
  }

  function resizeViewer(viewer) {
    var w = viewer.container.clientWidth;
    var h = viewer.container.clientHeight;
    if (!w || !h) return;
    viewer.camera.aspect = w / h;
    viewer.camera.updateProjectionMatrix();
    viewer.renderer.setSize(w, h, false);
    renderOnce(viewer);
  }

  function initViewers() {
    var grid = document.getElementById('viewer-grid');
    if (!grid) return;

    if (window.location.protocol === 'file:') {
      var note = document.createElement('p');
      note.className = 'server-note';
      note.innerHTML = '3D models need a local web server: run <code>python3 -m http.server 8080</code> and open <a href="http://localhost:8080">localhost:8080</a>.';
      grid.parentNode.insertBefore(note, grid);
    }

    var containers = SAMPLES.map(function (sample) {
      var card = document.createElement('div');
      card.className = 'viewer-card';
      var prompt = document.createElement('p');
      prompt.className = 'prompt';
      prompt.textContent = sample.prompt;
      var box = document.createElement('div');
      box.className = 'viewer';
      box.setAttribute('role', 'img');
      box.setAttribute('aria-label', '3D view: input CAD in blue, generated part in orange. ' + sample.prompt);
      card.appendChild(prompt);
      card.appendChild(box);
      grid.appendChild(card);
      return { el: box, sample: sample, viewer: null };
    });

    if (typeof THREE === 'undefined' || !THREE.OrbitControls || !THREE.OBJLoader || !THREE.MTLLoader) {
      containers.forEach(function (c) {
        c.el.innerHTML = '<div class="viewer-status">3D viewer unavailable</div>';
      });
      return;
    }

    function ensureViewer(c) {
      if (c.viewer) return c.viewer;
      try {
        c.viewer = createViewer(c.el, c.sample);
      } catch (e) {
        console.error('3D viewer failed for ' + c.sample.id, e);
        c.el.innerHTML = '<div class="viewer-status">3D viewer unavailable</div>';
        c.viewer = false;
      }
      return c.viewer;
    }

    if (!('IntersectionObserver' in window)) {
      containers.forEach(function (c) { var v = ensureViewer(c); if (v) startViewer(v); });
      return;
    }

    // Create viewers shortly before they scroll into view; only animate while visible.
    var byEl = new Map(containers.map(function (c) { return [c.el, c]; }));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var c = byEl.get(entry.target);
        if (entry.isIntersecting) {
          var v = ensureViewer(c);
          if (v) startViewer(v);
        } else if (c.viewer) {
          stopViewer(c.viewer);
        }
      });
    }, { rootMargin: '200px 0px' });
    containers.forEach(function (c) { io.observe(c.el); });
  }

  // ------------------------------------------------------------------
  // Synchronised, lazily loaded video groups
  // ------------------------------------------------------------------

  // A group of clips (one comparison row, or a single clip) that load when
  // near the viewport, start together, loop in lock-step and pause off-screen.
  function VideoGroup(root, videos) {
    this.root = root;
    this.videos = videos;
    this.loaded = false;
    this.visible = false;
    this.started = false;
    var self = this;
    var leader = videos[0];
    leader.addEventListener('ended', function () {
      self.videos.forEach(function (v) { v.currentTime = 0; });
      if (self.visible) self.play();
    });
    leader.addEventListener('error', function () {
      // If the leader cannot play, let the remaining clips loop on their own.
      self.videos.forEach(function (v) { v.loop = true; });
    }, true);
  }

  VideoGroup.prototype.load = function () {
    if (this.loaded) return;
    this.loaded = true;
    this.videos.forEach(function (v) {
      if (v.dataset.poster) v.poster = v.dataset.poster;
      if (v.dataset.src) {
        v.preload = 'auto';
        v.src = v.dataset.src;
      }
    });
  };

  VideoGroup.prototype.ready = function () {
    var waits = this.videos.map(function (v) {
      if (v.readyState >= 3) return Promise.resolve();
      return new Promise(function (resolve) {
        v.addEventListener('canplay', resolve, { once: true });
        v.addEventListener('error', resolve, { once: true });
      });
    });
    var timeout = new Promise(function (resolve) { setTimeout(resolve, 4000); });
    return Promise.race([Promise.all(waits), timeout]);
  };

  VideoGroup.prototype.play = function () {
    this.videos.forEach(function (v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
  };

  VideoGroup.prototype.pause = function () {
    this.videos.forEach(function (v) { v.pause(); });
  };

  VideoGroup.prototype.enter = function () {
    this.visible = true;
    this.load();
    if (REDUCED_MOTION) return;
    var self = this;
    if (!this.started) {
      this.ready().then(function () {
        if (!self.visible) return;
        self.started = true;
        self.videos.forEach(function (v) { v.currentTime = 0; });
        self.play();
      });
    } else {
      this.play();
    }
  };

  VideoGroup.prototype.leave = function () {
    this.visible = false;
    if (this.started) this.pause();
  };

  var groupObserver = null;
  var groupsByEl = new Map();
  var preloadObserver = null;

  function observeGroup(group) {
    if (!('IntersectionObserver' in window)) {
      group.enter();
      return;
    }
    if (!groupObserver) {
      groupObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var g = groupsByEl.get(entry.target);
          if (!g) return;
          if (entry.isIntersecting) g.enter(); else g.leave();
        });
      }, { threshold: 0.15 });
      // Fetch posters a little ahead of time so tiles are never blank.
      preloadObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var g = groupsByEl.get(entry.target);
          if (g) g.videos.forEach(function (v) { if (v.dataset.poster && !v.poster) v.poster = v.dataset.poster; });
          preloadObserver.unobserve(entry.target);
        });
      }, { rootMargin: '600px 0px' });
    }
    groupsByEl.set(group.root, group);
    groupObserver.observe(group.root);
    preloadObserver.observe(group.root);

    if (REDUCED_MOTION) {
      group.root.addEventListener('click', function () {
        group.load();
        var playing = group.videos.some(function (v) { return !v.paused; });
        if (playing) group.pause(); else group.ready().then(function () { group.play(); });
      });
    }
  }

  function makeClip(name, label) {
    var v = document.createElement('video');
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.preload = 'none';
    v.dataset.src = VIDEO_DIR + name + '.mp4';
    v.dataset.poster = POSTER_DIR + name + '.jpg';
    v.setAttribute('aria-label', label);
    return v;
  }

  // ------------------------------------------------------------------
  // Qualitative comparison galleries
  // ------------------------------------------------------------------

  var GALLERIES = [
    {
      key: 'baselines',
      title: 'vs. baselines',
      desc: 'Test-set comparison with MatchMaker and BrepGen. The condition CAD is shown in blue and the generated part in orange.'
    },
    {
      key: 'ablation',
      title: 'Ablation',
      desc: 'Test-set ablation comparing the full model with variants that drop the geometric guidance or D<sub>sem</sub>.'
    },
    {
      key: 'unseen',
      title: 'Unseen CAD sources',
      desc: 'Cross-set evaluation: testing on CAD models from a source that was not seen during training.'
    },
    {
      key: 'assembly',
      title: 'More results',
      desc: 'Additional test-set results: the ground-truth assembly, the part generated by CADKnitter on its own, and the generated part assembled with the condition.'
    }
  ];
  var INITIAL_ROWS = 3;
  var OURS_KEYS = { ours: true, gen: true, combined: true };

  function stripTags(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent;
  }

  function buildPanel(cfg, data, panel) {
    var cols = data.columns;
    var desc = document.createElement('p');
    desc.className = 'panel-desc';
    desc.innerHTML = cfg.desc;
    panel.appendChild(desc);

    var cmp = document.createElement('div');
    cmp.className = 'cmp';
    cmp.style.setProperty('--cols', cols.length);

    var head = document.createElement('div');
    head.className = 'cmp-head';
    head.setAttribute('aria-hidden', 'true');
    cols.forEach(function (c) {
      var l = document.createElement('div');
      l.className = 'col-label' + (OURS_KEYS[c.key] ? ' is-ours' : '');
      l.innerHTML = c.label;
      head.appendChild(l);
    });
    cmp.appendChild(head);

    var hiddenRows = [];
    data.rows.forEach(function (row, i) {
      var rowEl = document.createElement('div');
      rowEl.className = 'cmp-row';
      if (i >= INITIAL_ROWS) {
        rowEl.hidden = true;
        hiddenRows.push(rowEl);
      }

      var prompt = document.createElement('p');
      prompt.className = 'prompt';
      prompt.textContent = row.prompt;
      rowEl.appendChild(prompt);

      var cells = document.createElement('div');
      cells.className = 'cmp-cells';
      var videos = cols.map(function (c) {
        var fig = document.createElement('figure');
        fig.className = 'tile' + (OURS_KEYS[c.key] ? ' is-ours' : '');
        var v = makeClip(row.cells[c.key], stripTags(c.label) + ': ' + row.prompt);
        var cap = document.createElement('figcaption');
        cap.innerHTML = c.label;
        fig.appendChild(v);
        fig.appendChild(cap);
        cells.appendChild(fig);
        return v;
      });
      rowEl.appendChild(cells);
      cmp.appendChild(rowEl);
      observeGroup(new VideoGroup(rowEl, videos));
    });
    panel.appendChild(cmp);

    if (hiddenRows.length) {
      var more = document.createElement('button');
      more.type = 'button';
      more.className = 'more-btn';
      var expanded = false;
      var setLabel = function () {
        more.innerHTML = expanded
          ? '<i class="fas fa-chevron-up" aria-hidden="true"></i> Show fewer'
          : '<i class="fas fa-chevron-down" aria-hidden="true"></i> Show all ' + data.rows.length + ' examples';
        more.setAttribute('aria-expanded', String(expanded));
      };
      setLabel();
      more.addEventListener('click', function () {
        expanded = !expanded;
        hiddenRows.forEach(function (r) { r.hidden = !expanded; });
        setLabel();
        if (!expanded) cmp.scrollIntoView({ block: 'start' });
      });
      panel.appendChild(more);
    }
  }

  function initGalleries() {
    var data = window.CADKNITTER_RESULTS;
    var tablist = document.getElementById('gallery-tabs');
    var panels = document.getElementById('gallery-panels');
    if (!data || !tablist || !panels) return;

    var tabs = [];
    GALLERIES.forEach(function (cfg, i) {
      var d = data[cfg.key];
      if (!d) return;
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab';
      tab.id = 'tab-' + cfg.key;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'panel-' + cfg.key);
      tab.innerHTML = cfg.title + '<span class="count">' + d.rows.length + '</span>';

      var panel = document.createElement('div');
      panel.id = 'panel-' + cfg.key;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      buildPanel(cfg, d, panel);

      tablist.appendChild(tab);
      panels.appendChild(panel);
      tabs.push({ tab: tab, panel: panel });
    });

    function select(index, focus) {
      tabs.forEach(function (t, i) {
        var on = i === index;
        t.tab.setAttribute('aria-selected', String(on));
        t.tab.tabIndex = on ? 0 : -1;
        t.panel.hidden = !on;
      });
      if (focus) tabs[index].tab.focus();
    }

    tabs.forEach(function (t, i) {
      t.tab.addEventListener('click', function () { select(i, false); });
      t.tab.addEventListener('keydown', function (e) {
        var n = tabs.length;
        var next = null;
        if (e.key === 'ArrowRight') next = (i + 1) % n;
        else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = n - 1;
        if (next !== null) {
          e.preventDefault();
          select(next, true);
        }
      });
    });
    select(0, false);
  }

  // ------------------------------------------------------------------
  // KnitCAD dataset scroller
  // ------------------------------------------------------------------

  function initDataset() {
    var data = window.CADKNITTER_RESULTS && window.CADKNITTER_RESULTS.dataset;
    var root = document.getElementById('dataset-scroller');
    var track = document.getElementById('dataset-track');
    if (!data || !root || !track) return;

    data.forEach(function (s) {
      var fig = document.createElement('figure');
      fig.className = 'sample-card';
      var prompt = document.createElement('p');
      prompt.className = 'prompt';
      prompt.textContent = s.prompt;
      var v = makeClip(s.video, 'KnitCAD sample: ' + s.prompt);
      fig.appendChild(prompt);
      fig.appendChild(v);
      track.appendChild(fig);
      observeGroup(new VideoGroup(fig, [v]));
    });

    var prev = root.querySelector('.prev');
    var next = root.querySelector('.next');
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }
    function step(dir) {
      track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // ------------------------------------------------------------------
  // Stand-alone videos that should only play while visible
  // ------------------------------------------------------------------

  function initAutoplayVideos() {
    var vids = document.querySelectorAll('video.autoplay-visible');
    if (!vids.length || REDUCED_MOTION || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          // Start the first time it is seen; afterwards resume only if we paused it.
          if (!v.dataset.seen || v.dataset.autoPaused === '1') {
            v.dataset.seen = '1';
            v.dataset.autoPaused = '0';
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          }
        } else if (!v.paused) {
          v.dataset.autoPaused = '1';
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { io.observe(v); });
  }

  // ------------------------------------------------------------------
  // Misc
  // ------------------------------------------------------------------

  function initCopyBibtex() {
    var btn = document.getElementById('copy-bibtex');
    var code = document.getElementById('bibtex-code');
    if (!btn || !code) return;
    var label = btn.querySelector('span');
    var icon = btn.querySelector('i');
    btn.addEventListener('click', function () {
      var text = code.textContent;
      var done = function () {
        label.textContent = 'Copied';
        icon.className = 'fas fa-check';
        setTimeout(function () {
          label.textContent = 'Copy';
          icon.className = 'far fa-copy';
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var range = document.createRange();
        range.selectNodeContents(code);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try { document.execCommand('copy'); done(); } catch (e) { /* leave text selected */ }
      }
    });
  }

  function initNav() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var update = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function init() {
    initNav();
    initViewers();
    initGalleries();
    initDataset();
    initAutoplayVideos();
    initCopyBibtex();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
