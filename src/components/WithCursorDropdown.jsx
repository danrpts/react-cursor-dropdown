import React, { Component } from "react";
import PropTypes from "prop-types";
import deriveCursorState from "./deriveCursorState.js";

import styles from "../styles.css";

const DropdownContext = React.createContext({});

function WithCursorDropdown(WrappedComponent) {
  class InputWithCursorDropdown extends Component {
    constructor(props) {
      super(props);
      this.substituteRef = React.createRef();
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

      // simulate event object; this might change
      this.props.onChange({
        target: {
          value,
          selectionStart: value.length,
          selectionEnd: value.length
        }
      });
    }

    getInput() {
      return this.props.forwardedRef
        ? this.props.forwardedRef.current
        : this.substituteRef.current;
    }

    componentDidMount() {
      const input = this.getInput();
      const cursor = deriveCursorState(input);
      this.setState({
        cursor
      });
      input.focus(); // TODO: is this ideal behavior?
    }

    componentDidUpdate(prevProps) {
      if (this.props.value !== prevProps.value) {
        const input = this.getInput();
        this.setState({
          cursor: deriveCursorState(input, this.props)
        });
      }
    }

    render() {
      const { children, forwardedRef, ...remainingProps } = this.props;
      const ref = forwardedRef ? forwardedRef : this.substituteRef;
      return (
        <div className={styles.cursorDropdownContainer}>
          <WrappedComponent ref={ref} {...remainingProps} />
          <div
            className={styles.cursorDropdown}
            style={this.state.cursor.coordinates}
          >
            <DropdownContext.Provider
              value={{
                cursor: this.state.cursor,
                onClick: this.replaceCursorWord
              }}
            >
              {children}
            </DropdownContext.Provider>
          </div>
        </div>
      );
    }
  }

  return React.forwardRef((props, ref) => {
    return <InputWithCursorDropdown {...props} forwardedRef={ref} />;
  });
}

export { WithCursorDropdown, DropdownContext };
