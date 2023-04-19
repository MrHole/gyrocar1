import './style.css';
import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
/*
import { gim_both } from './gim_both.js';
import { gim_M1 } from './gim_M1.js';
import { gim_M2 } from './gim_M2.js';
import { gim_M0 } from './gim_M0.js';
import { R1_both } from './R1_both.js';
import { R1_M1 } from './R1_M1.js';
import { R1_M2 } from './R1_M2.js';
import { R1_M0 } from './R1_M0.js';
*/


window.addEventListener('load', function() {

  console.log=function(){};

var car;
var PI = Math.PI;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xADD8E6);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(100);
camera.position.setX(100);
camera.position.setY(100);



const controls = new OrbitControls(camera, renderer.domElement);

var params = { 
  N: 0, 
  stop: false, 
  case: 'Both Motors'
};

const gui = new dat.GUI();
gui.add(params, 'N').min(0).max(10).step(1).name('Simulation speed');
gui.add(params, 'stop').name('Stop button');


var caseController = gui.add(params, 'case', ['Both Motors', 'Motor 1', 'Motor 2', 'No Motor']).listen();


var i = 0;
var R1 = R1_both();
var gimbal = gim_both();


/*
gui.add(params, 'case', {case0: 'Both Motors', Case1: 'Motor 1', Case2: 'Motor 2', Case3: 'No Motor'}).onChange(function(value) {
  params.case = value;
});
*/
/*
var R1 = new THREE.Matrix4();
var R1 = R1_both();
var gimbal = gim_both();
var i = 0;
*/


//------------ LOAD THE MODELS -------;-------


var car = new THREE.Object3D();

loadOBJWithMTL('models/', 'cardesign3.obj', 'cardesign3.mtl', object => {
  //object.position.x = -75;
  object.rotation.x =- PI/2;
  car.add(object);
});
car.position.x = -75;
car.position.y = 10;
var gimbal1 = new THREE.Object3D();
loadOBJWithMTL('models/', 'gi11.obj', 'gi11.mtl', object => {
  gimbal1.add(object);
});
gimbal1.position.y = 52;
gimbal1.position.x = 75;
gimbal1.position.z = -45;
gimbal1.rotation.y = PI/2;



var gyro1 = new THREE.Object3D();
loadOBJWithMTL('models/', 'gy222.obj', 'gy222.mtl', object => {
  gyro1.add(object);
});
/*
gyro1.position.y = 45;
gyro1.position.x = 75;
gyro1.position.z = -45;
gyro1.rotation.y = PI/2;
*/


var gimbal2 = new THREE.Object3D();
loadOBJWithMTL('models/', 'gi11.obj', 'gi11.mtl', object => {
  gimbal2.add(object);
});
gimbal2.position.y = 52;
gimbal2.position.x = 75;
gimbal2.position.z = 45;
gimbal2.rotation.y = -PI/2;


var motor1 = new THREE.Object3D();
loadOBJWithMTL('models/', 'motor.obj', 'motor.mtl', object => {
  motor1.add(object);
});
/*
motor1.position.y = 35;
motor1.position.x = 75;
motor1.position.z = 10;
motor1.rotation.y = -PI/2;
*/
var gyro2 = new THREE.Object3D();
loadOBJWithMTL('models/', 'gy222.obj', 'gy222.mtl', object => {
  object.rotation.x = PI;
  gyro2.add(object);
});

gyro1.rotation.x = PI;

scene.add(car);
car.add(gimbal1);
//car.add(motor1);
gimbal1.add(gyro1);
car.add(gimbal2);
gimbal2.add(gyro2);
//------------ LIGHTS --------------
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(-200, 200, 300);

//const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight);//, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(2000, 500, -100);
// Create the geometry of the plane with a width and height of 10 units
var geometry = new THREE.PlaneGeometry(1000, 1000);

// Create a material for the plane using a basic material with a color of white
var material = new THREE.MeshBasicMaterial({ color: 0xfffffff , transparent: true, opacity: 0.8 });

// Create a mesh object with the geometry and material
var plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -PI/2;
// Add the plane to the scene
scene.add(plane);
//scene.add(lightHelper, gridHelper);


var R1_M = new THREE.Matrix4();
var transform = new THREE.Matrix4();
var transformrev = new THREE.Matrix4();
var R = new THREE.Matrix4();
var R_transform = new THREE.Matrix4();

transform.set(
  1, 0, 0, 0,
  0, 0, 1, 0,
  0, -1, 0, 0,
  0, 0, 0, 1  
);

transformrev.set(
  1, 0, 0, 0,
  0, 0, -1, 0,
  0, 1, 0, 0,
  0, 0, 0, 1  
);



function animate() {

    requestAnimationFrame(animate);


    R1_M.set(
      R1[i][0], R1[i][1], R1[i][2], 0,
      R1[i][3], R1[i][4], R1[i][5], 0,
      R1[i][6], R1[i][7], R1[i][8], 0,
      0, 0, 0, 1);

    R_transform.multiplyMatrices(transform, R1_M);
    R.multiplyMatrices(R_transform, transformrev);

    car.rotation.setFromRotationMatrix(R);
    


    gimbal1.rotation.x = gimbal[i][0];
    gimbal2.rotation.x = gimbal[i][1];
    

    //gyro1.rotation.y += 1;
    //gyro2.rotation.y += -1;
    motor1.rotation.x += -0.01;
    controls.update();
    renderer.render(scene, camera);


    if(params.stop) {
      params.N = false;
      i = 0;
    }

    i += params.N;
    if( i>(length(gimbal)-200) ) {
      i = 0;
    }
}

caseController.onChange(function(newValue) {
  // Update the values of R1 and gimbal based on the new value of 'case'
  i = 0;
  if (newValue == 'Both Motors') {
    R1 = R1_both();
    gimbal = gim_both();
  } else if (newValue == 'Motor 1') {
    R1 = R1_M1();
    gimbal = gim_M1();
  } else if (newValue == 'Motor 2') {
    R1 = R1_M2();
    gimbal = gim_M2();
  } else if (newValue == 'No Motor') {
    R1 = R1_M0();
    gimbal = gim_M0();
  }
});

animate();







function loadOBJWithMTL(path, objFile, mtlFile, onLoad) {
  const mtlLoader = new MTLLoader();
  mtlLoader.setPath(path);
  mtlLoader.load(mtlFile, materials => {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(path);
    objLoader.load(objFile, object => {
      onLoad(object);
    });
  });
}

});


function onWindowResize() {
  renderer.setSize(window.width, window.height);
  camera.aspect = window.width / window.height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onWindowResize);