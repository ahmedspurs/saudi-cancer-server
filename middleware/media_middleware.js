const fileEasyUpload = require("express-easy-fileuploader");
const fs = require("fs").promises;
const pathModule = require("path");
const crypto = require("crypto");

const file_handler = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(); // Skip middleware if no files are present
    }
    const fileName = ["image", "file", "image_url", "images", "file_url0"];
    const urlPart = req.originalUrl.split("/api/")[1];
    if (!urlPart) {
      return res.status(400).json({ status: false, msg: "Invalid API path" });
    }

    // Use forward slashes for directory path
    const directoryPath = pathModule
      .join("public", urlPart)
      .replace(/\\/g, "/");
    await fs.mkdir(directoryPath, { recursive: true });

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];

    if (req.files) {
      fileName.forEach((name) => {
        const files = [];
        for (let key in req.files) {
          if (key.startsWith(`${name}[`) && key.endsWith("]")) {
            const index = parseInt(key.match(/\d+/)[0]);
            files[index] = req.files[key];
          }
        }
        if (files.length > 0) {
          req.files[name] = files.filter((file) => file !== undefined);
        }
      });

      for (const name of fileName) {
        if (Array.isArray(req.files[name])) {
          const savePromises = req.files[name].map(async (file) => {
            const fileExtension = pathModule.extname(file.name);
            if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
              throw new Error(`Invalid file type: ${fileExtension}`);
            }
            const uniqueFileName = `${Date.now()}-${crypto
              .randomBytes(4)
              .toString("hex")}${fileExtension}`;
            // Use forward slashes for file path
            const filePath = pathModule
              .join(directoryPath, uniqueFileName)
              .replace(/\\/g, "/");
            await fs.writeFile(filePath, file.data);
            return filePath;
          });
          req.body[name] = await Promise.all(savePromises);
        } else if (req.files[name]) {
          const file = req.files[name];
          const fileExtension = pathModule.extname(file.name);
          if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
            throw new Error(`Invalid file type: ${fileExtension}`);
          }
          const uniqueFileName = `${Date.now()}-${crypto
            .randomBytes(4)
            .toString("hex")}${fileExtension}`;
          // Use forward slashes for file path
          const filePath = pathModule
            .join(directoryPath, uniqueFileName)
            .replace(/\\/g, "/");
          await fs.writeFile(filePath, file.data);
          req.body[name] = filePath;
        }
      }
    }
    next();
  } catch (error) {
    console.error("Error in file handler:", error.message, error.stack);
    return res
      .status(500)
      .json({ status: false, msg: `File upload failed: ${error.message}` });
  }
};

module.exports = file_handler;
