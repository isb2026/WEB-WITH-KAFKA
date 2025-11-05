/**
 * Uploads a file to the Orca service and returns the file name
 * @param file The file to upload
 * @returns The uploaded file name
 */
export const uploadToOrca = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/orca/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.fileName;
  } catch (error) {
    console.error('Error uploading to Orca:', error);
    throw error;
  }
};
