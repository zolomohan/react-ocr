import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import Webcam from 'react-webcam';
import glfx from 'glfx';

function App() {
  let webcam = useRef();
  let fxCanvas = glfx.canvas();
  const [text, setText] = useState();
  const [image, setImage] = useState('');

  useEffect(() => {
    if (image !== '') {
      Tesseract.recognize(Buffer.from(image.split(',')[1], 'base64'), 'eng', {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        console.log(text);
        setText(text);
      });
    }
  });

  const takeScreenShot = () => {
    let image = webcam.getScreenshot();

    let im = new Image();
    im.onload = () => {
      let texture = fxCanvas.texture(im);
      fxCanvas
        .draw(texture)
        .hueSaturation(-1, -1)
        .unsharpMask(20, 2)
        .brightnessContrast(0.2, 0.9)
        .update();
      setImage(fxCanvas.toDataURL());
    };
    im.src = image;
  };

  return (
    <div className='App'>
      <button onClick={takeScreenShot}>Screenshot</button>
      <Webcam screenshotFormat='image/png' ref={(w) => (webcam = w)} />
      <img src={image} />
      <p>{text}</p>
    </div>
  );
}

export default App;
