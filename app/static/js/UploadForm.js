export class UploadForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.selectedFile = null
        this.reload();
    }

    reload() {
        this.shadowRoot.innerHTML = this.render();
        this.attachListeners()
    }

    attachListeners() {
        this.shadowRoot.querySelector("#upload").addEventListener("change", async (e) => {
            if (this.uploadInput.files.length == 0) {
                this.selectedFile = null;
                this.shadowRoot.querySelector("#upload-label").innerText = "Choose a file";
                return;
            }
            const file = this.uploadInput.files[0]
            this.selectedFile = file
            this.shadowRoot.querySelector("#upload-label").innerText = file.name;
            const response = await this.sendData(file)
            if (response.status === 200) {
                const json = await response.json()
                if (json.error === undefined) {
                    this.dispatchEvent(new CustomEvent("results", {
                        detail: json
                    }))
                }
            }
        })
    }

    get uploadInput() {
        return this.shadowRoot.querySelector("#upload")
    }

    async sendData(image) {
        const formData  = new FormData();
        formData.append("image", image);
        
        const response = await fetch("/api/predict", {
            method: 'POST',
            body: formData
        });
        
        return response
    }

    render() {
        return `
        <style type="text/css">
        @import "/static/css/bootstrap.min.css";
        #upload {
            opacity: 0;
        }
        
        #upload-label {
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
        }
        </style>
        <div class="input-group mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
        <input id="upload" type="file" class="form-control border-0">
            <label id="upload-label" for="upload" class="font-weight-light text-muted">${this.selectedFile !== null ? this.selectedFile.name : 'Choose a file'}</label>
            <div class="input-group-append">
                <label for="upload" class="btn btn-light m-0 rounded-pill px-4"> <i class="fa fa-cloud-upload mr-2 text-muted"></i><small class="text-uppercase font-weight-bold text-muted">Choose file</small></label>
            </div>
        </div>
        `
    }
}

customElements.define("upload-form", UploadForm);