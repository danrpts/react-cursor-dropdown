import React, { Component } from "react";
import PropTypes from "prop-types";
import { DropdownContext } from "./WithCursorDropdown.jsx";

import styles from "../styles.css";

export default class CursorDropdown extends Component {
  static propTypes = {
    pattern: PropTypes.instanceOf(RegExp).isRequired,
    component: PropTypes.element.isRequired
  };

  render() {
    return (
      <DropdownContext.Consumer>
        {context => {
          const { cursor, onClick } = context;
          const match = cursor.word.value.match(this.props.pattern);
          return match
            ? React.createElement(this.props.component, {
                filterText: match[1],
                onClick: value => onClick(value)
              })
            : null;
        }}
      </DropdownContext.Consumer>
    );
  }
}
