export class ResultList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = this.render();
    }

    static get observedAttributes() {
        return ["classes"]
    }

    attributeChangedCallback() {
        this.shadowRoot.innerHTML = this.render();
    }

    get classes() {
        return JSON.parse(this.getAttribute("classes") || "[]");
    }

    render() {
        return  `
        <style type="text/css">
        @import "/static/css/bootstrap.min.css";
        .list-area {
            border: 2px dashed rgba(255, 255, 255, 0.7);
            padding: 1rem;
            position: relative;
        }
        </style>
        <p class="font-italic text-white text-center">The prediction results will be shown below.</p>
        <div class="list-area mt-4">
        <ul class="list-group list-group-flush text-white w-100">
        ${this.classes.map((cls) => `<li class="list-group-item">${cls.name}</li>`).join("\n")}
        </ul>
        </div>
        `;
    }
}

customElements.define("result-list", ResultList)