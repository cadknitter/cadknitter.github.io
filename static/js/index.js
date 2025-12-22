window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

// ============================================
// Sample Showcase - 3D Viewer with Three.js
// ============================================

// Sample data configuration
var SAMPLES = [
  {
    id: 'sample_01',
    prompt: 'Make a solid piece shaped like a hexagon [...], with flat parallel ends and six flat sides, and add a smooth, round hole straight through the center so it can slide onto the round shaft of the given object.',
    conditionPath: './output/sample_01_cond/',
    conditionObj: 'sample_01_cond.obj',
    conditionMtl: 'sample_01_cond.mtl',
    outputPath: './output/sample_01_output/',
    outputObj: 'sample_01_output.obj',
    outputMtl: 'sample_01_output.mtl'
  },
  {
    id: 'sample_02',
    prompt: 'Create a thick, smooth circular ring with a hole in the middle, sized so it can easily slide over the long, straight shaft of the given object and rest flat against the wide circular flange at the base.',
    conditionPath: './output/sample_02_cond/',
    conditionObj: 'sample_02_cond.obj',
    conditionMtl: 'sample_02_cond.mtl',
    outputPath: './output/sample_02_output/',
    outputObj: 'sample_02_output.obj',
    outputMtl: 'sample_02_output.mtl'
  },
  {
    id: 'sample_03',
    prompt: 'Make a long, straight bar with a rectangular shape and flat ends so that it can slide fully into the lengthwise notch along the side of the given block, fitting snugly within the cutout space.',
    conditionPath: './output/sample_03_cond/',
    conditionObj: 'sample_03_cond.obj',
    conditionMtl: 'sample_03_cond.mtl',
    outputPath: './output/sample_03_output/',
    outputObj: 'sample_03_output.obj',
    outputMtl: 'sample_03_output.mtl'
  },
  {
    id: 'sample_04',
    prompt: 'Make a piece with a long round stick that has a six-sided short block connected to one end, so that the round stick can fit closely through the hole in the center of the ring-shaped disk [...]',
    conditionPath: './output/sample_04_cond/',
    conditionObj: 'sample_04_cond.obj',
    conditionMtl: 'sample_04_cond.mtl',
    outputPath: './output/sample_04_output/',
    outputObj: 'sample_04_output.obj',
    outputMtl: 'sample_04_output.mtl'
  },
  {
    id: 'sample_05',
    prompt: 'Make a block that is shaped like a rectangle with straight sides, and add three holes going all the way through one of its big flat faces [...] so the big hole can fit the straight round stick of the given object.',
    conditionPath: './output/sample_05_cond/',
    conditionObj: 'sample_05_cond.obj',
    conditionMtl: 'sample_05_cond.mtl',
    outputPath: './output/sample_05_output/',
    outputObj: 'sample_05_output.obj',
    outputMtl: 'sample_05_output.mtl'
  },
  {
    id: 'sample_06',
    prompt: 'Create a flat rectangular block with two round holes going all the way through one of the larger flat faces, so this face can line up and attach to the flat, featureless face of the given solid block.',
    conditionPath: './output/sample_06_cond/',
    conditionObj: 'sample_06_cond.obj',
    conditionMtl: 'sample_06_cond.mtl',
    outputPath: './output/sample_06_output/',
    outputObj: 'sample_06_output.obj',
    outputMtl: 'sample_06_output.mtl'
  },
];

// Store viewer instances
var sampleViewers = [];
var currentSlideIndex = 0;
var visibleSlides = 4;

// Initialize a single 3D viewer
function initSampleViewer(container, sample) {
  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    console.error('THREE.js is not loaded!');
    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;">Three.js not loaded</div>';
    return null;
  }
  
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);
  
  var width = container.clientWidth || 300;
  var height = container.clientHeight || 250;
  
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);
  
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // Add lights
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);
  
  var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
  directionalLight2.position.set(-5, -5, -5);
  scene.add(directionalLight2);
  
  // Add OrbitControls
  var controls;
  if (THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
  } else {
    console.warn('OrbitControls not loaded');
    controls = { update: function() {}, enableDamping: false };
  }
  
  // Add a placeholder cube while loading
  var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  var material = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc, 
    wireframe: true,
    opacity: 0.5,
    transparent: true
  });
  var placeholderCube = new THREE.Mesh(geometry, material);
  placeholderCube.name = 'placeholder';
  scene.add(placeholderCube);
  
  // Create a group to hold both objects (so they can be scaled together)
  var modelGroup = new THREE.Group();
  modelGroup.name = 'modelGroup';
  scene.add(modelGroup);
  
  var viewer = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    controls: controls,
    container: container,
    animationId: null,
    isActive: false,
    modelGroup: modelGroup,
    modelsToLoad: 2,
    modelsLoaded: 0
  };
  
  // Load OBJ/MTL models into the group
  loadModel(viewer, sample.conditionPath, sample.conditionMtl, sample.conditionObj, 0x4a90d9);
  loadModel(viewer, sample.outputPath, sample.outputMtl, sample.outputObj, 0xf5a623);
  
  return viewer;
}

