import getCaretCoordinates from "textarea-caret";

function getCursorWord(props) {
  let {
    value,
    selection: { start, end }
  } = props;

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

export default function deriveCursorState(el, props) {
  const word = getCursorWord(props);
  const cursor = getCaretCoordinates(el, word.start);
  const top = el.offsetTop + cursor.top + cursor.height - el.scrollTop;
  const left = el.offsetLeft + cursor.left - el.scrollLeft;
  const inYBounds =
    el.offsetTop <= top && top <= el.offsetTop + el.offsetHeight;
  const inXBounds =
    el.offsetLeft <= left && left <= el.offsetLeft + el.offsetWidth;
  const isHidden = !inYBounds || !inXBounds;
  return { word, coordinates: { top, left }, isHidden };
}
