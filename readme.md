React Markdown Component Loader (with Emojis)
==================

[![npm version](https://img.shields.io/npm/v/react-markdown-loader.svg)](https://www.npmjs.com/package/react-markdown-loader)
[![build status](https://travis-ci.org/javiercf/react-markdown-loader.svg?branch=master)](https://travis-ci.org/javiercf/react-markdown-loader)
[![dependencies Status](https://david-dm.org/javiercf/react-markdown-loader/status.svg)](https://david-dm.org/javiercf/react-markdown-loader)
[![devDependencies Status](https://david-dm.org/javiercf/react-markdown-loader/dev-status.svg)](https://david-dm.org/javiercf/react-markdown-loader?type=dev)


This is a fork of [react-markdown-loader](https://github.com/javiercf/react-markdown-loader) with a few _key_ differences.

1. It renders React components without displaying its source code. The original npm package was used for a React styleguide so it displayed the React component along with its source code. This version just renders the React component because I wanted custom components inside Markdown files.
2. The original loader didn't allow for code blocks without a React component. This is fixed so now you specify whether you want the code block to be rendered as JSX or as a code example.
3. It supports emojis by using [markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji)! Because emojis are awesome. Now you can use emojis in your markdown like you normally would on Github: `:clap:`! :clap:

I adapted the original loader for the purpose of creating a React-driven blog using Markdown files as blog posts. This loader allows me to inject interactive React components into my Markdown files. :cake:

## How To Use

Install it

`npm install react-markdown-component-loader --save-dev`

In your markdown file, you must import the components you want to render like so:

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
      loader: 'babel-loader!react-markdown-component-loader'
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
loader to compile as Components this will output the rendered component.

*hello-world.md*

<pre>

---
imports:
  HelloWorld: './hello-world.js'
---
# Hello World

This is an example component

```render
&lt;HelloWorld /&gt;
```

You can send who to say Hello

```render
&lt;HelloWorld who="World!!!" /&gt;
```

</pre>
