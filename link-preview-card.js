/**
 * Copyright 2025 mbisch11
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 * 
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "Default title";
    this.loading = false;
    this.
    this.url = "";
    this.items = [];
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      loading: {type: Boolean},
      url: {type: String},
      description: {type: String},
      items: {type: Array}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .loader {
        border: 25px solid lightgray; /* Light grey */
        border-top: 25px solid #d47e15; /* Blue */
        border-radius: 100%;
        width: 100px;
        height: 100px;
      animation: spin 10s linear infinite;
      }
      @keyframes spin {
        50% { transform: rotate(180deg); }
        100% { transform: rotate(360deg); }
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--link-preview-card-label-font-size, var(--ddd-font-size-s));
      }
    `];
  }

  updateResults(Value){
      this.loading = true;
      fetch('${this.url}')
        .then(res => {
          if(!res.ok){
            console.log("Error loading your webpage!");
          }
          return res.json();
        }).then(data => {
          if(data.collection){
            this.items = data.collection.items;
          }
          this.loading = false;
        }).catch(error => {
          console.log("Error formatting!");
          this.loading = false;
        })
      console.log(data)
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <div class="card wrapper">
    <h3>${this.title}</h3>
  </div>
  <div class="loader"></div>
</div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);