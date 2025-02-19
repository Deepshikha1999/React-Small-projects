const fs = require("fs");

const folderPath = "/Users/deepshikhasahoo/Documents/react/shooter/src/assets/House"; // Change this to your directory path

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }
    console.log("Files in folder:", files, files.length);
});