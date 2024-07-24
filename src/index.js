import { Application, Assets, Sprite } from 'pixi.js';
import './styles/main.scss';

function getPetName(number) {
  switch (number) {
      case 1:
          return 'Orange Pet';
      case 2:
          return 'Pink Pet';
      case 3:
          return 'White Pet';
      case 4:
          return 'Red Pet';
      default:
          return 'Invalid Number'; // In case the number is not between 1 and 4
  }
}

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
  // 1 = 'Orange Pet', 2 = 'Pink Pet', 3 = 'White Pet', 4 = 'Red Pet'
  const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // 0, 90, 180, 270 degrees

  // Set the initial/default wheel position (marker = 1 at the top)
  wheel.rotation = 0;

  // Function to fetch the random value from the server and get the corresponding angle
  const fetchRandomAngle = async () => {
    try {
      //const response = await fetch('http://localhost:3000/api/spin'); // Local API
      const response = await fetch('/api/spin'); // Production API
      const data = await response.json();
      console.log('Result:', getPetName(data.value))
      const index = data.value - 1; // Map the value to an index (1-4 to 0-3)
      return angles[index];
    } catch (error) {
      console.error('Error fetching random angle:', error);
      return angles[0]; // Fallback to the first angle in case of error
    }
  };

  // Add a click event listener to the spin button
  spinButton.addEventListener('click', async () => {
    if (!spinning) {
      // Start spinning if not already spinning
      spinning = true;
      spinButton.disabled = true; // Disable the button while spinning
      spinButton.classList.add('disabled'); // Add the disabled class

      // Fetch the target rotation angle from the server
      const targetAngle = (await fetchRandomAngle()) + (Math.PI * 8); // Ensure multiple spins (e.g., 4 full rotations)

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
