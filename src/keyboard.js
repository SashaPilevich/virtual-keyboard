import { keyboardData } from './keyboardData.js';
import { initKeyboardPage } from './keyboardPage.js';
/* eslint-disable no-param-reassign */
const keyboardObj = {};
const keyboardFragment = document.createElement('div');
keyboardFragment.classList.add('keyboard-container');

export class Keyboard {
  constructor() {
    this.lang = localStorage.getItem('language') === 'ru' ? 'ru' : 'en';
    this.capsLock = false;
  }

  init() {
    this.textarea = document.createElement('textarea');
    this.textarea.classList.add('textarea-keyboard');
    this.textarea.setAttribute('rows', 10);
    this.textarea.setAttribute('cols', 110);
    keyboardData.forEach((array) => {
      const keyboardRow = document.createElement('div');
      keyboardRow.classList.add('keyboard-row');
      array.forEach((key) => {
        keyboardObj[key.code] = key.lang;
        keyboardObj[key.code].state = key.state;
        const keyBtn = document.createElement('button');
        keyBtn.setAttribute('id', key.code);
        keyBtn.classList.add('keyboard-btn');
        keyBtn.classList.add(`keyboard-btn-${key.size}`);
        keyBtn.textContent = key.lang.en;
        keyboardRow.append(keyBtn);
      });
      keyboardFragment.append(keyboardRow);
    });
    initKeyboardPage(this.textarea, keyboardFragment);
    this.clickPhysicalKey();
    this.clickVirtualKey();
    this.changeLanguage(this.lang);
  }

  clickPhysicalKey() {
    document.addEventListener('keydown', (event) => {
      this.textarea.blur();
      event.stopImmediatePropagation();
      const key = document.getElementById(event.code);
      if (!key) {
        event.preventDefault();
        return;
      }
      if (event.code === 'CapsLock' && !event.repeat) {
        this.capsLock = !this.capsLock;
        if (this.capsLock) {
          key.classList.add('active');
        } else {
          key.classList.remove('active');
        }
        this.clickWithShift(event.shiftKey);
      } else if (event.metaKey) {
        key.classList.add('active');
      } else {
        key.classList.add('active');
        if (event.code === 'Backspace') {
          event.preventDefault();
          this.clickOnBackspace();
        } else if (event.code === 'Tab') {
          event.preventDefault();
          this.clickOnTab();
        } else if (event.code === 'Delete') {
          event.preventDefault();
          this.clickOnDelete();
        } else if (event.code === 'Enter') {
          event.preventDefault();
          this.clickOnEnter();
        } else if (event.code === 'Space') {
          event.preventDefault();
          this.clickOnSpace();
        } else if (event.altKey && event.shiftKey && !event.repeat) {
          event.preventDefault();
          this.lang = this.lang === 'ru' ? 'en' : 'ru';
          localStorage.setItem('language', this.lang);
          this.changeLanguage(this.lang);
        } else if (
          (event.code === 'ShiftLeft' || event.code === 'ShiftRight')
          && !event.repeat
        ) {
          event.preventDefault();
          this.clickWithShift(event.shiftKey);
        } else if (
          event.code === 'ArrowUp'
          || event.code === 'ArrowDown'
          || event.code === 'ArrowLeft'
          || event.code === 'ArrowRight'
        ) {
          event.preventDefault();
          this.clickOnArrow(event.code);
        } else if (!keyboardObj[event.code].state) {
          this.printLetter(key.textContent);
        }
      }
    });

    document.addEventListener('keyup', (event) => {
      event.stopImmediatePropagation();
      this.textarea.focus();
      const key = document.getElementById(event.code);
      if (event.code !== 'CapsLock') {
        key.classList.remove('active');
        if (event.code === 'ShiftRight' || event.code === 'ShiftLeft') {
          event.preventDefault();
          this.clickWithShift(event.shiftKey);
        }
      }
    });
  }