// Remove placeholder cube when a model loads
function removePlaceholder(viewer) {
  var placeholder = viewer.scene.getObjectByName('placeholder');
  if (placeholder) {
    viewer.scene.remove(placeholder);
  }
}

// Load OBJ model with MTL material
function loadModel(viewer, basePath, mtlFile, objFile, fallbackColor) {
  // Check if loaders are available
  if (!THREE.MTLLoader || !THREE.OBJLoader) {
    console.error('MTLLoader or OBJLoader not available!');
    return;
  }
  
  // URL encode the filenames (they contain spaces)
  var encodedMtl = encodeURIComponent(mtlFile);
  var encodedObj = encodeURIComponent(objFile);
  var fullMtlPath = basePath + encodedMtl;
  var fullObjPath = basePath + encodedObj;
  
  console.log('Loading MTL:', fullMtlPath);
  console.log('Loading OBJ:', fullObjPath);
  
  var mtlLoader = new THREE.MTLLoader();
  
  mtlLoader.load(fullMtlPath, function(materials) {
    materials.preload();
    
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    
    objLoader.load(fullObjPath, function(object) {
      addObjectToScene(viewer, object, objFile);
    }, undefined, function(error) {
      console.warn('Error loading OBJ with materials:', objFile, error);
      // Load OBJ without materials as fallback
      loadObjWithoutMaterial(viewer, fullObjPath, fallbackColor);
    });
  }, undefined, function(error) {
    console.warn('Error loading MTL:', mtlFile, error);
    // Load OBJ without materials as fallback
    loadObjWithoutMaterial(viewer, fullObjPath, fallbackColor);
  });
}

// Add object to the model group (without individual scaling)
function addObjectToScene(viewer, object, name) {
  // Remove placeholder on first model load
  if (viewer.modelsLoaded === 0) {
    removePlaceholder(viewer);
  }
  
  // Add object to the group (NOT directly to scene)
  viewer.modelGroup.add(object);
  viewer.modelsLoaded++;
  console.log('Successfully loaded:', name, '(' + viewer.modelsLoaded + '/' + viewer.modelsToLoad + ')');
  
  // Once all models are loaded, center and scale the entire group
  if (viewer.modelsLoaded >= viewer.modelsToLoad) {
    centerAndScaleGroup(viewer);
  }
}

// Center and scale the entire model group after all objects are loaded
function centerAndScaleGroup(viewer) {
  var group = viewer.modelGroup;
  
  // Calculate combined bounding box
  var box = new THREE.Box3().setFromObject(group);
  var center = box.getCenter(new THREE.Vector3());
  var size = box.getSize(new THREE.Vector3());
  
  // Center the group
  group.position.sub(center);
  
  // Scale to fit viewport (target size ~1.5 units)
  var maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0) {
    var scale = 1.5 / maxDim;
    group.scale.setScalar(scale);
  }
  
  console.log('Group centered and scaled. Combined size:', size, 'Scale factor:', scale);
}

// Fallback: load OBJ without materials
function loadObjWithoutMaterial(viewer, fullObjPath, fallbackColor) {
  var objLoader = new THREE.OBJLoader();
  
  objLoader.load(fullObjPath, function(object) {
    // Apply colored material
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: fallbackColor || 0x888888,
          metalness: 0.3,
          roughness: 0.7
        });
      }
    });
    
    addObjectToScene(viewer, object, fullObjPath);
  }, function(xhr) {
    // Progress callback
    if (xhr.total > 0) {
      var percent = (xhr.loaded / xhr.total * 100).toFixed(0);
      console.log('Loading ' + fullObjPath + ': ' + percent + '%');
    }
  }, function(error) {
    console.error('Failed to load OBJ:', fullObjPath, error);
    console.error('Make sure you are running a local web server (e.g., python3 -m http.server 8080)');
  });
}

// Animation loop for a viewer
function animateViewer(viewer) {
  if (!viewer.isActive) return;
  
  viewer.animationId = requestAnimationFrame(function() {
    animateViewer(viewer);
  });
  
  viewer.controls.update();
  viewer.renderer.render(viewer.scene, viewer.camera);
}

// Start viewer animation
function startViewer(viewer) {
  if (!viewer.isActive) {
    viewer.isActive = true;
    animateViewer(viewer);
  }
}

// Stop viewer animation
function stopViewer(viewer) {
  viewer.isActive = false;
  if (viewer.animationId) {
    cancelAnimationFrame(viewer.animationId);
    viewer.animationId = null;
  }
}

// Handle window resize for viewers
function resizeViewers() {
  sampleViewers.forEach(function(viewer) {
    var width = viewer.container.clientWidth;
    var height = viewer.container.clientHeight;
    
    viewer.camera.aspect = width / height;
    viewer.camera.updateProjectionMatrix();
    viewer.renderer.setSize(width, height);
  });
}

// Fixed item width in pixels
var ITEM_WIDTH = 320;

// Get number of visible slides - fixed at 3 for desktop
function getVisibleSlides() {
  var width = window.innerWidth;
  if (width < 768) return 1;
  if (width < 1024) return 2;
  return 3;
}

