import { keyboardData } from "./keyboardData.js";
import { initKeyboardPage } from "./keyboardPage.js";

const keyboardObj = {};
const keyboardFragment = document.createElement("div");
keyboardFragment.classList.add("keyboard-container");

export class Keyboard {
  constructor() {
    this.lang = localStorage.getItem("language") === "ru" ? "ru" : "en";
    this.capsLock = false;
  }
  init() {
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
    initKeyboardPage(this.textarea, keyboardFragment);
    this._clickPhysicalKey();
    this._changeLanguage(this.lang);
  }

  _clickPhysicalKey() {
    document.addEventListener("keydown", (event) => {
      event.stopImmediatePropagation();
      let key = document.getElementById(event.code);
      if (!key) {
        event.preventDefault();
        return;
      }
      if (event.code === "CapsLock" && !event.repeat) {
        this.capsLock = !this.capsLock;
        if (this.capsLock) {
          key.classList.add("active");
        } else {
          key.classList.remove("active");
        }
        this._clickWithShift(event.shiftKey);
      } else {
        key.classList.add("active");
        if (event.code === "Backspace") {
          event.preventDefault();
          let pointForStart = Math.max(0, this.textarea.selectionStart - 1);
          this.textarea.value =
            this.textarea.value.slice(0, pointForStart) +
            this.textarea.value.slice(this.textarea.selectionEnd);
          this.textarea.selectionStart = pointForStart;
          this.textarea.selectionEnd = this.textarea.selectionStart;
        } else if (event.code === "Tab") {
          event.preventDefault();
          this.textarea.value =
            this.textarea.value.slice(0, this.textarea.selectionStart) +
            "\t" +
            this.textarea.value.slice(this.textarea.selectionEnd);
          this.textarea.selectionStart =
            this.textarea.selectionStart + "\t".length;
          this.textarea.selectionEnd = this.textarea.selectionStart;
        } else if (event.code === "Delete") {
          event.preventDefault();
          let pointForEnd = this.textarea.selectionEnd;
          if (pointForEnd < this.textarea.value.length) {
            let arrayOfValue = this.textarea.value.split("");
            arrayOfValue.splice(pointForEnd, 1);
            this.textarea.value = arrayOfValue.join("");
            this.textarea.selectionEnd = pointForEnd;
          }
        } else if (event.code === "Enter") {
          event.preventDefault();
          this.textarea.value += "\n";
        } else if (event.code === "Space") {
          event.preventDefault();
          this.textarea.value += " ";
        } else if (event.altKey && event.shiftKey && !event.repeat) {
          event.preventDefault();
          this.lang = this.lang === "ru" ? "en" : "ru";
          localStorage.setItem("language", this.lang);
          this._changeLanguage(this.lang);
        } else if (
          (event.code === "ShiftLeft" || event.code === "ShiftRight") &&
          !event.repeat
        ) {
          event.preventDefault();
          this._clickWithShift(event.shiftKey);
        } else if(event.code === "ArrowUp" || event.code === "ArrowDown" || event.code === "ArrowLeft" || event.code === "ArrowRight"){
          event.preventDefault();
          this._clickOnArrow();
        }
        else if (!keyboardObj[event.code].state) {
          this.textarea.value += key.textContent;
        }
      }
    });

    document.addEventListener("keyup", (event) => {
      event.stopImmediatePropagation();
      let key = document.getElementById(event.code);
      if (event.code !== "CapsLock") {
        key.classList.remove("active");
        if (event.code === "ShiftRight" || event.code === "ShiftLeft") {
          event.preventDefault();
          this._clickWithShift(event.shiftKey);
        }
      }
    });
  }
  _changeLanguage(lang){
    Array.from(keyboardFragment.querySelectorAll(".keyboard-btn")) .forEach((element) => {
      element.textContent = keyboardObj[element.id][lang];
    });

  }
  _clickWithShift(shiftKey) {}
  _clickOnArrow(){}
}
