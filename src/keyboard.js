import { keyboardData } from "./keyboardData.js";
import { initKeyboardPage } from "./keyboardPage.js";

const keyboardObj = {};
const keyboardFragment = document.createElement("div");
keyboardFragment.classList.add("keyboard-container");

export class Keyboard {
  constructor(){
    this.lang = localStorage.getItem("language") === "ru" ? "ru" : "en";
    this.capsLock = false;
  }
  init(){
    this.textarea = document.createElement("textarea");
    this.textarea.classList.add("textarea-keyboard");
    this.textarea.setAttribute("rows", 10);
    this.textarea.setAttribute("cols", 110);
    for (let array of keyboardData) {
      let keyboardRow = document.createElement("div");
      keyboardRow.classList.add("keyboard-row");
      for (let key of array) {
        keyboardObj[key.code] = key.lang;
        keyboardObj[key.code].state = key.state;
        let keyBtn = document.createElement("button");
        keyBtn.setAttribute("id", key.code);
        keyBtn.classList.add("keyboard-btn");
        keyBtn.classList.add(`keyboard-btn-${key.size}`);
        keyBtn.textContent = key.lang.en;
        keyboardRow.append(keyBtn);
      }
      keyboardFragment.append(keyboardRow);
    }
    initKeyboardPage(this.textarea,keyboardFragment)
  }
}
