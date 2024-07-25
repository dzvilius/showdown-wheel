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
    // Assets.load(require('./assets/img/s@2x.png')),
    // Assets.load(require('./assets/img/h@2x.png')),
    // Assets.load(require('./assets/img/o-1@2x.png')),
    // Assets.load(require('./assets/img/w-1@2x.png')),
    // Assets.load(require('./assets/img/d@2x.png')),
    // Assets.load(require('./assets/img/o-2@2x.png')),
    // Assets.load(require('./assets/img/w-2@2x.png')),
    // Assets.load(require('./assets/img/n@2x.png')),
  ]);

  const [
    headerTexture,
    showdownOffTexture,
    vegasTexture,
    slotsTexture,
    boltTexture,
    mustDropTexture,
    // sTexture,
    // hTexture,
    // o1Texture,
    // w1Texture,
    // dTexture,
    // o2Texture,
    // w2Texture,
    // nTexture
  ] = textures;

  const headerSprite = new Sprite(headerTexture);
  const showdownOffSprite = new Sprite(showdownOffTexture);
  const vegasSprite = new Sprite(vegasTexture);
  const slotsSprite = new Sprite(slotsTexture);
  const boltSprite = new Sprite(boltTexture);
  const mustDropSprite = new Sprite(mustDropTexture);

  // Set initial properties for sprites
  headerSprite.width = animationApp.screen.width;
  headerSprite.height = animationApp.screen.height;

  showdownOffSprite.position.set(0, 0);

  vegasSprite.position.set(54, -10);
  slotsSprite.position.set(434, -10);
  boltSprite.position.set(342, -47);
  mustDropSprite.position.set(-77, 210);

  vegasSprite.visible = false;
  slotsSprite.visible = false;
  boltSprite.visible = false;
  mustDropSprite.visible = false;

  // Add sprites to the stage
  animationApp.stage.addChild(
    headerSprite,
    showdownOffSprite,
    vegasSprite,
    slotsSprite,
    boltSprite,
    mustDropSprite
  );

  // Function to animate a sprite
  const animateSprite = (sprite, delay = 0) =>
    new Promise((resolve) => {
      setTimeout(() => {
        sprite.alpha = 0;
        sprite.visible = true;
        const duration = 1000;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          sprite.alpha = progress;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        animate();
      }, delay);
    });

  // Start animation sequence
  await animateSprite(vegasSprite);
  await animateSprite(slotsSprite);
  await animateSprite(boltSprite);
  await animateSprite(mustDropSprite);
};
