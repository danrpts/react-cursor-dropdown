import React, { Component } from "react";
import PropTypes from "prop-types";
import getCaretCoordinates from "textarea-caret";

import styles from "./styles.css";

const KeywordContext = React.createContext("");

function WithCaretDropdown(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        caret: {
          top: 0,
          left: 0
        },
        keyword: "",
        visible: true
      };

      this.updateState = el => {
        const keyword = getCaretWord(el).word;
        const caret = getCaretCoordinates(el, el.selectionStart);
        const top = el.offsetTop + caret.top + caret.height - el.scrollTop;
        const left = el.offsetLeft + caret.left - el.scrollLeft;

        const inYBounds =
          el.offsetTop <= top && top <= el.offsetTop + el.offsetHeight;
        const inXBounds =
          el.offsetLeft <= left && left <= el.offsetLeft + el.offsetWidth;

        this.setState({
          caret: {
            top,
            left
          },
          keyword,
          display: inYBounds && inXBounds ? "block" : "none"
        });
      };

      this.onScroll = e => {
        this.updateState(e.target);
        this.props.onScroll && this.props.onScroll(e);
      };
      this.onSelect = e => {
        this.updateState(e.target);
        this.props.onSelect && this.props.onSelect(e);
      };
      this.onChange = e => {
        this.updateState(e.target);
        this.props.onChange && this.props.onChange(e);
      };
      this.onClick = e => {
        this.updateState(e.target);
        this.props.onClick && this.props.onClick(e);
      };
    }

    render() {
      const {
        children,
        onScroll, //ignore
        onSelect, //ignore
        onChange, //ignore
        onClick, //ignore
        ...rest
      } = this.props;
      return (
        <div className={styles.caretDropdownContainer}>
          <WrappedComponent
            onScroll={this.onScroll}
            onSelect={this.onSelect}
            onChange={this.onChange}
            onClick={this.onClick}
            {...rest}
          />
          <div
            className={styles.caretDropdown}
            style={{
              display: this.state.display,
              top: this.state.caret.top,
              left: this.state.caret.left
            }}
          >
            <KeywordContext.Provider value={this.state.keyword}>
              {children}
            </KeywordContext.Provider>
          </div>
        </div>
      );
    }
  };
}

function CaretDropdown({ pattern, component }) {
  return (
    <KeywordContext.Consumer>
      {keyword => {
        const match = keyword.match(pattern);
        return match && React.createElement(component, { match });
      }}
    </KeywordContext.Consumer>
  );
}

// Helper to get current selected word, or the word under the caret
function getCaretWord(el) {
  let start = el.selectionStart;
  let end = el.selectionEnd;
  let word = el.value.substring(start, end);
  if (start === end) {
    let wordLeft = el.value
      .substring(0, start)
      .split(/\s+/)
      .pop();
    let wordRight = el.value.substring(end).split(/\s+/)[0];
    word = wordLeft + wordRight;
    start -= wordLeft.length;
    end += wordRight.length;
  }

  return { word, start, end };
}

export { WithCaretDropdown, CaretDropdown };
