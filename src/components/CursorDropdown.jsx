import React, { Component } from "react";
import PropTypes from "prop-types";
import { DropdownContext } from "./WithCursorDropdown.jsx";

import styles from "../styles.css";

export default class CursorDropdown extends Component {
  static propTypes = {
    pattern: PropTypes.instanceOf(RegExp).isRequired,
    component: PropTypes.oneOfType([
      PropTypes.node.isRequired,
      PropTypes.func.isRequired
    ])
  };

  render() {
    return (
      <DropdownContext.Consumer>
        {context => {
          const { cursor, handleDropdownChange } = context;
          // NOTE: the provided regex needs to have a capture group
          const match = cursor.value.match(this.props.pattern);
          return match
            ? React.createElement(this.props.component, {
                filterText: match[1],
                onChange: handleDropdownChange
              })
            : null;
        }}
      </DropdownContext.Consumer>
    );
  }
}
