/* eslint-env browser */

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import {
  ySyncPlugin,
  yCursorPlugin,
  yUndoPlugin,
  updatePublishPlugin,
  undo,
  redo,
} from "../src/y-prosemirror.js";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "./schema.js";
import { exampleSetup } from "prosemirror-example-setup";
import { keymap } from "prosemirror-keymap";
import { prosemirrorJSONToYDoc } from "../src/lib";

window.addEventListener("load", () => {
  // const ydoc = new Y.Doc()
  const ydoc = prosemirrorJSONToYDoc(schema, {
    type: "doc",
    content: [
    {
        type: "heading",
        content: [
        {
            type: "text",
            text: "This is Heading 1"
        }],
    },
    {
        type: "heading",
        attrs:
        {
            level: 2
        },
        content: [
        {
            type: "text",
            text: "This is Heading 2"
        }],
    },
    {
        type: "heading",
        attrs:
        {
            level: 3
        },
        content: [
        {
            type: "text",
            text: "This is Heading 3"
        }],
    },
    {
        type: "paragraph",
        content: [
        {
            type: "text",
            text: "This is a paragraph with some body text. This paragraph can be long or short depending on it's context and function. Use this to write the normal text and descriptions in your course.",
        }, ],
    },
    {
        type: "paragraph",
        content: [
        {
            type: "text",
            text: "This is a second paragraph. It comes right after a preceding body text. This is here to show you how the padding works between them two.",
        }, ],
    },
    {
        type: "unordered_list",
        content: [
        {
            type: "list_item",
            content: [
            {
                type: "list_item_text",
                content: [
                {
                    type: "text",
                    text: "Bullet list 1"
                }],
            }, ],
        },
        {
            type: "list_item",
            content: [
            {
                type: "list_item_text",
                content: [
                {
                    type: "text",
                    text: "Bullet list 2"
                }],
            }, ],
        },
        {
            type: "list_item",
            content: [
            {
                type: "list_item_text",
                content: [
                {
                    type: "text",
                    text: "Bullet list 3"
                }],
            }, ],
        },
        {
            type: "list_item",
            content: [
            {
                type: "list_item_text",
                content: [
                {
                    type: "text",
                    text: "Bullet list 4"
                }],
            }, ],
        },
        {
            type: "list_item",
            content: [
            {
                type: "list_item_text",
                content: [
                {
                    type: "text",
                    text: "Bullet list 5"
                }],
            }, ],
        },
        {
            type: "list_item",
            content: [
            {
                type: "list_item_text",
                content: [
                {
                    type: "text",
                    text: "Bullet list 6"
                }],
            }, ],
        }, ],
    },
    {
        type: "ordered_list",
        content: [
        {
            type: "list_item",
            content: [
            {
                type: "list_item_text",
                content: [
                {
                    type: "text",
                    marks: [
                    {
                        type: "strong"
                    }],
                    text: "A header for your numbered list",
                },
                {
                    type: "text",
                    text: "  – write the actual content of the first point in your list.",
                }, ],
            }, ],
        },
        {
            type: "list_item",
            content: [
            {
                type: "list_item_text",
                content: [
                {
                    type: "text",
                    text: "Make users more tolerant of usability issues – Studies show that users rate visually appealing designs as more usable than they truly are. This aesthetic-usability effect has been explored extensively, notably by UX design pioneer and author Don Norman.",
                }, ],
            }, ],
        }, ],
    },
    {
        type: "blockquote",
        content: [
        {
            type: "paragraph",
            content: [
            {
                type: "text",
                text: '"Design is the method of putting form and content together. Design, just as art, has multiple definitions; there is no single definition. Design can be art. Design can be aesthetics. Design is so simple, that\'s why it is so complicated."',
            }, ],
        },
        {
            type: "blockquote",
            content: [
            {
                type: "paragraph",
                content: [
                {
                    type: "text",
                    text: '"1. Design is the method of putting form and content together. Design, just as art, has multiple definitions; there is no single definition. Design can be art. Design can be aesthetics. Design is so simple, that\'s why it is so complicated."',
                }, ],
            }, ],
        }, {
            type: "blockquote",
            content: [
            {
                type: "paragraph",
                content: [
                {
                    type: "text",
                    text: '"2. Design is the method of putting form and content together. Design, just as art, has multiple definitions; there is no single definition. Design can be art. Design can be aesthetics. Design is so simple, that\'s why it is so complicated."',
                }, ],
            }, ],
        }, {
            type: "blockquote",
            content: [
            {
                type: "paragraph",
                content: [
                {
                    type: "text",
                    text: '"3. Design is the method of putting form and content together. Design, just as art, has multiple definitions; there is no single definition. Design can be art. Design can be aesthetics. Design is so simple, that\'s why it is so complicated."',
                }, ],
            }, ],
        }],
    },
    {
        type: "spacer"
    },
    {
        type: "paragraph",
        content: [
        {
            type: "text",
            text: "Therefore, it's vital to set out well-chosen page/screen elements harmoniously and with a good ",
        },
        {
            type: "text",
            text: "visual hierarchy.",
            marks: [
            {
                type: "link",
                attrs:
                {
                    href: "http://google.com",
                    title: "visual"
                },
            }, ],
        }, ],
    }, ],
});
  const provider = new WebsocketProvider(
    "ws://localhost:3010/collab",
    "my-roomname-3",
    ydoc
  );
  const type = ydoc.getXmlFragment("prosemirror");

  const editor = document.createElement("div");
  editor.setAttribute("id", "editor");
  const editorContainer = document.createElement("div");
  editorContainer.insertBefore(editor, null);
  const prosemirrorView = new EditorView(editor, {
    state: EditorState.create({
      schema,
      plugins: [
        updatePublishPlugin,
        ySyncPlugin(type),
        // yCursorPlugin(provider.awareness),
        // yUndoPlugin(),
        keymap({
          "Mod-z": undo,
          "Mod-y": redo,
          "Mod-Shift-z": redo,
        }),
      ].concat(exampleSetup({ schema })),
    }),
  });
  document.body.insertBefore(editorContainer, null);

  const connectBtn = /** @type {HTMLElement} */ (document.getElementById(
    "y-connect-btn"
  ));
  connectBtn.addEventListener("click", () => {
    if (provider.shouldConnect) {
      provider.disconnect();
      connectBtn.textContent = "Connect";
    } else {
      provider.connect();
      connectBtn.textContent = "Disconnect";
    }
  });

  // @ts-ignore
  window.example = { provider, ydoc, type, prosemirrorView };
});
