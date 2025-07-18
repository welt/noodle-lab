import store from "./store";
import { allWizards } from "../_data/allWizards";

// Initialize the wizard store.
const wizardStore = store(allWizards, "wizards");

async function addWizardAfterDelay(wizard, delay) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  wizardStore.push(wizard);
}

// Add a wizard to store after a 5-second delay to see what happens ...
addWizardAfterDelay("Ursula", 5000);

export default wizardStore;
