import { jest } from "@jest/globals";
import WizardReporter from "../src/js/_components/wizardFeature/wizardReporter.js";
import WizardControls from "../src/js/_components/wizardFeature/wizardControls.js";
import { registerCustomElements } from "../src/js/_lib/registerCustomElements.js";

describe("WizardReporter and WizardControls empty state and accessibility", () => {
  beforeAll(() => {
    registerCustomElements();
  });

  describe("WizardReporter empty state", () => {
    test("renders empty state when empty array is provided", () => {
      const reporter = new WizardReporter();
      
      // Test with empty array - should override the local wizards
      reporter.render([]);
      expect(reporter.innerHTML).toContain("No wizards have been added to this story yet");
      expect(reporter.innerHTML).toContain("Use the controls above to add wizards to your story");
      expect(reporter.innerHTML).toContain("empty-state");
      expect(reporter.innerHTML).toContain('role="status"');
      expect(reporter.innerHTML).toContain('aria-live="polite"');
    });

    test("renders empty state when null is provided", () => {
      const reporter = new WizardReporter();
      
      // Test with null - should override the local wizards  
      reporter.render(null);
      expect(reporter.innerHTML).toContain("No wizards have been added to this story yet");
      expect(reporter.innerHTML).toContain("empty-state");
    });

    test("renders wizard list with accessibility attributes when wizards are provided", () => {
      const reporter = new WizardReporter();
      const wizards = ["Gandalf", "Merlin", "Dumbledore"];
      
      reporter.render(wizards);
      expect(reporter.innerHTML).toContain("Gandalf");
      expect(reporter.innerHTML).toContain("Merlin");
      expect(reporter.innerHTML).toContain("Dumbledore");
      expect(reporter.innerHTML).toContain('<ul role="list"');
      expect(reporter.innerHTML).toContain('aria-label="List of wizards in the story"');
      expect(reporter.innerHTML).toContain('role="listitem"');
    });
  });

  describe("WizardControls empty state", () => {
    test("renders empty state when empty array is provided", () => {
      const controls = new WizardControls();
      
      // Test with empty array
      controls.render([]);
      expect(controls.innerHTML).toContain("No more wizards available to add to the story");
      expect(controls.innerHTML).toContain("empty-state");
      expect(controls.innerHTML).toContain('aria-live="polite"');
    });

    test("renders controls with accessibility attributes when wizards are provided", () => {
      const controls = new WizardControls();
      const wizards = ["Test Wizard"];
      
      controls.render(wizards);
      expect(controls.innerHTML).toContain('aria-label="Available wizards to add"');
      expect(controls.innerHTML).toContain('aria-label="Add Test Wizard to the story"');
    });
  });

  describe("Accessibility features", () => {
    test("WizardReporter has proper ARIA attributes", () => {
      const reporter = new WizardReporter();
      
      // Test with wizards
      reporter.render(["Test"]);
      expect(reporter.innerHTML).toContain('role="list"');
      expect(reporter.innerHTML).toContain('aria-label="List of wizards in the story"');
      expect(reporter.innerHTML).toContain('role="listitem"');
      
      // Test empty state
      reporter.render([]);
      expect(reporter.innerHTML).toContain('role="status"');
      expect(reporter.innerHTML).toContain('aria-live="polite"');
    });

    test("WizardControls has proper ARIA attributes", () => {
      const controls = new WizardControls();
      
      // Test with wizards
      controls.render(["Test Wizard"]);
      expect(controls.innerHTML).toContain('role="group"');
      expect(controls.innerHTML).toContain('aria-label="Available wizards to add"');
      expect(controls.innerHTML).toContain('aria-label="Add Test Wizard to the story"');
      
      // Test empty state
      controls.render([]);
      expect(controls.innerHTML).toContain('role="group"');
      expect(controls.innerHTML).toContain('aria-live="polite"');
    });
  });
});