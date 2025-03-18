import express from "express";
import cors from "cors";
import { spawn, execSync } from "child_process";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Konversi MP3
app.post("/get-info", (req, res) => {
    const { videoUrl } = req.body;
  
    if (!videoUrl) {
      return res.status(400).json({ message: "videoUrl is required" });
    }
  
    try {
      const info = execSync(`yt-dlp --get-title "${videoUrl}"`);
      const title = info.toString().trim();
      return res.json({ title });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to get video info" });
    }
  });
  
  // Download endpoint
  app.get("/download", async (req, res) => {
    const { videoUrl } = req.query;
  
    if (!videoUrl) {
      return res.status(400).json({ message: "Missing video URL" });
    }
  
    try {
      const info = execSync(`yt-dlp --get-title "${videoUrl}"`);
      const title = info.toString().trim().replace(/[<>:"/\\|?*]/g, "");
      const fileName = `${title}_${Date.now()}.mp3`;
  
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Content-Type", "audio/mpeg");
  
      // yt-dlp download audio (webm/m4a) -> pipe ke ffmpeg untuk konversi ke mp3
      const ytdlp = spawn("yt-dlp", [
        "-f",
        "bestaudio",
        "-o",
        "-",
        videoUrl ,
      ]);
  
      const ffmpeg = spawn("ffmpeg", [
        "-i",
        "pipe:0",
        "-f",
        "mp3",
        "-ab",
        "192000",
        "-vn",
        "pipe:1",
      ]);
  
      ytdlp.stdout.pipe(ffmpeg.stdin);
      ffmpeg.stdout.pipe(res);
  
      ytdlp.stderr.on("data", (data) => console.error(`yt-dlp stderr: ${data}`));
      ffmpeg.stderr.on("data", (data) => console.error(`ffmpeg stderr: ${data}`));
  
      ytdlp.on("close", (code) => {
        if (code !== 0) {
          console.error(`yt-dlp exited with code ${code}`);
        }
      });
  
      ffmpeg.on("close", (code) => {
        if (code !== 0) {
          console.error(`ffmpeg exited with code ${code}`);
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to download video" });
    }
  });
  
  

app.use("/download", express.static("output"));

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
