const takeImage = async (file) => {
    if (!file) {
        throw new Error("No file provided");
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
        throw new Error("Please select a JPEG or PNG image");
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "chat-app");
    data.append("cloud_name", process.env.CLOUDINARY_CLOUD_NAME || "ddtkuyiwb");

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "post",
            body: data,
        });

        const result = await response.json();
        return result.url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

export default takeImage;