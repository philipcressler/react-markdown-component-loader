'use strict';

const frontMatter = require('front-matter');
const hljs = require('highlight.js');
const escapeHtml = require('remarkable/lib/common/utils').escapeHtml;
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const emoji = require('markdown-it-emoji');

/**
 * Wraps the code and jsx in an html component
 * for styling it later
 * @param   {string} exampleRun Code to be run in the styleguide
 * @param   {string} exampleSrc Source that will be shown as example
 * @param   {string} langClass  CSS class for the code block
 * @returns {string}            Code block with souce and run code
 */
function codeBlockTemplate(exampleRun, exampleSrc, langClass, render) {
  if(render) {
    return `
      <div>
        ${exampleRun}
      </div>
    `;
  } else {
    return `
      <pre><code${!langClass ? '' : ` class="${langClass}"`}>
        ${exampleSrc}
      </code></pre>`;
  }
}

/**
 * Parse a code block to have a source and a run code
 * @param   {String}   code       - Raw html code
 * @param   {String}   lang       - Language indicated in the code block
 * @param   {String}   langPrefix - Language prefix
 * @param   {Function} highlight  - Code highlight function
 * @returns {String}                Code block with souce and run code
 */
function parseCodeBlock(code, lang, langPrefix, highlight, render) {
  let codeBlock = escapeHtml(code);

  if (highlight) {
    codeBlock = highlight(code, lang);
  }

  const
    langClass = !lang ? '' : `${langPrefix}${escape(lang, true)}`,
    jsx = code;

  codeBlock = codeBlock
    .replace(/{/g, '{"{"{')
    .replace(/}/g, '{"}"}')
    .replace(/{"{"{/g, '{"{"}')
    .replace(/(\n)/g, '{"\\n"}')
    .replace(/class=/g, 'className=');

  return codeBlockTemplate(jsx, codeBlock, langClass, render);
}

/**
 * @typedef MarkdownObject
 * @type {Object}
 * @property {Object} attributes - Map of properties from the front matter
 * @property {String} body       - Markdown
 */

/**
 * @typedef HTMLObject
 * @type {Object}
 * @property {String} html    - HTML parsed from markdown
 * @property {Object} imports - Map of dependencies
 */

/**
 * Parse Markdown to HTML with code blocks
 * @param   {MarkdownObject} markdown - Markdown attributes and body
 * @returns {HTMLObject}                HTML and imports
 */
function parseMarkdown(markdown) {
  return new Promise((resolve, reject) => {
    let html;

    const options = {
      highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, code).value;
          } catch (err) {}
        }

        try {
          return hljs.highlightAuto(code).value;
        } catch (err) {}

        return ''; // use external default escaping
      },
      xhtmlOut: true
    };
    
  
    md.set(options);
    md.use(emoji);
    md.renderer.rules['fence'] = (tokens, idx, options) => {
      // gets tags applied to fence blocks ```react html
      const codeTags = tokens[idx].info.split(/\s+/g);
      let render = false;
      if(codeTags.indexOf('render') > -1) {
        render = true;
      }
      return parseCodeBlock(
        tokens[idx].content,
        codeTags[codeTags.length - 1],
        options.langPrefix,
        options.highlight,
        render
      );
    };

    try {
      html = md.render(markdown.body);
     // html = marked(markdown.body);
      resolve({ html, attributes: markdown.attributes });
    } catch (err) {
      return reject(err);
    }

  });
}

/**
 * Extract FrontMatter from markdown
 * and return a separate object with keys
 * and a markdown body
 * @param   {String} markdown - Markdown string to be parsed
 * @returns {MarkdownObject}    Markdown attributes and body
 */
function parseFrontMatter(markdown) {
  return frontMatter(markdown);
}

/**
 * Parse markdown, extract the front matter
 * and return the body and imports
 * @param  {String} markdown - Markdown string to be parsed
 * @returns {HTMLObject}       HTML and imports
 */
function parse(markdown) {
  return parseMarkdown(parseFrontMatter(markdown));
}

module.exports = {
  codeBlockTemplate,
  parse,
  parseCodeBlock,
  parseFrontMatter,
  parseMarkdown
};
