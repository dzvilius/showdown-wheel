import { Application, Sprite, Assets } from 'pixi.js';

// Function to set up the animation
export const setupAnimation = async () => {
  const animationContainer = document.getElementById('game-animation');

  // Create a PixiJS application
  const animationApp = new Application();

  // Init and configure application
  await animationApp.init({
    background: '#140D3D',
    resizeTo: animationContainer,
  });

  // Add canvas to the container
  animationContainer.appendChild(animationApp.canvas);

  // Load assets
  const textures = await Promise.all([
    Assets.load(require('./assets/img/header.png')),
    Assets.load(require('./assets/img/showdown-off.png')),
    Assets.load(require('./assets/img/vegas@2x.png')),
    Assets.load(require('./assets/img/slots@2x.png')),
    Assets.load(require('./assets/img/bolt@2x.png')),
    Assets.load(require('./assets/img/must_drop.png')),
    Assets.load(require('./assets/img/s@2x.png')),
    Assets.load(require('./assets/img/h@2x.png')),
    Assets.load(require('./assets/img/o-1@2x.png')),
    Assets.load(require('./assets/img/w-1@2x.png')),
    Assets.load(require('./assets/img/d@2x.png')),
    Assets.load(require('./assets/img/o-2@2x.png')),
    Assets.load(require('./assets/img/w-2@2x.png')),
    Assets.load(require('./assets/img/n@2x.png')),
  ]);

  const [
    headerTexture,
    showdownOffTexture,
    vegasTexture,
    slotsTexture,
    boltTexture,
    mustDropTexture,
    sTexture,
    hTexture,
    o1Texture,
    w1Texture,
    dTexture,
    o2Texture,
    w2Texture,
    nTexture,
  ] = textures;

  const createSprite = (texture, x, y, visible = false) => {
    const sprite = new Sprite(texture);
    sprite.position.set(x, y);
    sprite.visible = visible;
    return sprite;
  };

  const headerSprite = new Sprite(headerTexture);
  const showdownOffSprite = createSprite(showdownOffTexture, 0, 0);
  const vegasSprite = createSprite(vegasTexture, 54, -10);
  const slotsSprite = createSprite(slotsTexture, 434, -10);
  const boltSprite = createSprite(boltTexture, 342, -47);
  const mustDropSprite = createSprite(mustDropTexture, -77, 210);

  headerSprite.width = animationApp.screen.width;
  headerSprite.height = animationApp.screen.height;

  // Add sprites to the stage
  animationApp.stage.addChild(
    headerSprite,
    showdownOffSprite,
    vegasSprite,
    slotsSprite,
    boltSprite,
    mustDropSprite
  );

  // Function to create and add letter sprites
  const createLetterSprites = () => {
    const letters = [
      { texture: sTexture, xOffset: -165 },
      { texture: hTexture, xOffset: -62 },
      { texture: o1Texture, xOffset: 14 },
      { texture: w1Texture, xOffset: 121 },
      { texture: dTexture, xOffset: 236 },
      { texture: o2Texture, xOffset: 320 },
      { texture: w2Texture, xOffset: 405 },
      { texture: nTexture, xOffset: 515 },
    ];
    const yOffset = 3; // Adjust yOffset to position the letters at the top of the canvas
    return letters.map(({ texture, xOffset }) => {
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5, 0); // Align to the top center
      sprite.visible = false;
      sprite.x = animationApp.screen.width / 2 - 175 + xOffset;
      sprite.y = yOffset;
      animationApp.stage.addChild(sprite);
      return sprite;
    });
  };

  // Create letter sprites for "Showdown"
  const showdownLetters = createLetterSprites();

  // Function to animate a sprite
  const animateSprite = (sprite, delay = 0, flash = false) =>
    new Promise((resolve) => {
      setTimeout(() => {
        sprite.alpha = 0;
        sprite.visible = true;
        const duration = 500; // Faster animation
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          sprite.alpha = flash
            ? Math.abs(Math.sin(progress * Math.PI))
            : progress;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            if (flash) {
              sprite.alpha = 1; // Ensure it stays visible
            }
            resolve();
          }
        };
        animate();
      }, delay);
    });

  // Flashing animation for boltSprite
  const flashSprite = (sprite) => {
    const flash = () => {
      sprite.alpha = sprite.alpha === 1 ? 0 : 1;
      setTimeout(flash, 500); // Adjust the flash interval as needed
    };
    flash();
  };

  // Start animation sequence
  console.log('Starting animation sequence...');
  await animateSprite(showdownOffSprite);
  console.log('showdownOffSprite animated.');

  await Promise.all([
    animateSprite(vegasSprite, 0, true),
    animateSprite(slotsSprite, 0, true),
  ]);

  console.log('vegasSprite and slotsSprite animated.');

  // Ensure vegasSprite and slotsSprite remain visible
  vegasSprite.visible = true;
  slotsSprite.visible = true;

  // Start flashing boltSprite
  console.log('Starting boltSprite flash...');
  flashSprite(boltSprite);

  // Animate letters
  for (const [i, letter] of showdownLetters.entries()) {
    await animateSprite(letter, i * 100);
    console.log(`Letter ${i} animated.`);
  }

  // Animate mustDropSprite
  console.log('Animating mustDropSprite...');
  await animateSprite(mustDropSprite);
  console.log('mustDropSprite animated.');
};
