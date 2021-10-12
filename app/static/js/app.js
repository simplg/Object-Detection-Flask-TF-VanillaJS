import "/static/js/Resultlist.js";
import "/static/js/UploadForm.js";

class App extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.uploadForm = document.createElement("upload-form");
        this.resultForm = document.createElement("result-list");
        this.results = [];
        this.imageCover = null;
        this.attachListeners();
    }

    connectedCallback() {
        this.reload();
    }

    attachListeners() {
        this.uploadForm.addEventListener("results", (e) => {
            this.results = e.detail.result;
            this.imageCover = e.detail.image;
            this.resultForm.setAttribute("classes", JSON.stringify(this.results));
            this.reload();
        })
    }

    get image() {
        return this.imageCover || "/static/img/gallery-icon.png";
    }

    reload() {
        this.shadowRoot.innerHTML = this.render();
        this.shadowRoot.querySelector("#components").appendChild(this.uploadForm);
        if (this.results.length > 0)
            this.shadowRoot.querySelector("#components").appendChild(this.resultForm);
    }

    render() {
        return `
        <style type="text/css">
        @import "/static/css/bootstrap.min.css";
        </style>
        <div class="container py-5">
        <header class="text-white text-center">
            <h1>Object Detection Example</h1>
            <p class="lead mb-0">Build a simple object detection with Tensorflow.</p>
            <p class="mb-5 font-weight-light">Example by
                <a href="https://github.com/akuma06" class="text-white">
                    <u>akuma06</u>
                </a>
            </p>
            <img src="${this.image}" alt="" class="mb-4">
        </header>
    
    
        <div class="row py-4">
            <div class="col-lg-6 mx-auto" id="components">
            </div>
        </div>
    </div>
        `;
    }
}

customElements.define("main-app", App)