import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home Page!");
    }

    async getHtml() {
        return `
        <h1> Welcome to Home </h1>
        `
    }
}