import { Application, Assets, Sprite } from 'pixi.js';
import './styles/main.scss';

(async () => {
  const wheelContainer = document.getElementById('game-wheel');

  const app = new Application();

  await app.init({
    background: '#140D3D',
    resizeTo: window,
  });

  wheelContainer.innerHTML = '';

  wheelContainer.appendChild(app.canvas);

  const texture = await Assets.load(require('./assets/img/wheel.png'));

  const background = new Sprite(texture);

  app.stage.addChild(background);

  background.anchor.set(0.5);
  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;
})();
