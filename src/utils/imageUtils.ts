/**
 * Converts an image file to PNG format using Canvas
 * @param file The image file to convert
 * @returns A promise that resolves to a File object in PNG format
 */
export const convertToPNG = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        const img = new Image();
        img.onload = () => {
          // Create canvas and draw image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to create canvas context'));
            return;
          }
          
          // Draw image and convert to PNG
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image to PNG'));
              return;
            }
            
            // Create a new File object
            const convertedFile = new File(
              [blob], 
              `${file.name.split('.')[0]}.png`,
              { type: 'image/png' }
            );
            
            resolve(convertedFile);
          }, 'image/png');
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        // Set the image source
        img.src = event.target.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};