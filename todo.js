import './utils.css';
import { html, render } from "lit-html"

class App {
  constructor(options) {
    this.items = options.items;
    this.target = options.target;
  }
  addItem(item) {
    this.items = [...this.items, item]
  }
  deleteItem(i) {
    this.items.splice(i, 1)
    this.show();
  }
  handleNewItem (e) {
      if (e.key == 'Enter') {
        this.addItem(e.target.value);
        this.show();
        e.target.value = '';
      }
  }
  mainTemplate() {
    return html`
    <div class="flex justify-center bg-gray-200 h-screen">
      <div class="flex flex-col p-2 border-solid w-3/12 rounded bg-white h-screen mt-4">
        <h1 class="font-bold p-2">What needs to be done?</h1>
        <input class="border-2 m-2 p-1" type="text" @keypress=${this.handleNewItem}>
        ${this.items.length > 0 ? this.listTemplate() : ''}
      </div>
    </div>
    `
  }
  listTemplate() {
    return html`
      <ul>
        ${this.items.map((x, i) => this.singleItem(x, i))}
      </ul>
    `
  }
  singleItem(x, i) {
    return html`
      <li class="px-2 flex justify-between border-b p-2">
        <input type="checkbox" class="mx-1" />
        <label class="w-full mx-2 break-all">${x}</label>
        <button class="flex-none block w-4 mx-2 font-sans" @click=${_e => this.deleteItem(i)}>x</button>
      </li>
    `
  }
  show() {
    render(this.mainTemplate(), this.target, {eventContext: this});
  }
}

const app = new App({target: document.body, items: ['sample']});
app.show();
