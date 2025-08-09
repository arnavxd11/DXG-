document.getElementById("login-btn").addEventListener("click", async () => {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, username, password })
  });
  const data = await res.json();

  if (data.success) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("portal").style.display = "block";

    if (data.role === "Owner") {
      document.getElementById("owner-panel").style.display = "block";
    }

    loadFiles();
  } else {
    document.getElementById("login-message").textContent = data.message;
  }
});

async function loadFiles() {
  const res = await fetch("/files");
  const files = await res.json();
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = "";

  files.forEach(file => {
    const li = document.createElement("li");
    li.innerHTML = `${file} <a href="/download/${file}">Download</a>`;
    fileList.appendChild(li);
  });
}

document.getElementById("upload-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  const res = await fetch("/upload", { method: "POST", body: formData });
  const data = await res.json();
  alert(data.message);
  loadFiles();
});

