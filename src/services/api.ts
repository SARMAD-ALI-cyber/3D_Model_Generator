/**
 * Sends an image to the API and returns the generated 3D model
 * @param imageFile The image file to send (should be PNG format)
 * @param onProgress Callback function for progress updates
 * @returns A promise that resolves to a Blob containing the .glb model
 */
export const generate3DModel = async (
  imageFile: File, 
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Set up request with progress tracking
    const xhr = new XMLHttpRequest();
    
    // Create a Promise wrapper around XMLHttpRequest for progress tracking
    const promise = new Promise<Blob>((resolve, reject) => {
      xhr.open('POST', import.meta.env.VITE_API_URL);
      
      // Set up progress tracking
      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        };
      }
      
      // Handle response
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success - return the GLB file
          resolve(xhr.response);
        } else {
          // Error
          reject(new Error(`API request failed with status ${xhr.status}: ${xhr.statusText}`));
        }
      };
      
      // Handle network errors
      xhr.onerror = () => {
        reject(new Error('Network error occurred while sending the request'));
      };
      
      // Set response type to blob for binary data (GLB file)
      xhr.responseType = 'blob';
      
      // Send the request
      xhr.send(formData);
    });
    
    // Simulate a delay and progress for demo purposes (remove in production)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return the promise
    return promise;
  } catch (error) {
    // Re-throw any errors
    throw error instanceof Error 
      ? error 
      : new Error('Failed to generate 3D model');
  }
};

/**
 * A mock implementation that can be used for testing without calling the real API
 * It simulates the API response with a pre-defined GLB file
 */
export const mockGenerate3DModel = async (
  imageFile: File, 
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  // Simulate progress updates
  const totalSteps = 10;
  const stepTime = 500; // ms
  
  for (let i = 1; i <= totalSteps; i++) {
    if (onProgress) {
      onProgress((i / totalSteps) * 100);
    }
    await new Promise(resolve => setTimeout(resolve, stepTime));
  }
  
  // Return a placeholder GLB file
  // In a real implementation, you would return the API response
  const response = await fetch('/placeholder-model.glb');
  return await response.blob();
};