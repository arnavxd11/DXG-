const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Owner credentials
const owners = {
  dark: "asdfghjkl",
  gamer: "asdfghjkl",
  ultimate: "asdfghjkl"
};

// Login endpoint
app.post("/login", (req, res) => {
  const { role, username, password } = req.body;

  if (role === "Nobody") {
    return res.json({ success: false, message: "BHOSDK TU H KON Fir 6kaa?" });
  }

  if (role === "Owner") {
    if (owners[username] && owners[username] === password) {
      return res.json({ success: true, role: "Owner" });
    } else {
      return res.json({ success: false, message: "Try again" });
    }
  }

  // TODO: Add KeyAuth API check for Tester and Client
  return res.json({ success: true, role });
});

// Upload file (Owner only)
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ success: true, message: "File uploaded successfully" });
});

// List files
app.get("/files", (req, res) => {
  fs.readdir("uploads/", (err, files) => {
    if (err) return res.status(500).json({ error: "Cannot list files" });
    res.json(files);
  });
});

// Download file
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filePath);
});

// Delete file (Owner only)
app.delete("/delete/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  fs.unlink(filePath, err => {
    if (err) return res.status(500).json({ error: "Cannot delete file" });
    res.json({ success: true, message: "File deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

