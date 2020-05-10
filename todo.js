import './utils.css';
import { html, render } from "lit-html"

class App {
  constructor(options) {
    this.items = options.items;
    this.target = options.target;
    this.mode = 'all';
    this.selectAll = false;
    this.hoveringIndex;
    this.showClearAll = false;
  }
  addItem(item) {
    this.items = [...this.items, {value: item, checked: false}]
  }
  checkItem(i, status) {
    this.items[i].checked = status;
    this.showClearAll = false;
    this.show();
  }
  deleteItem(i) {
    this.items.splice(i, 1);
    this.showClearAll = false;
    this.show();
  }
  handleNewItem (e) {
    if (e.key == 'Enter') {
      this.addItem(e.target.value);
      this.show();
      e.target.value = '';
    }
  }
  changeMode(mode) {
    this.mode = mode;
    this.show();
  }
  hovering(i) {
    this.hoveringIndex = i;
    this.show();
  }
  hoveringEnded() {
    this.hoveringIndex = undefined;
    this.show();
  }
  completeAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.items = this.items.map(item => {return {"value": item.value, "checked": true} });
      this.showClearAll = true;
    } else {
      this.items = this.items.map(item => {return {"value": item.value, "checked": false} });
      this.showClearAll = false;
    }
    this.show();
  }
  deleteAll() {
    this.items = [];
    this.selectAll = false;
    this.show();
  }
  mainTemplate() {
    return html`
    <div class="flex flex-col h-screen bg-gray-200 pt-4">
      <h1 class="flex justify-center text-red-600 font-bold text-3xl opacity-75">todos</h1>
      <div class="flex justify-center p-4">
        <div class="flex flex-col p-2 border-solid w-4/12 rounded bg-white">
          <div class="flex">
            ${this.selectAll
            ? html`<label class="text-bold text-gray-900 text-rotate-90 p-2" @click=${this.completeAll}>></label>`
            : html`<label class="text-bold text-gray-400 text-rotate-90 p-2" @click=${this.completeAll}>></label>`
            }
            <input class="border-2 m-2 p-1" type="text" @keypress=${this.handleNewItem} placeholder="What needs to be done?">
          </div>
          ${this.items.length > 0 ? this.listTemplate() : ''}
          ${this.navTemplate()}
        </div>
      </div>
    </div>
    `
  }
  listTemplate() {
    let toShow = [];
    if (this.mode === 'completed') {
      toShow = this.items.filter(x => x.checked)
    } else if (this.mode === 'active') {
      toShow = this.items.filter(x => !x.checked)
    } else {
      toShow = this.items
    }
    return html`
      <ul>
        ${toShow.map((x, i) => this.singleItem(x, i))}
      </ul>
    `
  }
  singleItem(x, i) {
    return html`
      <li class="px-2 flex justify-between border-b p-2" @mouseover=${_e => this.hovering(i)} @mouseleave=${_e => this.hoveringEnded()}>
        <input type="checkbox" class="mx-1" .checked=${x.checked} @change=${e => this.checkItem(i, e.currentTarget.checked)} />
        ${x.checked ? 
          html`<label class="w-full mx-2 break-all line-through">${x.value}</label>` : 
          html`<label class="w-full mx-2 break-all">${x.value}</label>`}
        ${this.hoveringIndex === i
          ? html`<button class="flex-none block w-4 mx-2 font-sans" @click=${_e => this.deleteItem(i)}>x</button>`
          : ''
        }
      </li>
    `
  }
  navTemplate() {
    let modes = ['all', 'active', 'completed']
    return html`
    <div class="flex justify-between">
      <div class="flex initial">
        ${this.stats()}
        ${modes.map(mode => {
          return html`
            ${this.mode === mode 
              ? html`<div @click=${_e => this.changeMode(mode)} class="border-red-700 border-b">
                <p class="p-2">${mode}</p>
              </div>`
              : html`<div @click=${_e => this.changeMode(mode)}>
                <p class="p-2">${mode}</p>
              </div>`
            }
            `
          })}
        </div>
        ${this.showClearAll
          ? html`<p class="p-2" @click=${this.deleteAll}>clear all</p>`
          : ''
        }
      </div>
      `
  }
  stats() {
    let actives = this.items.filter(x => !x.checked).length;
    if (this.items.length === 0) {return html``} 
    else if (actives < 2) {return html `<p class="m-2">${actives} item left</p>`}
    else {return html`<p class="m-2">${actives} items left</p>`}
  }
  show() {
    render(this.mainTemplate(), this.target, {eventContext: this});
  }
}

const app = new App({target: document.body, items: [{value: 'sample', checked: false}]});
app.show();
