let endtime;
let annotationCount;
let animationCount;
let annotate = false;

// Play animation in forward & reverse
const play = (api, speed) => {
  api.setSpeed(speed, (err) => {
    if(speed === -1){
      api.seekTo(endtime);
    }
    else{
      api.seekTo(0);
    }
    api.setCycleMode('one');
    api.play();
  });
};

const seek = (api, time) => {
  api.pause(() => {
    api.seekTo(time);
  });
};

// Set animation cycle mode
const setCycle = (api, cycle) => {
  api.setCycleMode(cycle, (err) => {
    console.log(err);
  });
};

// Toggle annotations
const setAnnotation = (api)=>{
  annotate = !annotate;
  if (annotate){
    for (let i=0; i<annotationCount; i++){
      api.showAnnotation(i);     
    }
  } else {
    for (let i=0; i<annotationCount; i++){
      api.hideAnnotation(i);
    }
  }
};

// Set animation
const setFirstAnimation = (api) => {
    api.getAnimations((err, animations) => {
      // An animation is described by an array. The array contains an
      // ID and a length among others
      //console.log(animations);
      animationCount = animations.length;
      if (animations.length > 0) {
        endtime = animations[0][2];
        api.setCurrentAnimationByUID(animations[0][0], (err) => {
          seek(api, 0);
        });
      }
    });
  };

  // Get annotations count
  const getAnnotationCount = (api) => {
    api.getAnnotationList((err, annotations) => {
      if (!err){
        annotationCount = annotations.length;
        //console.log(`Annotations list ${annotationCount}`);
      }
      // Hide annotations by default
      for (let i=0; i<annotationCount; i++){
        api.hideAnnotation(i);
      }

    });
  };

// This function will be called on successful initialization of sketchfab
const success = (api) => {
    // api.start will start loading the 3D model
    api.start(() => {
      api.addEventListener("viewerready", () => {
        setFirstAnimation(api);
        getAnnotationCount(api);

        // Avoid the camera movement when clicking an annotation
        api.setAnnotationCameraTransition(false, true);
                       
        document
          .getElementById("play")
          .addEventListener("click", () => play(api, 1));
        document
          .getElementById("reverse")
          .addEventListener("click", () => play(api, -1));       
        document
          .getElementById("annotation")
          .addEventListener("click", () => setAnnotation(api));
                        
      });
    });
  };

  const loadSketchfab = (sceneUId, elementId) => {
    // To get started with Sketchfab, we need to create a client
    // object for a certain iframe in the DOM
    const iframe = document.getElementById(elementId);
    const client = new Sketchfab("1.12.1", iframe);
  
    // Initialize sketchfab client with a specific model and player parameters
    client.init(sceneUId, {
      success: success,
      error: () => console.error("Sketchfab API error"),
      ui_stop: 0,
      preload: 1,
      ui_annotations: 0,
      camera: 0,
      merge_materials: 1,   // Merge identical materials
      material_packing: 1,
      graph_optimizer: 1    // Enable graphics optimization
    });
  };
  
  loadSketchfab("09da3e21b0904f81b7a56a5eb492ad89", "api-frame");
  