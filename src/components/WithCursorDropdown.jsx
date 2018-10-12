import React, { Component } from "react";
import PropTypes from "prop-types";
import deriveCursorState from "./deriveCursorState.js";

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
      return this.props.forwardRef
        ? this.props.forwardRef.current
        : this.inputWrapperRef.current.firstChild;
    }

    componentDidMount() {
      this.setState({
        cursor: deriveCursorState(this.getInput(), this.props)
      });
      // this might change (keep focus state instead?)
      if (this.props.focusOnMount) {
        this.getInput().focus();
      }
    }

    componentDidUpdate(prevProps) {
      if (
        this.props.value !== prevProps.value ||
        this.props.selection.start !== prevProps.selection.start ||
        this.props.selection.end !== prevProps.selection.end
      ) {
        this.setState({
          cursor: deriveCursorState(this.getInput(), this.props)
        });
        this.getInput().focus();
      }
    }

    render() {
      const { children, forwardedRef, ...remainingProps } = this.props;
      return (
        <div className={styles.cusorDropdownContainer}>
          <div ref={this.inputWrapperRef}>
            <WrappedComponent ref={forwardedRef} {...remainingProps} />
          </div>
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
