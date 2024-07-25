import { setupAnimation } from './animation';
import { setupWheel } from './wheel';

import './styles/main.scss';

// Initialise the application
(async function start() {
  await setupWheel();
  await setupAnimation();
})();