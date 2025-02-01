import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera Setting 
camera.position.set(0,10,15)
camera.lookAt(0,0,0)

//renderer 
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop(animate);
document.body.appendChild( renderer.domElement );

//orbit control
const control = new OrbitControls(camera,renderer.domElement);
control.enableDamping = true;
control.update()


//background
scene.background = new THREE.Color(0xffffff)

//light
const directionalLight1 = new THREE.DirectionalLight(0xffffff,3)
scene.add(directionalLight1)
directionalLight1.position.set(0,10,-5);

const directionalLight2 = new THREE.DirectionalLight(0xffffff,3)
scene.add(directionalLight2)
directionalLight2.position.set(3,5,5);


//window resize
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth , window.innerHeight)
})

//ground
const groundGeometry = new THREE.PlaneGeometry(50,50);
const groundmaterial = new THREE.MeshStandardMaterial({color:0xfffff,roughness:0.5})
const PlainGround = new THREE.Mesh(groundGeometry,groundmaterial)
PlainGround.rotation.x = -Math.PI/2
scene.add(PlainGround)


//Physics world 
const physicsWorld = new CANNON.World({gravity : new CANNON.Vec3(0,-9.82,0)});


//debugger
const canDebug  = new CannonDebugger(scene,physicsWorld,{
  color : 0xff0000,
})


//physics body 
const ground = new CANNON.Body({
  type : CANNON.Body.STATIC,
  shape : new CANNON.Plane()
})

ground.quaternion.setFromEuler(-Math.PI/2,0,0);
physicsWorld.addBody(ground)
const box = new CANNON.Body({
   mass : 2,
   shape : new CANNON.Box(new CANNON.Vec3(1,1,1)),
  
})
box.position.set(7,4,4)
physicsWorld.addBody(box)

//Car

   //car body 
const carBody = new CANNON.Body({
   mass: 1,
   position: new CANNON.Vec3(0,4,0),
   shape : new CANNON.Box(new CANNON.Vec3(4,0.5,2))
})

const vehicle = new CANNON.RigidVehicle({
  chassisBody: carBody,
});
vehicle.addToWorld(physicsWorld);

 //WHEEL 

  //wheel body
  const mass = 1;
  const axisWidth = 5;
  const wheelShape = new CANNON.Cylinder(1,1,1,32);
  const wheelMaterial = new CANNON.Material('wheel');
  // const down = new CANNON.Vec3(0,-1,0)


 const shapeQuaternion = new CANNON.Quaternion();
shapeQuaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);


//Wheel function
function createWheel(pos){
    const wheelBody = new CANNON.Body({ mass,material: wheelMaterial,})
    wheelBody.addShape(wheelShape, new CANNON.Vec3(),shapeQuaternion);
    // wheelBody.angularDamping = 0.4;
    vehicle.addWheel({
      body : wheelBody,
      position : pos,
      axis : new CANNON.Vec3(0,0,1),
     
    })
  
   return wheelBody;
}

const wheelBody1 = createWheel(new CANNON.Vec3(-2,-0.5,-axisWidth/2))
const wheelBody2 = createWheel(new CANNON.Vec3(-2,-0.5,axisWidth/2))
const wheelBody3 = createWheel(new CANNON.Vec3(2,-0.5,axisWidth/2))
const wheelBody4 = createWheel(new CANNON.Vec3(2,-0.5,-axisWidth/2))

 vehicle.addToWorld(physicsWorld);

//CONTROLS 

document.addEventListener('keydown',(event)=>{
   const maxSteer = Math.PI/6;
   const maxForce = 20;


   switch (event.key){
    case 'w':
    case 'ArrowUp':
       vehicle.setWheelForce(maxForce, 0);
       vehicle.setWheelForce(maxForce,1);
       break;
    
   case 's':
   case 'ArrowDown':
       vehicle.setWheelForce(-maxForce, 0);
       vehicle.setWheelForce(-maxForce,1);
       break

    case 'a':
    case 'ArrowLeft':
       vehicle.setSteeringValue(maxSteer, 0);
       vehicle.setSteeringValue(maxSteer,1);
       break;
    
   case 'd':
   case 'ArrowRight':
      vehicle.setSteeringValue(-maxSteer, 0);
      vehicle.setSteeringValue(-maxSteer,1);
      break   
   
   }
})


document.addEventListener('keyup',(event)=>{

  switch (event.key){
   case 'w':
   case 'ArrowUp':
      vehicle.setWheelForce(0, 0);
      vehicle.setWheelForce(0,1);
      break;
   
  case 's':
  case 'ArrowDown':
      vehicle.setWheelForce(0, 0);
      vehicle.setWheelForce(0,1);
      break

   case 'a':
   case 'ArrowLeft':
      vehicle.setSteeringValue(0, 0);
      vehicle.setSteeringValue(0,1);
      break;
   
  case 'd':
  case 'ArrowRight':
     vehicle.setSteeringValue(0, 0);
     vehicle.setSteeringValue(0,1);
     break   
  
  }
})


// Model Imports 
const loader = new GLTFLoader()


let modelCar;
loader.load('add car 3d model path here..', (gltf)=>{
  const model = gltf.scene;
  modelCar = model.children[0];
    
  modelCar.scale.set(1.5,1.5,1.5); 
    
   scene.add(modelCar);
  
})
let Wheelmodel1;
let Wheelmodel2;
let Wheelmodel3;
let Wheelmodel4;
let wheelModels = [];


const rotationFix = new THREE.Quaternion();
rotationFix.setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));


  loader.load('add wheel 3d model path here..', (gltf)=>{
      const wheel = gltf.scene.children[0];
      console.log(wheel.children[0])
     
      scene.add(wheel)
      Wheelmodel1 = wheel.clone(true);
      Wheelmodel2 = wheel.clone(true);
      Wheelmodel3 = wheel.clone(true);
      Wheelmodel4 = wheel.clone(true);
   
      scene.add(Wheelmodel1);
      scene.add(Wheelmodel2);
      scene.add(Wheelmodel3);
      scene.add(Wheelmodel4);
      wheel.quaternion.multiply(shapeQuaternion)
      wheelModels.push(Wheelmodel1,Wheelmodel2,Wheelmodel3,Wheelmodel4)
      
   })
   

const wheelBodies = [wheelBody1, wheelBody2, wheelBody3, wheelBody4];

console.log(wheelModels)
console.log(wheelBodies)

function updateWheelModels() {
   if(wheelModels.length === wheelBodies.length){
      for (let i = 0; i < wheelBodies.length; i++) {
         wheelModels[i].position.copy(wheelBodies[i].position);
         wheelModels[i].quaternion.copy(wheelBodies[i].quaternion) 
         wheelModels[i].quaternion.multiply(rotationFix);
     }
   }
}

function animate() {
  control.update()
  physicsWorld.fixedStep()
  if (modelCar && carBody) {
   modelCar.quaternion.copy(carBody.quaternion);
   modelCar.position.copy(carBody.position); 
   }

    updateWheelModels()
  
  canDebug.update();
	renderer.render(scene, camera);
   
}