  clickVirtualKey() {
    Array.from(keyboardFragment.querySelectorAll('.keyboard-btn')).forEach(
      (element) => {
        this.textarea.focus();
        element.addEventListener('mousedown', (event) => {
          element.classList.add('active');
          if (!keyboardObj[element.id].state) {
            this.printLetter(element.textContent);
          } else if (element.id === 'Backspace') {
            event.preventDefault();
            this.clickOnBackspace();
          } else if (element.id === 'Delete') {
            event.preventDefault();
            this.clickOnDelete();
          } else if (element.id === 'Tab') {
            event.preventDefault();
            this.clickOnTab();
          } else if (element.id === 'Enter') {
            event.preventDefault();
            this.clickOnEnter();
          } else if (element.id === 'Space') {
            event.preventDefault();
            this.clickOnSpace();
          } else if (
            (element.id === 'ShiftLeft' || element.id === 'ShiftRight')
            && !event.repeat
          ) {
            event.preventDefault();
            this.clickWithShift(true);
          } else if (
            element.id === 'ArrowUp'
            || element.id === 'ArrowDown'
            || element.id === 'ArrowLeft'
            || element.id === 'ArrowRight'
          ) {
            event.preventDefault();
            this.clickOnArrow(element.id);
          } else if (element.id === 'CapsLock' && !event.repeat) {
            this.capsLock = !this.capsLock;
            if (this.capsLock) {
              element.classList.add('active');
            } else {
              element.classList.remove('active');
            }
            this.clickWithShift(event.shiftKey);
          }
        });
        element.addEventListener('mouseup', (event) => {
          this.textarea.focus();
          if (element.id !== 'CapsLock') {
            element.classList.remove('active');
            if (element.id === 'ShiftRight' || element.id === 'ShiftLeft') {
              event.preventDefault();
              this.clickWithShift(event.shiftKey);
            }
          }
        });
      },
    );
  }

  changeLanguage() {
    Array.from(keyboardFragment.querySelectorAll('.keyboard-btn')).forEach(
      (element) => {
        element.textContent = keyboardObj[element.id][this.lang];
      },
    );
  }

