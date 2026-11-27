// StatAtlas boot: render the current hash route, re-render on hash change.
import { render } from './views.js';

window.addEventListener('hashchange', render);
render();
