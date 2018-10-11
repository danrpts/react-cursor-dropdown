import React, { Component } from "react";
import { WithCursorDropdown, CursorDropdown } from "react-cursor-dropdown";
import EmojiList from "./EmojiList.js";
import MentionList from "./MentionList.js";
import { Container, Row, Col, Input } from "reactstrap";

import "bootstrap/dist/css/bootstrap.css";

// do not put this in render fn
const InputCursorDropdown = WithCursorDropdown(Input);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      selection: {
        start: 0,
        end: 0
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
            <InputCursorDropdown
              rows="3"
              value={this.state.value}
              selection={this.state.selection}
              onChange={this.onChange}
            >
              <CursorDropdown pattern={/^:([\w+-]*)$/} component={EmojiList} />
              <CursorDropdown pattern={/^@(\w*)$/} component={MentionList} />
            </InputCursorDropdown>
          </Col>
        </Row>
      </Container>
    );
  }
}