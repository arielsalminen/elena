import { Elena, html, nothing } from "../../src/elena.js";
import "./child-element.js";
import "./wrapper-element.js";
import "./shadow-slot-element.js";

export default class NestedElement extends Elena(HTMLElement) {
  static tagName = "nested-element";
  static props = ["variant", "extra"];
  static element = ".nested-inner";

  variant = "default";

  extra = false;

  span(className) {
    return html`
      <span class="${className}">${this.variant}</span>
    `;
  }

  childElement() {
    return html`
      <child-element variant="${this.variant}"></child-element>
    `;
  }

  // sections are extracted so that any update to a child element
  // has to survive structural re-render
  render() {
    return html`
      <div class="nested-inner">
        ${this.extra ? html`<span class="extra">extra</span>` : nothing}
        ${this.childElement()}
        <wrapper-element>${this.span("wrapped")}</wrapper-element>
        <shadow-slot-element>${this.span("slotted")}</shadow-slot-element>
      </div>
    `;
  }
}
NestedElement.define();
