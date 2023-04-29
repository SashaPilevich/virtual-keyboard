export const initKeyboardPage=(textarea,keyboard)=>{
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("main-container");
  const title = document.createElement("h1");
  title.classList.add("title");
  title.textContent = "Virtual Keyboard for Windows";
  const hotKeysInformation = document.createElement("p");
  hotKeysInformation.classList.add("hot-keys-information");
  hotKeysInformation.textContent = "Use Alt + Shift for change language.";
  mainContainer.append(title,hotKeysInformation,textarea,keyboard)
  document.body.append(mainContainer);
}