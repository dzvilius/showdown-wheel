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

  // Duration to spin the wheel
  const spinDuration = 3000; // 3 seconds

  // Define the possible stop angles for the wheel
  const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // 0, 90, 180, 270 degrees

  // Set the initial/default wheel position (marker = 1 at the top)
  wheel.rotation = 0;

  // Function to get a random angle from the possible angles
  const getRandomAngle = () =>
    angles[Math.floor(Math.random() * angles.length)];

  // Add a click event listener to the spin button
  spinButton.addEventListener('click', () => {
    if (!spinning) {
      // Start spinning if not already spinning
      spinning = true;
      spinButton.disabled = true; // Disable the button while spinning
      spinButton.classList.add('disabled'); // Add the disabled class

      // Calculate the target rotation
      const targetAngle = getRandomAngle() + (Math.PI * 8); // Ensure multiple spins (e.g., 4 full rotations)

      // Capture the start time
      const startTime = Date.now();

      // Function to update the rotation
      const updateRotation = () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < spinDuration) {
          // Ease-out quadratic function for smoother stopping
          const easing = (t) => 1 - Math.pow(1 - t, 2);
          const t = elapsedTime / spinDuration;
          const angle = easing(t) * targetAngle;
          wheel.rotation = angle % (Math.PI * 2);
          requestAnimationFrame(updateRotation);
        } else {
          // Ensure it lands exactly on the target angle
          wheel.rotation = targetAngle % (Math.PI * 2);
          spinning = false;
          spinButton.disabled = false; // Re-enable the button after spinning
          spinButton.classList.remove('disabled'); // Remove the disabled class
        }
      };

      // Start the rotation update
      updateRotation();
    }
  });
})();