// Create sample carousel items
function createSampleCarousel() {
  var carousel = document.getElementById('sample-carousel');
  if (!carousel) return;
  
  carousel.innerHTML = '';
  
  SAMPLES.forEach(function(sample, index) {
    var item = document.createElement('div');
    item.className = 'sample-item';
    item.setAttribute('data-index', index);
    
    var promptDiv = document.createElement('div');
    promptDiv.className = 'sample-prompt';
    promptDiv.textContent = sample.prompt;
    
    var viewerDiv = document.createElement('div');
    viewerDiv.className = 'sample-viewer';
    viewerDiv.id = 'viewer-' + sample.id;
    
    item.appendChild(promptDiv);
    item.appendChild(viewerDiv);
    carousel.appendChild(item);
  });
  
  // Initialize all viewers
  SAMPLES.forEach(function(sample, index) {
    var viewerContainer = document.getElementById('viewer-' + sample.id);
    if (viewerContainer) {
      var viewer = initSampleViewer(viewerContainer, sample);
      sampleViewers.push(viewer);
      startViewer(viewer);
    }
  });
  
  updateCarouselPosition();
}

// Update carousel position
function updateCarouselPosition() {
  visibleSlides = getVisibleSlides();
  var carousel = document.getElementById('sample-carousel');
  var wrapper = document.querySelector('.sample-carousel-wrapper');
  if (!carousel || !wrapper) return;
  
  var maxIndex = Math.max(0, SAMPLES.length - visibleSlides);
  if (currentSlideIndex > maxIndex) {
    currentSlideIndex = maxIndex;
  }
  
  // Check if all items fit (no scrolling needed)
  var allItemsFit = SAMPLES.length <= visibleSlides;
  
  if (allItemsFit) {
    // Center wrapper when all items fit
    wrapper.classList.add('centered');
    carousel.style.transform = 'none';
  } else {
    // Align left and use pixel-based transform for scrolling
    wrapper.classList.remove('centered');
    var offset = -currentSlideIndex * ITEM_WIDTH;
    carousel.style.transform = 'translateX(' + offset + 'px)';
  }
  
  // Update navigation buttons visibility
  var prevBtn = document.getElementById('sample-prev');
  var nextBtn = document.getElementById('sample-next');
  
  if (prevBtn) {
    prevBtn.style.opacity = (currentSlideIndex === 0 || allItemsFit) ? '0.3' : '1';
    prevBtn.style.pointerEvents = (currentSlideIndex === 0 || allItemsFit) ? 'none' : 'auto';
  }
  if (nextBtn) {
    nextBtn.style.opacity = (currentSlideIndex >= maxIndex || allItemsFit) ? '0.3' : '1';
    nextBtn.style.pointerEvents = (currentSlideIndex >= maxIndex || allItemsFit) ? 'none' : 'auto';
  }
  
  // Update slide indicator
  updateSlideIndicator();
}

// Update slide indicator dots
function updateSlideIndicator() {
  var indicator = document.getElementById('slide-indicator');
  if (!indicator) return;
  
  var totalSlides = Math.max(1, SAMPLES.length - visibleSlides + 1);
  indicator.innerHTML = '';
  
  for (var i = 0; i < totalSlides; i++) {
    var dot = document.createElement('span');
    dot.className = 'slide-dot' + (i === currentSlideIndex ? ' active' : '');
    dot.setAttribute('data-index', i);
    dot.addEventListener('click', function() {
      currentSlideIndex = parseInt(this.getAttribute('data-index'));
      updateCarouselPosition();
    });
    indicator.appendChild(dot);
  }
}

// Navigate carousel
function navigateCarousel(direction) {
  var maxIndex = Math.max(0, SAMPLES.length - visibleSlides);
  
  if (direction === 'prev') {
    currentSlideIndex = Math.max(0, currentSlideIndex - 1);
  } else {
    currentSlideIndex = Math.min(maxIndex, currentSlideIndex + 1);
  }
  
  updateCarouselPosition();
}

// Initialize sample showcase
function initSampleShowcase() {
  // Check if running from file:// protocol
  if (window.location.protocol === 'file:') {
    console.warn('Running from file:// protocol. 3D models will not load due to CORS restrictions.');
    console.warn('Please run a local server: python3 -m http.server 8080');
    
    var carousel = document.getElementById('sample-carousel');
    if (carousel) {
      var warning = document.createElement('div');
      warning.className = 'server-warning';
      warning.innerHTML = '<p><strong>Note:</strong> 3D models require a local server to load.</p><p>Run: <code>python3 -m http.server 8080</code></p><p>Then open: <a href="http://localhost:8080">http://localhost:8080</a></p>';
      carousel.parentNode.insertBefore(warning, carousel);
    }
  }
  
  createSampleCarousel();
  
  // Setup navigation buttons
  var prevBtn = document.getElementById('sample-prev');
  var nextBtn = document.getElementById('sample-next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      navigateCarousel('prev');
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      navigateCarousel('next');
    });
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    updateCarouselPosition();
    resizeViewers();
  });
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Initialize Sample Showcase with 3D viewers
    initSampleShowcase();

})
