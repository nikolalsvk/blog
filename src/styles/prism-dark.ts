import { createGlobalStyle } from "styled-components"

export default createGlobalStyle`
	code[class*="language-"],
	pre[class*="language-"] {
		color: #ffd0b8;
		background: #24242e;
		font-family: Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace;
		font-size: 0.975em;
		line-height: 1.375;
		direction: ltr;
		text-align: left;
		white-space: pre;
		word-spacing: normal;
		word-break: normal;
    word-wrap: normal;

		-moz-tab-size: 4;
		-o-tab-size: 4;
		tab-size: 4;

		-webkit-hyphens: none;
		-moz-hyphens: none;
		-ms-hyphens: none;
		hyphens: none;
	}

	pre > code[class*="language-"] {
		font-size: 1em;
	}

	pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
	code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
		text-shadow: none;
		background: #5151e6;
	}

	pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
	code[class*="language-"]::selection, code[class*="language-"] ::selection {
		text-shadow: none;
		background: #5151e6;
	}

  @media print {
    code[class*="language-"],
    pre[class*="language-"] {
      text-shadow: none;
    }
  }

	/* Code blocks */
	pre[class*="language-"] {
		padding: 1em;
		margin: .5em 0;
		overflow: auto;
	}

	/* Inline code */
	:not(pre) > code[class*="language-"] {
		padding: .1em;
		border-radius: .3em;
    white-space: normal;
	}

	.token.comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		color: #bd5555;
	}

	.token.punctuation {
		color: #dbb7b7;
	}

	.token.namespace {
		opacity: .7;
	}

	.token.tag,
	.token.operator,
	.token.number {
		color: #fe8fcb;
	}

	.token.property,
	.token.symbol,
	.token.function {
		color: #ed6e6e;
	}

	.token.tag-id,
	.token.selector,
	.token.atrule-id {
		color: #ebebff;
	}

	code.language-javascript,
	.token.attr-name {
		color: #aaaaca;
	}

	code.language-css,
	code.language-scss,
	.token.boolean,
	.token.string,
	.token.entity,
	.token.url,
	.language-css .token.string,
	.language-scss .token.string,
	.style .token.string,
	.token.attr-value,
	.token.keyword,
	.token.control,
	.token.directive,
	.token.unit,
	.token.statement,
	.token.regex,
	.token.atrule {
		color: #fe8c52;
	}

	.token.placeholder,
	.token.variable {
		color: #fe8c52;
	}

	.token.deleted {
		text-decoration: line-through;
	}

	.token.inserted {
		border-bottom: 1px dotted #ebebff;
		text-decoration: none;
	}

	.token.italic {
		font-style: italic;
	}

	.token.important,
	.token.bold {
		font-weight: bold;
	}

	.token.important {
		color: #aaaaca;
	}

	.token.entity {
		cursor: help;
	}

	pre > code.highlight {
		outline: .4em solid #7676f4;
		outline-offset: .4em;
	}

	/* overrides color-values for the Line Numbers plugin
	 * http://prismjs.com/plugins/line-numbers/
	 */
	.line-numbers .line-numbers-rows {
		border-right-color: #262631;
	}

	.line-numbers-rows > span:before {
		color: #393949;
	}

	/* overrides color-values for the Line Highlight plugin
	* http://prismjs.com/plugins/line-highlight/
	*/
	.line-highlight {
		background: rgba(221, 103, 44, 0.2);
		background: -webkit-linear-gradient(left, rgba(221, 103, 44, 0.2) 70%, rgba(221, 103, 44, 0));
		background: linear-gradient(to right, rgba(221, 103, 44, 0.2) 70%, rgba(221, 103, 44, 0));
	}
`
