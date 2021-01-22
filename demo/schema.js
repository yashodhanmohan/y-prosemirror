import { marks, nodes } from "prosemirror-schema-basic";
import { Schema } from "prosemirror-model";

const pDOM = ["p", 0], blockquoteDOM = ["blockquote", 0], hrDOM = ["hr"],
      preDOM = ["pre", ["code", 0]], brDOM = ["br"]

export const schema = new Schema({
  marks: { ...marks },
  nodes: {
    // :: NodeSpec The top level document node.
    doc: {
      content: "block+",
    },

    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
      content: "inline*",
      attrs: { id: { default: null } },
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return pDOM;
      },
    },

    // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
    blockquote: {
      content: "block+",
      attrs: { id: { default: null } },
      group: "block",
      defining: true,
      parseDOM: [{ tag: "blockquote" }],
      toDOM() {
        return blockquoteDOM;
      },
    },

    // :: NodeSpec A horizontal rule (`<hr>`).
    horizontal_rule: {
      group: "block",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "hr" }],
      toDOM() {
        return hrDOM;
      },
    },

    // :: NodeSpec A heading textblock, with a `level` attribute that
    // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    // `<h6>` elements.
    heading: {
      attrs: { level: { default: 1 }, id: { default: null } },
      content: "inline*",
      group: "block",
      defining: true,
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } },
      ],
      toDOM(node) {
        return ["h" + node.attrs.level, 0];
      },
    },

    // :: NodeSpec A code listing. Disallows marks or non-text inline
    // nodes by default. Represented as a `<pre>` element with a
    // `<code>` element inside of it.
    code_block: {
      content: "text*",
      attrs: { id: { default: null } },
      marks: "",
      group: "block",
      code: true,
      defining: true,
      parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
      toDOM() {
        return preDOM;
      },
    },

    // :: NodeSpec The text node.
    text: {
      group: "inline",
    },

    // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
    // `alt`, and `href` attributes. The latter two default to the empty
    // string.
    image: {
      inline: true,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
         id: { default: null }
      },
      group: "inline",
      draggable: true,
      parseDOM: [
        {
          tag: "img[src]",
          getAttrs(dom) {
            return {
              src: dom.getAttribute("src"),
              title: dom.getAttribute("title"),
              alt: dom.getAttribute("alt"),
            };
          },
        },
      ],
      toDOM(node) {
        let { src, alt, title } = node.attrs;
        return ["img", { src, alt, title }];
      },
    },

    // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
    hard_break: {
      inline: true,
      attrs: { id: { default: null } },
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return brDOM;
      },
    },
    ordered_list: {
      content: "list_item+",
      group: "block",
      attrs: { order: { default: 1 }, id: { default: null } },
      parseDOM: [
        {
          tag: "ol",
          // @ts-ignore
          getAttrs: (dom) => ({
            order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1,
          }),
        },
      ],
      toDOM: (node) => [
        "ol",
        {
          class: "list-decimal pt-8",
          start: node.attrs.order == 1 ? null : node.attrs.order,
        },
        0,
      ],
    },
    unordered_list: {
      content: "list_item+",
      attrs: { id: { default: null } },
      group: "block",
      parseDOM: [{ tag: "ul" }],
      toDOM: () => ["ul", { class: "list-disc pt-8" }, 0],
    },
    list_item: {
      content: "list_item_text block*",
      attrs: { id: { default: null } },
      defining: true,
      parseDOM: [{ tag: "li" }],
      toDOM: () => ["li", { class: "ml-20 pt-8 body-long-01 text-text-00" }, 0],
    },
    list_item_text: {
      content: "inline*",
      attrs: { id: { default: null } },
      parseDOM: [{ tag: "span" }],
      toDOM: () => ["span", 0],
    },
    spacer: {
      parseDOM: [{ tag: "div" }],
      attrs: { id: { default: null } },
      toDOM: () => ["div", { class: "h-48 pt-12" }, 0],
    },
  },
});
