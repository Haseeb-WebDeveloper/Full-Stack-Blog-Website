export const uploadImage = async (file: File) => {
    try {
        // Create FormData object which contains the image file to send to ImgBB. this is a built-in JavaScript object that allows us to construct a set of key/value pairs representing form fields and their values, which can be easily sent using fetch or XMLHttpRequest. in short FormData() is used to send form data in multipart/form-data format, which is primarily used for uploading files.
        const formData = new FormData();

        // Append the image file to the form data which is the file object passed to the function like this: const thumbnail = await uploadImage(file);
        formData.append('image', file);
        
        // Append the ImgBB API key to the form data
        formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY!);
        
        // Send the form data to ImgBB using fetch which is a JavaScript function for making HTTP requests. It returns a Promise that resolves to the Response object.
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        });

        // Parse the response from ImgBB which is in JSON format
        const data = await response.json();
        
        // Check if the image upload was successful
        if (data.success) {
            // Return the URL of the uploaded image which is the value of the url key in the data object
            return data.data.url;
        } else {
            // Throw an error if the image upload failed
            throw new Error(data.error?.message || 'Failed to upload image');
        }
    } catch (error) {
        console.error('Image upload failed:', error);
        throw error;
    }
}; 