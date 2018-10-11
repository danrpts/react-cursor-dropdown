import React, { Component } from "react";
import PropTypes from "prop-types";
import getCaretCoordinates from "textarea-caret";

import styles from "../styles.css";

const DropdownContext = React.createContext({});

function WithCursorDropdown(WrappedComponent) {
  class InputWithCursorDropdown extends Component {
    constructor(props) {
      super(props);
      this.inputWrapperRef = React.createRef();
      this.replaceCursorWord = this.replaceCursorWord.bind(this);
      this.state = {
        cursor: {
          word: { value: "", start: 0, end: 0 },
          coordinates: { top: 0, left: 0 },
          isHidden: false
        }
      };
    }

    replaceCursorWord(replacementText = "") {
      const { start, end } = this.state.cursor.word;

      const value =
        this.props.value.substring(0, start) +
        replacementText +
        this.props.value.substring(end);

      const input = this.getInput();

      this.props.onChange({
        // pass up like it's an event object
        target: {
          value,
          selectionStart: value.length,
          selectionEnd: value.length
        }
      });

      // TODO: should this be here?
      input.focus();
    }

    getInput() {
      return this.props.forwardRef
        ? this.props.forwardRef.current
        : this.inputWrapperRef.current.firstChild;
    }

    componentDidUpdate(_, prevState) {
      const cursor = deriveCursorState(this.getInput(), this.props);
      if (
        cursor.word.value !== prevState.cursor.word.value ||
        cursor.word.start !== prevState.cursor.word.start ||
        cursor.word.end !== prevState.cursor.word.end ||
        cursor.coordinates.top !== prevState.cursor.coordinates.top ||
        cursor.coordinates.left !== prevState.cursor.coordinates.left
      ) {
        this.setState({
          cursor
        });
      }
    }

    render() {
      const { children, forwardedRef, ...remainingProps } = this.props;
      return (
        <div className={styles.cusorDropdownContainer}>
          <div ref={this.inputWrapperRef}>
            <WrappedComponent ref={forwardedRef} {...remainingProps} />
          </div>
          <DropdownContext.Provider
            value={{
              cursor: this.state.cursor,
              onClick: this.replaceCursorWord
            }}
          >
            {children}
          </DropdownContext.Provider>
        </div>
      );
    }
  }

  return React.forwardRef((props, ref) => {
    return <InputWithCursorDropdown {...props} forwardedRef={ref} />;
  });
}

// Helper to get current selected word, or the word under the cursor
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

// TODO: remove dependence on el ideas:
// 1) hoist cursor state
// 2) fork textarea-cursor
const deriveCursorState = (el, props) => {
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
};

export { WithCursorDropdown, DropdownContext };