  clickWithShift(shiftKey) {
    const isUpperCase = (this.capsLock && !shiftKey) || (!this.capsLock && shiftKey);
    const currentCase = isUpperCase ? 'toUpperCase' : 'toLowerCase';
    Array.from(keyboardFragment.querySelectorAll('.keyboard-btn')).forEach(
      (key) => {
        if (!keyboardObj[key.id].state) {
          if (key.id === 'Backquote') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '~' : '`';
            } else {
              key.textContent = shiftKey ? 'Ё' : 'ё';
              key.textContent = this.capsLock ? 'Ё' : 'ё';
            }
          } else if (key.id === 'Digit1') {
            key.textContent = shiftKey ? '!' : '1';
          } else if (key.id === 'Digit2') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '@' : '2';
            } else {
              key.textContent = shiftKey ? '"' : '2';
            }
          } else if (key.id === 'Digit3') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '#' : '3';
            } else {
              key.textContent = shiftKey ? '№' : '3';
            }
          } else if (key.id === 'Digit4') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '$' : '4';
            } else {
              key.textContent = shiftKey ? ';' : '4';
            }
          } else if (key.id === 'Digit5') {
            key.textContent = shiftKey ? '%' : '5';
          } else if (key.id === 'Digit6') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '^' : '6';
            } else {
              key.textContent = shiftKey ? ':' : '6';
            }
          } else if (key.id === 'Digit7') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '&' : '7';
            } else {
              key.textContent = shiftKey ? '?' : '7';
            }
          } else if (key.id === 'Digit8') {
            key.textContent = shiftKey ? '*' : '8';
          } else if (key.id === 'Digit9') {
            key.textContent = shiftKey ? '(' : '9';
          } else if (key.id === 'Digit0') {
            key.textContent = shiftKey ? ')' : '0';
          } else if (key.id === 'Equal') {
            key.textContent = shiftKey ? '+' : '=';
          } else if (key.id === 'Minus') {
            key.textContent = shiftKey ? '_' : '-';
          } else if (key.id === 'Backslash') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '|' : '\\';
            } else {
              key.textContent = shiftKey ? '//' : '\\';
            }
          } else if (key.id === 'BracketRight') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '}' : ']';
            } else {
              key.textContent = shiftKey ? 'Ъ' : 'ъ';
              key.textContent = this.capsLock ? 'Ъ' : 'ъ';
            }
          } else if (key.id === 'BracketLeft') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '{' : '[';
            } else {
              key.textContent = shiftKey ? 'Х' : 'х';
              key.textContent = this.capsLock ? 'Х' : 'х';
            }
          } else if (key.id === 'Quote') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '"' : "'";
            } else {
              key.textContent = shiftKey ? 'Э' : 'э';
              key.textContent = this.capsLock ? 'Э' : 'э';
            }
          } else if (key.id === 'Semicolon') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? ':' : ';';
            } else {
              key.textContent = shiftKey ? 'Ж' : 'ж';
              key.textContent = this.capsLock ? 'Ж' : 'ж';
            }
          } else if (key.id === 'Comma') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '<' : ',';
            } else {
              key.textContent = shiftKey ? 'Б' : 'б';
              key.textContent = this.capsLock ? 'Б' : 'б';
            }
          } else if (key.id === 'Period') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '>' : '.';
            } else {
              key.textContent = shiftKey ? 'Ю' : 'ю';
              key.textContent = this.capsLock ? 'Ю' : 'ю';
            }
          } else if (key.id === 'Slash') {
            if (this.lang === 'en') {
              key.textContent = shiftKey ? '?' : '/';
            } else {
              key.textContent = shiftKey ? ',' : '.';
            }
          } else {
            key.textContent = key.textContent[currentCase]();
          }
        }
      },
    );
  }

  clickOnBackspace() {
    const pointForStart = Math.max(0, this.textarea.selectionStart - 1);
    this.textarea.value = this.textarea.value.slice(0, pointForStart)
      + this.textarea.value.slice(this.textarea.selectionEnd);
    this.textarea.selectionStart = pointForStart;
    this.textarea.selectionEnd = this.textarea.selectionStart;
  }

  clickOnDelete() {
    const pointForEnd = this.textarea.selectionEnd;
    if (pointForEnd < this.textarea.value.length) {
      const arrayOfValue = this.textarea.value.split('');
      arrayOfValue.splice(pointForEnd, 1);
      this.textarea.value = arrayOfValue.join('');
      this.textarea.selectionEnd = pointForEnd;
    }
  }

  clickOnTab() {
    let cursorPosition = this.textarea.selectionStart;
    const leftValue = this.textarea.value.slice(0, cursorPosition);
    const rightValue = this.textarea.value.slice(cursorPosition);
    this.textarea.value = `${leftValue}\t${rightValue}`;
    cursorPosition += 1;
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }

  clickOnEnter() {
    let cursorPosition = this.textarea.selectionStart;
    const leftValue = this.textarea.value.slice(0, cursorPosition);
    const rightValue = this.textarea.value.slice(cursorPosition);
    this.textarea.value = `${leftValue}\n${rightValue}`;
    cursorPosition += 1;
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }

  clickOnSpace() {
    let cursorPosition = this.textarea.selectionStart;
    const leftValue = this.textarea.value.slice(0, cursorPosition);
    const rightValue = this.textarea.value.slice(cursorPosition);
    this.textarea.value = `${leftValue} ${rightValue}`;
    cursorPosition += 1;
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }

  clickOnArrow(element) {
    let cursorPosition = this.textarea.selectionStart;
    const leftValue = this.textarea.value.slice(0, cursorPosition);
    const rightValue = this.textarea.value.slice(cursorPosition);
    if (element === 'ArrowUp') {
      if (leftValue.lastIndexOf('\n') === -1) {
        cursorPosition = 0;
      } else {
        cursorPosition -= leftValue.slice(leftValue.lastIndexOf('\n')).length;
      }
    } else if (element === 'ArrowDown') {
      if (rightValue.indexOf('\n') === -1) {
        cursorPosition += rightValue.length;
      } else {
        cursorPosition += rightValue.indexOf('\n') + 1;
      }
    } else if (element === 'ArrowLeft') {
      cursorPosition = (cursorPosition < 1) ? 0 : cursorPosition - 1;
    } else if (element === 'ArrowRight') {
      cursorPosition += 1;
    }
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }

  printLetter(element) {
    let cursorPosition = this.textarea.selectionStart;
    const leftValue = this.textarea.value.slice(0, cursorPosition);
    const rightValue = this.textarea.value.slice(cursorPosition);
    this.textarea.value = `${leftValue}${element}${rightValue}`;
    cursorPosition += 1;
    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
  }
}
