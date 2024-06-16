"use strict";

export class SplitText {
  #options = {
    charClass: "aki__char",
    wordClass: "aki__word",
    lineClass: "aki__line",
    globalClass: "aki_wrapper",
    emptySpaceName: "__AKI__EMPTY__SPACE__",
  };

  #rawChars = [];
  chars = [];
  #rawWords = [];
  words = [];
  lines = [];
  target = null;
  textContent = null;

  constructor(elementOrSelector) {
    this.init(elementOrSelector);
  }

  #isElement(obj) {
    return obj instanceof HTMLElement;
  }

  #createElement(tagname, content = "", htmlAttributes = {}, ...cssClass) {
    const element = document.createElement(tagname);
    element.classList.add(...cssClass);
    element.innerHTML = content;

    for (const [key, value] of Object.entries(htmlAttributes)) {
      element.setAttribute(key, value);
    }

    return element;
  }

  #splitChars() {
    const textChars = [...this.textContent];

    textChars.forEach((char) => {
      const charElement = this.#createElement(
        "span",
        char,
        {},
        this.#options.charClass
      );

      this.#rawChars.push(char === " " ? " " : charElement);
      this.chars.push(charElement);
    });
    this.#rawChars.push(" ");
  }

  #splitWords() {
    let startIndex = 0;
    this.#rawChars.forEach((rawChar, index) => {
      if (rawChar === " ") {
        const wordArray = this.#rawChars.slice(startIndex, index).filter((char) => char !== " ");

        const wordSpan = this.#createElement(
          "span",
          "",
          {},
          this.#options.wordClass
        );

        wordArray.forEach((char) => wordSpan.append(char));

        this.words.push(wordSpan);
        this.#rawWords.push(wordSpan, " ");
        startIndex = index + 1;
      }
    });
  }

  #splitLines() {
    const lineArrays = [];
    let startIndex = 0;

    this.words.reduce((prevOffsetTop, word, index) => {
      const currentOffsetTop = word.offsetTop;

      if (prevOffsetTop !== currentOffsetTop && prevOffsetTop !== null) {
        const lineArray = this.words.slice(startIndex, index);
        lineArrays.push(lineArray);
        startIndex = index;
      }

      if (index === this.words.length - 1) {
        const lineArray = this.words.slice(startIndex, index + 1);
        lineArrays.push(lineArray);
      }

      return currentOffsetTop;
    }, null);

    this.#appendLines(lineArrays);
  }

  #appendLines(lineArrays) {
    lineArrays.forEach((lineArray) => {
      const lineSpan = this.#createElement(
        "span",
        "",
        {},
        this.#options.lineClass
      );

      lineArray.forEach((word) => {
        lineSpan.append(word);
        lineSpan.append(" ");
      });

      this.lines.push(lineSpan);
      this.target.append(lineSpan);
    });
  }

  #combineAll() {
    this.words.forEach((word) => {
      this.target.append(word);
      this.target.append(" ");
    });
    this.#splitLines();
  }

  #splitStart() {
    this.#splitChars();
    this.#splitWords();
    this.#combineAll();
  }

  #getTextContent() {
    this.textContent = this.target.textContent;
  }

  #clearContent(element) {
    element.innerHTML = "";
  }

  #logError(message) {
    console.error(message);
  }

  #logAndThrowError(message) {
    this.#logError(message);
    throw new Error("SplitTextException: " + message);
  }

  init(elementOrSelector) {
    if (this.#isElement(elementOrSelector)) {
      this.target = elementOrSelector;
      this.#getTextContent();
    } else {
      const element = document.querySelector(elementOrSelector);
      if (element) {
        this.target = element;
        this.#getTextContent();
      } else {
        this.#logAndThrowError(`Cannot find element with selector "${elementOrSelector}" in DOM tree!`);
      }
    }

    this.#clearContent(this.target);
    this.#splitStart();
  }
}
