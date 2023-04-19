
window.addEventListener('load', function(){

	console.log=function(){};
		
		// ********** Setting parameters **********
		const PI = Math.PI;
		const SCALE = 27;
		
		
		// ********** Creating the scene: **********
		var renderer = new THREE.WebGLRenderer({ antialias: true }); //Creates a WebGL renderer to the "renderer" variable
		renderer.setPixelRatio( window.devicePixelRatio ); //Prevents blurry output
		renderer.setSize( window.innerWidth,window.innerHeight ); //Sets renderer size to the size of the window
		renderer.setClearColor( 0xf2f2f2, 1); //Makes the background color of the scene white
		container = document.getElementById("myCanvas");
		container.appendChild( renderer.domElement );
		
		var scene = new THREE.Scene(); //Creates an empty scene where we are going to add our objects
	
		
		//******** camera ********
		var camera = new THREE.PerspectiveCamera( 45,window.innerWidth/window.innerHeight,0.1,20000 ); //Creates a camera (these values have been set at the beginning)
		camera.position.set( 500 , 100 , 200 ); //Positions the camera in front of the car
		camera.up.set( 0,0,1 ); //Rotates the camera 
		scene.add( camera ); //Adds the camera to the scene

		/*const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
		camera.position.set(500, 100, 200);
		camera.up.set(0, 0, 1);
		scene.add( camera );*/

		//******* Orbitcontrols *******
	
		var controls = new THREE.OrbitControls( camera, renderer.domElement ); //OrbitControls allows camera to be controlled and orbit around a target
		controls.minDistance = 1/SCALE; //Sets the minimum distance one can pan into the scene
		controls.maxDistance = 10000;  //Sets the maximum distance one can pan away from scene
		controls.addEventListener( 'change', render );
		controls.minPolarAngle = 0;
		controls.maxPolarAngle =  Math.PI * 0.45;
		
		//shadow, trying to at least
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		
		// ********** Adding light **********
			var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
			scene.add(ambientLight); //Adding ambient light
			
			const light = new THREE.AmbientLight( 0x404040 ); // soft white light
			scene.add( light );
			/*var light11 = new THREE.DirectionalLight( 0xffffbb, 1 );
			light11.position.set( 1, 0, 0 );
			light11.castShadow = true;
			scene.add( light11 ); //Adding directional light 
			*/
		//Sun light
		
		var light1 = new THREE.DirectionalLight( 0xffffbb, 0.3 );
			light1.position.set( -1, 0, 1.5 );
			light1.castShadow = true;
			scene.add( light1 ); //Adding directional light 
		light1.shadow.mapSize.width = 2500; // default
		light1.shadow.mapSize.height = 2500; // default
		light1.shadow.camera.near = 1; // default
		light1.shadow.camera.far = 500; // default
		
	
	
	
	
		// ********** Loading the models **********
		function spawnObject(mtlFile,objFile){
			var myObject = new THREE.Object3D(); //Creates a new threejs 3D-object
			var mtlLoader = new THREE.MTLLoader(); //Creates an mtlLoader (to apply texture to 3d objects)
			mtlLoader.setCrossOrigin(true);
			mtlLoader.load( mtlFile, function( materials ) //Prepare to set color
			{
			  materials.preload();
			  var objLoader = new THREE.OBJLoader(); //Creates an object loader (to load 3d objects)
			  objLoader.setMaterials( materials );
			  objLoader.load( objFile, function ( object )
			  {
				myObject.add( object );
			  });
			});
			return myObject;
		}
		
		// ******* Positioning *********
		var skipCOF = new THREE.Object3D(); 
		scene.add(skipCOF);
		
		//var scaleSize=0.003;
		var skip = spawnObject("models/cardesign.mtl","models/cardesign.obj");
		//skip.scale.set(scaleSize*1.1,scaleSize*2,scaleSize*1.1);
		skip.rotation.x=PI/2;
		skip.rotation.y=PI/2;
		skip.position.set(0,0,-20);
		skip.castShadow = true; //default is false
		skip.receiveShadow = false; //default
		skipCOF.add(skip);
		
		var ramme = spawnObject("models/gi1.mtl","models/gi1.obj");
		ramme.rotation.set(0,-PI/2,PI/2);
		ramme.position.set(75,46,-5);
		ramme.rotation.x += .01;
		ramme.castShadow = true; //default is false
		ramme.receiveShadow = false; //default
		skip.add(ramme);
	
		var ramme1 = spawnObject("models/gy2.mtl","models/gy2.obj");
		ramme1.rotation.set(PI,-PI,PI/2);
		ramme1.position.set(0,0,0);
		ramme1.castShadow = true; //default is false
		ramme1.receiveShadow = false; //default
		ramme.add(ramme1);
	
		var ramme2 = spawnObject("models/gi1.mtl","models/gi1.obj");
		ramme2.rotation.set(0,-PI/2,PI/2);
		ramme2.position.set(75,46,-95);
		ramme2.castShadow = true; //default is false
		ramme2.receiveShadow = false; //default
		skip.add(ramme2);
		
		var ramme3 = spawnObject("models/gy2.mtl","models/gy2.obj");
		ramme3.rotation.set(PI,-PI,PI/2);
		ramme3.position.set(0,0,0);
		ramme3.castShadow = true; //default is false
		ramme3.receiveShadow = false; //default
		ramme2.add(ramme3);
	
		var ramme4 = spawnObject("models/motor1.mtl","models/motor1.obj");
		ramme4.rotation.set(PI,-PI,PI);
		ramme4.position.set(25,-10,60);
		ramme4.castShadow = true; //default is false
		ramme4.receiveShadow = false; //default
		ramme3.add(ramme4);
		
		//********* GUI controls *******
		/*
		const gui = new dat.GUI()
		const cubeFolder = gui.addFolder('ramme')
		//cubeFolder.add(ramme.rotation, ramme3.rotation, 'x', 0, Math.PI * 2)
		//cubeFolder.add(ramme.rotation, ramme3.rotation, 'y', 0, Math.PI * 2)
		cubeFolder.add(ramme.rotation, 'z', 0, Math.PI * 2)
	
		cubeFolder.open()
		const cameraFolder = gui.addFolder('Camera')
		cameraFolder.add(camera.position, 'z', 0, 100)
		cameraFolder.open()
			*/
		
		
		//******* sky *******
		let sky, sun;
	
		sky = new THREE.Sky();
		sky.scale.setScalar( 5000 );
		sky.rotation.set(0, 0, 0);
		scene.add( sky );
		console.log(sky.material.uniform);
		sun = new THREE.Vector3(-1, 0, 0);
		sky.material.uniforms.up.value.set( 0, 0, 1 );
		sky.material.uniforms.sunPosition.value.copy( sun );
		
		
	
		// plane
		
		const texture = new THREE.TextureLoader().load('models/Sand_007_baseColor.jpg');
		const ambientO = new THREE.TextureLoader().load('models/Sand_007_ambientOcclusion.jpg');
		const height1 = new THREE.TextureLoader().load('models/Sand_007_height.png');
		const normal = new THREE.TextureLoader().load('models/Sand_007_normal.jpg');
		const roughness = new THREE.TextureLoader().load('models/Sand_007_roughness.jpg');
		
	
		var geometry = new THREE.PlaneGeometry( 5000, 5000, 512, 512 ); //ThreeJS function to create plane geometry
		/*
		var oceanmat = new THREE.MeshLambertMaterial( { //Sets color and material attributes for Waves
			//color: 0x000000,
			//opacity: 0.5,
			//transparent: true,
			//bumpMap: heightplane,
			//bumpScale: 1.5,
			//wireframe: true,
			side: THREE.DoubleSide,
			//displacementMap: heightplane,
			//displacementScale: 0.1,
			map: texture
			//bumpMap: heightplane,
			
			   
		} );*/
		
	var oceanmat = new THREE.MeshStandardMaterial({
		/*map: texture,
		normalMap: normal,
		displacementMap: height1,
		roughnessMap: roughness,
		roughness: 0.5
		*/
		color: 0xDAD5CF,
		wireframe: true
	});

	var ocean = new THREE.Mesh( geometry, oceanmat ); //Creates a mesh containing of the geometry and oceanmaterial just added
		ocean.receiveShadow = true;
		ocean.position.set(0, 0, -30);
		scene.add( ocean ); //Adds ocean to scene
	
	
	


		 
		
	
			
	
		var render = function () {
			requestAnimationFrame(render); //render function is called every frame
			renderer.render(scene, camera); //We need this in the loop to actually perform the rendering
			
		};
	
		render(); //Calls the render function
	
		
	});