export default function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        const img = new Image();
        img.src = fileReader.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          const width = img.width;
          const height = img.height;
          const maxLength = Math.max(width, height);
          const squareSize = Math.min(width, height);
  
          canvas.width = squareSize;
          canvas.height = squareSize;
          ctx.drawImage(img, (width - squareSize) / 2, (height - squareSize) / 2, squareSize, squareSize, 0, 0, squareSize, squareSize);
  
          const resizedCanvas = document.createElement('canvas');
          resizedCanvas.width = 500;
          resizedCanvas.height = 500;
          const resizedCtx = resizedCanvas.getContext('2d');
          resizedCtx.drawImage(canvas, 0, 0, squareSize, squareSize, 0, 0, 500, 500);
  
          const resizedDataURL = resizedCanvas.toDataURL(file.type);
          resolve(resizedDataURL);
        };
  
        img.onerror = (error) => {
          reject(error);
        };
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }
  