React Markdown (with Emojis and Components)
==================

[![npm version](https://img.shields.io/npm/v/react-markdown-loader.svg)](https://www.npmjs.com/package/react-markdown-loader)
[![build status](https://travis-ci.org/javiercf/react-markdown-loader.svg?branch=master)](https://travis-ci.org/javiercf/react-markdown-loader)
[![dependencies Status](https://david-dm.org/javiercf/react-markdown-loader/status.svg)](https://david-dm.org/javiercf/react-markdown-loader)
[![devDependencies Status](https://david-dm.org/javiercf/react-markdown-loader/dev-status.svg)](https://david-dm.org/javiercf/react-markdown-loader?type=dev)


This is a fork of [react-markdown-loader](https://github.com/javiercf/react-markdown-loader) with two subtle differences:

1. It renders React components without displaying its source code. The original npm package was used for a React styleguide so it displayed the React component along with its source code. This version just renders the React component because I wanted custom components inside Markdown files.
2. It supports emojis by using [remarkable-emoji](https://www.npmjs.com/package/remarkable-emoji)! Because emojis are awesome :clap: 

**Original README below**

This loader parses markdown files and converts them to a React Stateless Component.
It will also parse FrontMatter to import dependencies and render components
along with it’s source code.

We developed this loader in order to make the process of creating styleguides for
React components easier

## Usage

In the FrontMatter you should import the components you want to render
with the component name as a key and it's path as the value

```markdown
---
imports:
  HelloWorld: './hello-world.js',
  '{ Component1, Component2 }': './components.js'
---
```

*webpack.config.js*
```js
module: {
  loaders: [
    {
      test: /\.md$/,
      loader: 'babel!react-markdown'
    }
  ]
}
```

*hello-world.js*
```js
import React, { PropTypes } from 'react';

/**
 * HelloWorld
 * @param {Object} props React props
 * @returns {JSX} template
 */
export default function HelloWorld(props) {
  return (
    <div className="hello-world">
      Hello { props.who }
    </div>
  );
}

HelloWorld.propTypes = {
  who: PropTypes.string
};

HelloWorld.defaultProps = {
  who: 'World'
};

```
In the markdown File simply add the *render* tag to code fenceblocks you want the
loader to compile as Components this will output the usual highlighted code
and the rendered component.

*hello-world.md*

<pre>

---
imports:
  HelloWorld: './hello-world.js'
---
# Hello World

This is an example component

```render html
&lt;HelloWorld /&gt;
```

You can send who to say Hello

```render html
&lt;HelloWorld who="World!!!" /&gt;
```

</pre>
