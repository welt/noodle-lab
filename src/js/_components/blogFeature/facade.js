import FeatureFacadeContract from "../../_contracts/featureFacadeContract";
import BlogApp from "./blogApp";
import BlogEditor from "./blogEditor";
import BlogList from "./blogList";
import BlogModal from "./blogModal";
import BlogEditorCard from "./blogEditorCard";
import BlogListCard from "./blogListCard";
import BlogStrategySwitch from "./blogStrategySwitch";

export default class BlogFeatureFacade extends FeatureFacadeContract {
  register() {
    customElements.define("blog-list", BlogList);
    customElements.define("blog-editor", BlogEditor);
    customElements.define("blog-modal", BlogModal);
    customElements.define("blog-editor-card", BlogEditorCard);
    customElements.define("blog-list-card", BlogListCard);
    customElements.define("blog-strategy-switch", BlogStrategySwitch);

    const initializeBlogFeature = () => {
      const main = document.getElementById("main");
      if (!main) {
        console.warn('No element with id="main" found in the DOM.');
        return;
      }

      const primaryControls = document.querySelector("[data-controls-primary]");
      if (!primaryControls) {
        console.warn(
          "No element with data-controls-primary attribute found in the DOM.",
        );
        return;
      }

      let editorCard = main.querySelector("blog-editor-card");
      if (!editorCard) {
        editorCard = document.createElement("blog-editor-card");
        main.appendChild(editorCard);
      }

      let listCard = main.querySelector("blog-list-card");
      if (!listCard) {
        listCard = document.createElement("blog-list-card");
        main.appendChild(listCard);
      }

      const modal =
        main.querySelector("blog-modal") ||
        document.createElement("blog-modal");

      document.body.insertBefore(
        modal,
        document.body.querySelector("script") || null,
      );

      let strategySwitch = primaryControls.querySelector(
        "blog-strategy-switch",
      );
      if (!strategySwitch) {
        strategySwitch = document.createElement("blog-strategy-switch");
        primaryControls.appendChild(strategySwitch);
      }
      document.addEventListener("load", () => {
        strategySwitch.update;
      });

      try {
        window.blogApp = new BlogApp({
          listCard,
          editorCard,
          modal,
        });
      } catch (err) {
        console.warn("BlogApp initialization failed", err);
      }
    };

    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", initializeBlogFeature);
    } else {
      initializeBlogFeature();
    }
  }
}
