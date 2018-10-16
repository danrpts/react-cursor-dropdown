import React, { Component } from "react";
import deriveCursorState from "./deriveCursorState.js";

import styles from "../styles.css";

const DropdownContext = React.createContext({});

function WithCursorDropdown(WrappedComponent) {
  class InputWithCursorDropdown extends Component {
    // TODO:
    // static propTypes = {
    //   onDropdownChange: PropTypes.func,
    //   forwardedRef: PropTypes.node
    // };

    constructor(props) {
      super(props);
      this.wrapperRef = React.createRef();
      this.handleDropdownChange = this.handleDropdownChange.bind(this);
      this.state = {
        cursor: {
          word: { value: "", start: 0, end: 0 },
          coordinates: { top: 0, left: 0 },
          isInBounds: true
        }
      };
    }

    getInput() {
      return this.props.forwardedRef
        ? this.props.forwardedRef.current
        : this.wrapperRef.current.firstChild;
    }

    handleDropdownChange(value) {
      this.props.onDropdownChange({
        value,
        cursor: this.state.cursor.word
      });
      this.getInput().focus();
    }

    componentDidMount() {
      this.setState({
        cursor: deriveCursorState(this.getInput())
      });
    }

    componentDidUpdate(_, prevState) {
      const cursor = deriveCursorState(this.getInput());
      if (
        cursor.word.start !== prevState.cursor.word.start ||
        cursor.word.end !== prevState.cursor.word.end ||
        cursor.isInBounds !== prevState.cursor.isInBounds
      ) {
        // NOTE: coordinates change iff start changes
        this.setState({
          cursor
        });
      }
    }

    render() {
      const {
        children,
        onCursorDropdownChange, // just toremove from passed remainingProps
        forwardedRef,
        ...remainingProps
      } = this.props;
      return (
        <div className={styles.cursorDropdownContainer}>
          <div ref={this.wrapperRef}>
            <WrappedComponent ref={forwardedRef} {...remainingProps} />
          </div>
          <div
            className={styles.cursorDropdown}
            style={{
              ...this.state.cursor.coordinates,
              marginTop: this.state.cursor.height
            }}
            hidden={!this.state.cursor.isInBounds}
          >
            <DropdownContext.Provider
              value={{
                cursor: this.state.cursor.word,
                handleDropdownChange: this.handleDropdownChange
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
