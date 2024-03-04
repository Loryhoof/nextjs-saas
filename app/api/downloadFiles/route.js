import JSZip from 'jszip';

export async function POST(request) {
  try {
    const { files } = await request.json();

    // Create a JSZip instance
    const zip = new JSZip();

    // Download each image and add it to the zip
    const downloadPromises = files.map(async (imageUrl, index) => {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to download image ${index + 1}`);
        }
        const imageArrayBuffer = await response.arrayBuffer(); // Use arrayBuffer() instead of buffer()
        const imageUint8Array = new Uint8Array(imageArrayBuffer);
        zip.file(`image_${index + 1}.png`, imageUint8Array);
      });

    // Wait for all downloads to complete
    await Promise.all(downloadPromises);

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: 'nodebuffer' });

    // Return the zip file as a Response
    return new Response(zipBlob, {
      headers: {
        'Content-Disposition': 'attachment; filename=downloadedImages.zip',
        'Content-Type': 'application/zip',
      },
    });
  } catch (error) {
    console.error('Error handling files:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
