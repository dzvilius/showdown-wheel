import { Application, Sprite, Assets } from 'pixi.js';

// Function to get pet names based on the provided number
export const getPetName = (number) => {
  const petNames = {
    1: 'Orange Pet',
    2: 'Pink Pet',
    3: 'White Pet',
    4: 'Red Pet',
  };
  return petNames[number] || 'Invalid Number';
};

// Function to set up the spinning wheel
export const setupWheel = async () => {
  const wheelContainer = document.getElementById('game-wheel');
  const spinButton = document.getElementById('game-button');

  // Create a PixiJS application
  const wheelApp = new Application();

  // Init and configure application
  await wheelApp.init({
    background: '#140D3D',
    resizeTo: wheelContainer,
  });

  // Add canvas to the container
  wheelContainer.appendChild(wheelApp.canvas);

  // Load the wheel image
  const wheelTexture = await Assets.load(require('./assets/img/wheel.png'));
  const wheelSprite = new Sprite(wheelTexture);
  wheelApp.stage.addChild(wheelSprite);

  // Resize sprite while maintaining aspect ratio
  const resizeSprite = () => {
    const { clientWidth: containerWidth, clientHeight: containerHeight } =
      wheelContainer;
    const aspectRatio = wheelTexture.width / wheelTexture.height;

    wheelSprite.width = containerWidth;
    wheelSprite.height = containerWidth / aspectRatio;
    wheelSprite.anchor.set(0.5);
    wheelSprite.position.set(
      wheelApp.screen.width / 2,
      wheelApp.screen.height / 2
    );

    wheelApp.renderer.resize(containerWidth, containerHeight);
  };

  resizeSprite();
  window.addEventListener('resize', resizeSprite);

  let spinning = false;
  const spinDuration = 3000; // 3 seconds
  const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // 0, 90, 180, 270 degrees

  const fetchRandomAngle = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/spin'); // Local API
      //const response = await fetch('https://flax-evanescent-cap.glitch.me/api/spin'); // Production API
      const { value } = await response.json();
      console.log('Result:', getPetName(value));
      return angles[value - 1] || angles[0];
    } catch (error) {
      console.error('Error fetching random angle:', error);
      return angles[0];
    }
  };

  spinButton.addEventListener('click', async () => {
    if (spinning) return;

    spinning = true;
    spinButton.disabled = true;
    spinButton.classList.add('disabled');

    const targetAngle = (await fetchRandomAngle()) + Math.PI * 8;
    const startTime = Date.now();

    const updateRotation = () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < spinDuration) {
        const t = elapsedTime / spinDuration;
        const easing = 1 - Math.pow(1 - t, 2); // Ease-out quadratic function
        wheelSprite.rotation = (easing * targetAngle) % (Math.PI * 2);
        requestAnimationFrame(updateRotation);
      } else {
        wheelSprite.rotation = targetAngle % (Math.PI * 2);
        spinning = false;
        spinButton.disabled = false;
        spinButton.classList.remove('disabled');
      }
    };

    updateRotation();
  });
};
