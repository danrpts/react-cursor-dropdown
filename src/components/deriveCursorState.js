import getCaretCoordinates from "./getCaretCoordinates.js";

function getCursorWord(el) {
  let { value, selectionStart: start, selectionEnd: end } = el;

  if (start === end) {
    let wordLeft = value
      .substring(0, start)
      .split(/\s+/)
      .pop();
    let wordRight = value.substring(end).split(/\s+/)[0];
    start -= wordLeft.length;
    end += wordRight.length;
  }
  const word = value.substring(start, end);
  return { value: word, start, end };
}

export default function deriveCursorState(el) {
  const word = getCursorWord(el);
  const caret = getCaretCoordinates(el, word.start);
  const top = el.offsetTop - el.scrollTop + caret.top;
  const left = el.offsetLeft - el.scrollLeft + caret.left;
  const inYBounds =
    el.offsetTop <= top && top <= el.offsetTop + el.offsetHeight;
  const inXBounds =
    el.offsetLeft <= left && left <= el.offsetLeft + el.offsetWidth;
  const isHidden = !inYBounds || !inXBounds;
  return {
    word,
    coordinates: { top, left },
    height: caret.height,
    isHidden
  };
}
