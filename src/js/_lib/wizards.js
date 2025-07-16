import store from './store';

// The element to inject our UI into
// const app = document.querySelector('#app');

// The data
// Create reactive data store
const wizards = store(['Gandalf', 'Merlin'], 'wizards');

// Reactively update the UI
// document.addEventListener('wizards', function (event) {
// 	if (app) app.innerHTML = template(event.detail);
// });

// The template
// function template (props) {
// 	return `
// 		<ul>
// 			${props.map(function (wizard) {
// 				return `<li>${wizard}</li>`;
// 			}).join('')}
// 		</ul>`;
// }

// Render the UI
// if (app) app.innerHTML = template(wizards);

// Add a wizard

async function addWizardAfterDelay(wizard, delay) {
  console.log('>>> delay', delay);
  await new Promise(resolve => setTimeout(resolve, delay));
  wizards.push(wizard);
}

// Add a wizard after a 1-second delay
addWizardAfterDelay('Ursula', 5000);
