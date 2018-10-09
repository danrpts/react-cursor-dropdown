import React, { Component } from "react";
import PropTypes from "prop-types";
import getCaretCoordinates from "textarea-caret";

import styles from "./styles.css";

const DropdownContext = React.createContext({});

function WithCaretDropdown(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.inputRefWrapper = React.createRef();
      this.replaceKeyword = this.replaceKeyword.bind(this);

      this.state = {
        keyword: { value: "", start: 0, end: 0 },
        caret: { top: 0, left: 0, display: "none" }
      };
    }

    replaceKeyword(replacement) {
      const { start, end } = this.state.keyword;

      const value =
        this.props.value.substring(0, start) +
        replacement +
        this.props.value.substring(end);

      this.props.onChange({
        // pass up like its an event object
        target: {
          value,
          selectionStart: end,
          selectionEnd: end
        }
      });
    }

    componentDidUpdate(_, prevState) {
      const input = this.inputRefWrapper.current.firstChild;
      const keyword = deriveKeywordState(this.props);
      const caret = deriveCaretState(input, this.props);

      if (
        prevState.keyword.value != keyword.value ||
        prevState.keyword.start != keyword.start ||
        prevState.keyword.end != keyword.end ||
        prevState.caret.top != caret.top ||
        prevState.caret.left != caret.left ||
        prevState.caret.display != caret.display
      ) {
        this.setState({
          keyword,
          caret
        });
      }
    }

    render() {
      const { children, ...rest } = this.props;

      return (
        <div className={styles.caretDropdownContainer}>
          <div ref={this.inputRefWrapper}>
            <WrappedComponent {...rest} />
          </div>
          <div className={styles.caretDropdown} style={this.state.caret}>
            <DropdownContext.Provider
              value={{
                keyword: this.state.keyword.value,
                replace: this.replaceKeyword
              }}
            >
              {children}
            </DropdownContext.Provider>
          </div>
        </div>
      );
    }
  };
}

function CaretDropdown(props) {
  const { prefix = "", suffix = "", affix = true, component } = props;

  return (
    <DropdownContext.Consumer>
      {context => {
        const { keyword, replace } = context;
        const match = keyword.startsWith(prefix);
        const affixed = value => prefix + value + suffix;
        const onClick = value => replace(affix ? affixed(value) : value);
        return (
          match &&
          React.createElement(component, {
            value: keyword.slice(1),
            onClick
          })
        );
      }}
    </DropdownContext.Consumer>
  );
}

// Helper to get current selected word, or the word under the caret
function deriveKeywordState(props) {
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
  const keyword = value.substring(start, end);
  return { value: keyword, start, end };
}

// TODO: remove dependence on el
const deriveCaretState = (el, props) => {
  const {
    selection: { start }
  } = props;

  const caret = getCaretCoordinates(el, start);
  const top = el.offsetTop + caret.top + caret.height - el.scrollTop;
  const left = el.offsetLeft + caret.left - el.scrollLeft;
  const inYBounds =
    el.offsetTop <= top && top <= el.offsetTop + el.offsetHeight;
  const inXBounds =
    el.offsetLeft <= left && left <= el.offsetLeft + el.offsetWidth;
  const display = inYBounds && inXBounds ? "block" : "none";
  return { top, left, display };
};

export { WithCaretDropdown, CaretDropdown };
