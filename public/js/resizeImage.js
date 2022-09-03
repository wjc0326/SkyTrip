/*eslint-disable*/
export const resizeImage = (
  image,
  targetWidth,
  targetHeight,
  targetElement = undefined
) => {
  let data;
  const filerdr = new FileReader();
  filerdr.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      let startWidth;
      let startHeight;
      let width;
      let height;
      if (img.height > img.width) {
        startWidth = 0;
        startHeight = (img.height - img.width) / 2;
        width = img.width;
        height = img.width * (targetHeight / targetWidth);
      } else {
        startWidth = (img.width - img.height) / 2;
        startHeight = 0;
        width = img.height * (targetWidth / targetHeight);
        height = img.height;
      }
      ctx.drawImage(
        img,
        startWidth, // Crop start width
        startHeight, // Crop start height
        width, // Cropped width
        height, // Cropped height
        0, // Canvas start width
        0, // Canvas start height
        targetWidth, // Result width
        targetHeight // Result height
      );
      data = canvas.toDataURL('image/jpeg');
      if (targetElement) targetElement.src = data;
    };
    img.src = evt.target.result;
  };
  filerdr.readAsDataURL(image);
  return data;
};
