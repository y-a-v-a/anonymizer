const cv = require('opencv');
const gd = require('node-gd');

cv.readImage('./image.jpg', (error, image) => {
  if (error) {
    console.log(error);
  }

  image.detectObject(cv.EYE_CASCADE, {}, (error, eyes) => {

    console.log(eyes);

    for(let i = 0; i < eyes.length; i += 2) {
      let eye1 = eyes[i];
      let eye2 = eyes[i + 1];
      if (!eye2) {
        continue;
      }

      let x = Math.min(eye1.x, eye2.x) - 10;
      let y = Math.min(eye1.y, eye2.y);

      let height = Math.max(eye1.height, eye2.height);
      let width = Math.abs(eye1.x - eye2.x) + eye2.width + 20;

      image.rectangle([x, y], [width, height], [0,0,0], -1);
    }

    let imageAsBuffer = image.toBuffer({ext: '.jpg', jpegQuality: 80});
    let gdImage = gd.createFromJpegPtr(imageAsBuffer);

    let imageName = `./out-${Date.now()}.jpg`;

    gdImage.saveJpeg(imageName, 0, (error) => {
      if (error) {
        console.log(error);
      }
    });
  });
});
