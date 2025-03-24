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
    this.description = "####";
    this.link = "";
    this.href = "";
    this.items = [];
    this.themeColor = "white";
    this.image = "https://i.ytimg.com/vi/lcakpMnPNMM/hq2.jpg?sqp=-oaymwEYCNYCEOgCSFryq4qpAwoIARUAAIhC0AEB&rs=AOn4CLDRFWhyOMykg3HVSM7qkWUKemBo7Q";

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
      loading: {type: Boolean, attribute: "loading-state"},
      href: {type: String},
      image: {type: String},
      description: {type: String},
      items: {type: Array},
      link: {type: String},
      themeColor: {type: String}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary-2);
        background-color: var(--themeColor);
        font-family: var(--ddd-font-navigation);
        border-radius: 8px;
        padding: 10px;
        max-width: 350px;
        border: 1px solid;
      }
      .wrapper {
        margin: var(--ddd-spacing-1);
        padding: var(--ddd-spacing-1);
        background-color: var(--themeColor);
      }
      .card-wrapper{
        align-items: center;
        display: flex;
        flex-direction: column;
        width: 334px;
      }
      .header{
        font-weight: bold;
        margin-top: var(--ddd-spacing-1);
        margin-bottom: var(--ddd-spacing-3);
        text-align: center;
      }
      .divider{
        border: 1px solid;
        margin-bottom: var(--ddd-spacing-2);
        width: 334px;
      }
      .image {
        max-height: 150px;
        width: 300px;
        object-fit: cover;
        border-radius: 6px;
      }
      .desc{
        margin-top: var(--ddd-spacing-3);
        margin-bottom: var(--ddd-spacing-1);
      }
      .loader {
        border: 25px solid lightgray; /* Light grey */
        border-top: 25px solid #d47e15; /* Blue */
        border-radius: 100%;
        width: 75px;
        height: 75px;
        animation: spin 10s linear infinite;
      }
      @keyframes spin {
        50% { transform: rotate(180deg); }
        100% { transform: rotate(360deg); }
      }
    `];
  }

  updated(changedProperties) {
    if (changedProperties.has("href") && this.href) {
      this.fetchInfo(this.href);
    }
  }

  async fetchInfo(params) {
    this.loading = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${this.href}`;
    try{
      const res = await fetch(url);
      if(!res.ok){
        throw new Error(`Response: ${res.status}`)
      }
      
      const json = await res.json();
      this.title =  json.data["og:title"] || json.data["title"]|| "No Title Available";
      this.description = json.data["description"] || "No Description Available (Sorry)";
      this.image = json.data?.["ld+json"]?.logo ?? (json.data["logo"] || json.data["og:image"] || json.data["image"] || "");
      this.link = json.data["url"] || link;
      this.themeColor = json.data["theme-color"] || "white";
      
      if(this.description.length > 110){
        this.description = this.description.substring(0, 110) + "...";
      }
      if(!this.image.startsWith("http")){
        this.image = "https://monovm.com/uploads/tinymce/Suno/2021/01/19/60068947652ed-domain-name.webp";
      }

      this.loading = false;
    }catch (e){
      console.log(e)
      this.title = "No Preview Available :(";
      this.description = "";
      this.image = "https://media.istockphoto.com/id/932022348/vector/sad-face-icon-unhappy-face-symbol.jpg?s=612x612&w=0&k=20&c=ZpGiAAFxUNnde83WA2mqotDiZF2lFukmu5vs8fHc8rA=";
      this.link = "";
      this.themeColor = "white";

      this.loading = false;
    }
    
  }

  // Lit render the HTML
render() {
  return html`
  <div class="wrapper">
    ${this.loading ? html`<div class="loader"></div>` : html`
      <div class="card-wrapper">
        <h3 class="header"><a href="${this.href}" target="_blank">${this.title}</a></h3>
        <hr class="divider">
        <img src="${this.image}" class="image"></img>
        <p class="desc">${this.description}</p>
      </div>`
    }
  </div>`;
}

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new href(`./lib/${this.tag}.haxProperties.json`, import.meta.href)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);