import { getComponentsByPrototype } from '@/assets/js/stores/componentManager';

await customElements.whenDefined('c-button');
const $allButtons = getComponentsByPrototype('Button');

console.log('All buttons:', $allButtons);
