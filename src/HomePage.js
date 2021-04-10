import React, { useState, useEffect } from "react";
import TuiImageEditor from 'tui-image-editor';
import "./HomePage.css";
import "tui-image-editor/dist/tui-image-editor.css";
// import ImageEditor from "@toast-ui/react-image-editor";
import Button from "react-bootstrap/Button";
const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");
const download = require("downloadjs");
const myTheme = {
  "menu.backgroundColor": "white",
  "common.backgroundColor": "#151515",
  "downloadButton.backgroundColor": "white",
  "downloadButton.borderColor": "white",
  "downloadButton.color": "black",
  "menu.normalIcon.path": icond,
  "menu.activeIcon.path": iconb,
  "menu.disabledIcon.path": icona,
  "menu.hoverIcon.path": iconc,
};

/**
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 * @fileoverview TOAST UI Image-Editor React wrapper component
 */


class ImageEditor extends React.Component {
  rootEl = React.createRef();

  imageEditorInst = null;

  componentDidMount() {
    this.imageEditorInst = new TuiImageEditor(this.rootEl.current, {
      ...this.props,
    });

    this.bindEventHandlers(this.props);
  }

  componentWillUnmount() {
    this.unbindEventHandlers();

    this.imageEditorInst.destroy();

    this.imageEditorInst = null;
  }

  shouldComponentUpdate(nextProps) {
    this.bindEventHandlers(this.props, nextProps);

    return false;
  }

  getInstance() {
    return this.imageEditorInst;
  }

  getRootElement() {
    return this.rootEl.current;
  }

  bindEventHandlers(props, prevProps) {
    Object.keys(props)
      .filter(this.isEventHandlerKeys)
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        // For <ImageEditor onFocus={condition ? onFocus1 : onFocus2} />
        if (prevProps && prevProps[key] !== props[key]) {
          this.imageEditorInst.off(eventName);
        }
        this.imageEditorInst.on(eventName, props[key]);
      });
  }

  unbindEventHandlers() {
    Object.keys(this.props)
      .filter(this.isEventHandlerKeys)
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        this.imageEditorInst.off(eventName);
      });
  }

  isEventHandlerKeys(key) {
    return /on[A-Z][a-zA-Z]+/.test(key);
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}



function HomePage() {
  const [imageSrc, setImageSrc] = useState("");
  const imageEditor = React.createRef();
  const saveImageToDisk = () => {
    const imageEditorInst = imageEditor.current.imageEditorInst;
    const data = imageEditorInst.toDataURL();
    if (data) {
      const mimeType = data.split(";")[0];
      const extension = data.split(";")[0].split("/")[1];
      download(data, `image.${extension}`, mimeType);
    }
  };
  return (
    <div className="home-page">
      <div className="center">
        <h1>Photo Editor</h1>
        <Button className='button' onClick={saveImageToDisk}>Save Image to Disk</Button>
      </div>
      <ImageEditor
        includeUI={{
          loadImage: {
            path: imageSrc,
            name: "image",
          },
          theme: myTheme,
          menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
          initMenu: "",
          uiSize: {
            height: `calc(100vh - 160px)`,
          },
          menuBarPosition: "bottom",
        }}
        cssMaxHeight={window.innerHeight}
        cssMaxWidth={window.innerWidth}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        usageStatistics={true}
        ref={imageEditor}
      />
    </div>
  );
}
export default HomePage;