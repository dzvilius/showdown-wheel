import { Application, Assets, Sprite } from 'pixi.js';
import './styles/main.scss';

(async () => {
  const wheelContainer = document.getElementById('game-wheel');
  const spinButton = document.getElementById('game-button');

  // Create a PixiJS application
  const app = new Application();

  // Initialise the application
  await app.init({
    background: '#140D3D',
    resizeTo: window,
  });

  // Add the application's canvas to the wheelContainer
  wheelContainer.appendChild(app.canvas);

  // Load the wheel image
  const texture = await Assets.load(require('./assets/img/wheel.png'));

  // Create a new Sprite from an image path
  const wheel = new Sprite(texture);

  // Add to stage
  app.stage.addChild(wheel);

  // Center the sprite's anchor point
  wheel.anchor.set(0.5);

  // Move the sprite to the center of the screen
  wheel.x = app.screen.width / 2;
  wheel.y = app.screen.height / 2;

  // Flag to control the rotation.
  let spinning = false;

  // Variable to track the rotation speed
  const rotationSpeed = 0.1;

  // Duration to spin the wheel
  const spinDuration = 2000; // 2 seconds

  // Add a click event listener to the spin button
  spinButton.addEventListener('click', () => {
    if (!spinning) {
      // Start spinning if not already spinning
      spinning = true;
      spinButton.disabled = true; // Disable the button while spinning

      // Spin for a set duration
      setTimeout(() => {
        spinning = false;
        spinButton.disabled = false; // Re-enable the button after spinning
      }, spinDuration);
    }
  });

  // Update the wheel rotation based on the flag
  app.ticker.add((time) => {
    if (spinning) {
      wheel.rotation += rotationSpeed * time.deltaTime;
    }
  });
})();
