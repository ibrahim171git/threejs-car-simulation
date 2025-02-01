# 3D Car Simulation with Three.js and Cannon.js

This project demonstrates a 3D car simulation using **Three.js** for rendering and **Cannon.js** for physics. The simulation allows the user to control a car model and its wheels, with physics applied to make the car move realistically.

## Features:
- 3D car model and wheels.
- Car physics (e.g., movement, rotation, gravity).
- Car steering control using keyboard (W, A, S, D or Arrow keys).
- Ability to load custom 3D car and wheel models.
- Basic environment setup with lighting and ground.
- Debugging visuals using **Cannon.js** debugger.

# You can upload your own 3D car and wheel models by changing the paths in the code
-loader.load('path-to-your-car-model.glb', (gltf) => {
  // Load car model
});


-loader.load('path-to-your-wheel-model.glb', (gltf) => {
  // Load wheel model
});

Replace 'path-to-your-car-model.glb' and 'path-to-your-wheel-model.glb' with the file paths of the models you want to use. These should be in GLTF or GLB format.
