# react-cursor-dropdown

> A React HOC for adding cursor dropdown menus to textareas and inputs - [Try it out!](https://superdan.io/react-cursor-dropdown/)


[![NPM](https://img.shields.io/npm/v/react-cursor-dropdown.svg)](https://www.npmjs.com/package/react-cursor-dropdown) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-cursor-dropdown
```

## Usage

```jsx
import React, { Component } from "react";

import { WithCursorDropdown, CursorDropdown } from "react-cursor-dropdown";

// Import the component you want to dropdown from the cursor
import SomeListComponent from "SomeListComponent";

const Input = props => <input {...props} />;
const InputCursorDropdown = WithCursorDropdown(Input);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };

    this.onChange = e => {
      this.setState({
        value: e.target.value
      });
    };
  }

  render() {
    return (
      <InputCursorDropdown
        value={this.state.value}
        onChange={this.onChange}
      >
        // Specify the regex to match against the current word (capture group required)
        <CursorDropdown pattern={/^:(\w*)$/} component={SomeListComponent} />
      </InputCursorDropdown>
    );
  }
}
```

## License

MIT © [danrpts](https://github.com/danrpts)
