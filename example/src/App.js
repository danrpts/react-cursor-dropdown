import React, { Component } from "react";
import { WithCursorDropdown, CursorDropdown } from "react-cursor-dropdown";
import EmojiList from "./EmojiList.js";
import MentionList from "./MentionList.js";
import { Container, Row, Col, Input, FormText } from "reactstrap";

import "bootstrap/dist/css/bootstrap.css";

// do not put this in render fn
const InputCursorDropdown = WithCursorDropdown(Input);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ":",
      selection: {
        start: 1,
        end: 1
      }
    };

    this.onChange = ({
      target: { value, selectionStart: start, selectionEnd: end }
    }) => {
      this.setState({
        value,
        selection: {
          start,
          end
        }
      });
    };
  }

  render() {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col sm="12" md="10" lg="8">
            <div className="text-center mb-5">
              <h1 className="display-4">react-cursor-dropdown</h1>
              <p className="lead">
                A React HOC for adding cursor dropdown menus to textareas and
                inputs.
              </p>
              <p>
                <a
                  className="github-button"
                  href="https://github.com/danrpts/react-cursor-dropdown"
                  data-icon="octicon-star"
                  data-size="large"
                  aria-label="Star danrpts/react-cursor-dropdown on GitHub"
                >
                  Star
                </a>
                <span className="ml-2">
                  <a
                    className="github-button"
                    href="https://github.com/danrpts/react-cursor-dropdown/fork"
                    data-icon="octicon-repo-forked"
                    data-size="large"
                    aria-label="Fork danrpts/react-cursor-dropdown on GitHub"
                  >
                    Fork
                  </a>
                </span>
              </p>
            </div>
            <FormText color="muted">
              Type to filter the emoji list, use the up/down arrows to move the
              highlight, and enter/tab to select.
            </FormText>
            <InputCursorDropdown
              rows="3"
              value={this.state.value}
              selection={this.state.selection}
              onChange={this.onChange}
              focusOnMount
            >
              <CursorDropdown pattern={/^:([\w+-]*)$/} component={EmojiList} />
            </InputCursorDropdown>
          </Col>
        </Row>
      </Container>
    );
  }
}
