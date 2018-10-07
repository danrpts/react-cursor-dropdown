import React, { Component } from "react";
import PropTypes from "prop-types";
import getCaretCoordinates from "textarea-caret";

import styles from "./styles.css";

function getCaretWord(el) {
  let start = el.selectionStart;
  let end = el.selectionEnd;
  let word = el.value.substring(start, end);
  // if there is no selection, grab the word under the caret
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

const WithCaretDropdown = WrappedInputComponent => (
  ...WrappedListComponents
) => {
  return class CaretDropdown extends Component {
    constructor(props) {
      super(props);
      this.state = {
        caret: {
          top: 0,
          left: 0
        },
        keyword: "",
        show: false
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
    }

    handleChange(e) {
      const { onChange } = this.props;
      this.updateState(e.target);
      onChange && onChange(e);
    }
    handleClick(e) {
      const { onClick } = this.props;
      this.updateState(e.target);
      onClick && onClick(e);
    }
    handleSelect(e) {
      const { onSelect } = this.props;
      this.updateState(e.target);
      onSelect && onSelect(e);
    }
    handleScroll(e) {
      const { onScroll } = this.props;
      this.updateState(e.target);
      onScroll && onScroll(e);
    }

    updateState(el) {
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
        show: inYBounds && inXBounds
      });
    }

    render() {
      return (
        <div className={styles.caretDropdownContainer}>
          <WrappedInputComponent
            {...this.props}
            onChange={this.handleChange}
            onClick={this.handleClick} // resize event
            onSelect={this.handleSelect}
            onScroll={this.handleScroll}
          />
          <div
            className={styles.caretDropdown}
            style={{
              top: this.state.caret.top,
              left: this.state.caret.left
            }}
          >
            {WrappedListComponents.map((List, i) => (
              <List
                key={i}
                keyword={this.state.keyword}
                visible={this.state.show}
              />
            ))}
          </div>
        </div>
      );
    }
  };
};

export default WithCaretDropdown;
