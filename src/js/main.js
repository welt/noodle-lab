import messages from "./_modules/messages.js";
import LoadingSpinner from "./_components/loadingSpinner.js";
import CarbonReporter from "./_components/carbonReporter.js";
import GitHubReporter from "./_components/gitHubReporter.js";
import RandomReporter from "./_components/randomReporter.js";

messages.hello();

customElements.define("loading-spinner", LoadingSpinner);
customElements.define("carbon-reporter", CarbonReporter);
customElements.define("github-reporter", GitHubReporter);
customElements.define("random-reporter", RandomReporter);
