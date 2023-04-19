
			var container, stats;
			var camera, scene, renderer;
			var controls, water, sun, mesh;

			init();
			animate();

			function init() {

				container = document.getElementById( 'three-container' );

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				//

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
				camera.position.set( 30, 30, 100 );

				//

				sun = new THREE.Vector3();

				// Water

				var plane = new THREE.PlaneBufferGeometry( 10000, 10000 );
                var oceanmat = new THREE.MeshStandardMaterial({
                 
                    
                    wireframe: true
                });
            
                var ocean = new THREE.Mesh( plane, oceanmat ); //Creates a mesh containing of the geometry and oceanmaterial just added
                    
                    
                    scene.add( ocean ); //Adds ocean to scene
				

				

				// Skybox

				var sky = new THREE.Sky();
				sky.scale.setScalar( 10000 );
				scene.add( sky );

				var uniforms = sky.material.uniforms;

				uniforms[ 'turbidity' ].value = 1;
				uniforms[ 'rayleigh' ].value = 2;
				uniforms[ 'mieCoefficient' ].value = 0.005;
				uniforms[ 'mieDirectionalG' ].value = 0.8;

				var parameters = {
					inclination: 0.49,
					azimuth: 0.205
				};


				function updateSun() {

					var theta = Math.PI * ( parameters.inclination - 0.5 );
					var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

					sun.x = Math.cos( phi );
					sun.y = Math.sin( phi ) * Math.sin( theta );
					sun.z = Math.sin( phi ) * Math.cos( theta );

					sky.material.uniforms[ 'sunPosition' ].value.copy( sun );


				}

				updateSun();

				//

				var geometry = new THREE.BoxBufferGeometry( 30, 30, 30 );

				var material = new THREE.MeshStandardMaterial( { roughness: 0 } );
    
				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

				//
                var controls = new THREE.OrbitControls( camera, renderer.domElement ); //OrbitControls allows camera to be controlled and orbit around a target
                controls.minDistance = 1/27; //Sets the minimum distance one can pan into the scene
                controls.maxDistance = 10000;  //Sets the maximum distance one can pan away from scene
                controls.addEventListener( 'change', render );
                controls.minPolarAngle = 0;
                controls.maxPolarAngle =  Math.PI * 0.45;

				//

				
				// GUI

			
				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				var time = performance.now() * 0.001;

				mesh.position.y = Math.sin( time ) * 20 + 5;
				mesh.rotation.x = time * 0.5;
				mesh.rotation.z = time * 0.51;


				renderer.render( scene, camera );

			}