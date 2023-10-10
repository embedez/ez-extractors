import {spawn} from "child_process";
import ffmpeg from "ffmpeg-static";

import path from "path";
import fs from "fs";
import axios from "axios";
import process from "process";
import {embedMedia} from "../@types";

interface options {
    audio: string
    video: string
    wait: boolean
}

async function videoAudiotoVideo({
                                     audio,
                                     video,
                                     wait
                                 }: options, uuid: string): Promise<Partial<embedMedia>> {
    return new Promise<Partial<embedMedia>>(async (resolve, reject) => {

        if (!fs.existsSync(path.join("./storage"))) fs.mkdirSync("./storage");
        if (!fs.existsSync(path.join(`./storage`, `${uuid}`))) fs.mkdirSync(`./storage/${uuid}`);
        if (fs.existsSync(path.join(`./storage`, `${uuid}`, `processed.mp4`))) return resolve({
            url: `/api/view/?uuid=${uuid}`,
            type: "video",
        });

        let root = process.cwd() || __dirname || __filename || "fake";
        const loadingOutput = path.join(root, "storage", uuid, "loading.mp4");
        const properOutput = path.join(root, "storage", uuid, "processed.mp4");
        const outputVideoPath = path.join(root, "storage", uuid, "video.mp4");
        const outputAudioPath = path.join(root, "storage", uuid, "audio.mp4");
        const image = path.join('./public', 'overlay-15.png')
        const loadingVideo = path.join('./public', 'loading.mp4')

        if (fs.existsSync(properOutput) || fs.existsSync(loadingOutput)) {
            return resolve({
                url: `/api/view/?uuid=${uuid}`,
                type: "video",
            })
        }

        if (!fs.existsSync(loadingOutput)) fs.writeFileSync(loadingOutput, "")

        try {
            // Download video and audio
            const [videoResponse, audioResponse] = await Promise.all([
                axios.get(video, {responseType: "arraybuffer"}),
                axios.get(audio, {responseType: "arraybuffer"})
            ]);
            fs.writeFileSync(outputVideoPath, videoResponse.data);
            fs.writeFileSync(outputAudioPath, audioResponse.data);
        } catch (error) {
            console.log(`Error in downloading files: ${error}`);
            // Handle error here and exit the function
        }

        if ((!wait)) {
            //fs.copyFileSync(loadingVideo, properOutput);

            setTimeout(() => resolve({
                url: `/api/view/?uuid=${uuid}`,
                type: "video",
            }), 250)
        }

        let ffmpegCommand: string[] = [
            //"-loglevel", "debug", // Add the loglevel debug
            "-i", `${outputVideoPath}`, // Path of the input video file
            "-i", `${outputAudioPath}`, // Path of the input audio file
            "-i", `${image}`, // Path of the image file
            "-metadata", "title=Embed Ez", // Add custom meta title
            "-metadata", "tos=Atleast cache download it", // Add custom meta tos
            "-filter_complex", "[0:v][2:v]overlay=W-w-10:H-h-10[outv]", // Position the image to bottom right
            "-map", "[outv]", // Map the output from the 'overlay' filter to video stream
            //"-map", "0:v", // Map the video stream from the first input file
            "-map", "1:a:0", // Map the audio stream from the second input file
            //"-c:v", "libx264", // Convert the mapped video stream to libx264
            "-c:a", "aac", // Convert the mapped audio stream to aac
            //"-c:v", "libx264", // Convert the mapped video stream to libx264
            "-crf", "28", // Lower the video quality to increase the processing speed
            "-r", "30",
            "-shortest", // Make the output file duration the same as the shortest input file
            "-y", // Overwrite output file without asking
            `${loadingOutput}`, // Path of the output file
        ];

        const ffmpegProcess = spawn(ffmpeg as string, ffmpegCommand);
        const startTime = new Date().getTime()
        console.time(`ffmpeg-render-${startTime}`)

        // Debugging
        if (process.env.debug) {
            ffmpegProcess.stdout.on("data", (data) => {
                console.log(`FFmpeg stdout: ${data}`);
            });

            ffmpegProcess.stderr.on("data", (data) => {
                console.error(`FFmpeg stderr: ${data}`);
            });

            ffmpegProcess.on("error", (err) => {
                console.error("Error:", err);
            });
        }

        ffmpegProcess.on("close", (code, a) => {
            console.timeEnd(`ffmpeg-render-${startTime}`)
            if (code === 0) {
                console.log("Video conversion completed successfully");
                fs.renameSync(loadingOutput, properOutput)
                resolve({
                    type: "video",
                    url: `/api/view/?uuid=${uuid}`,
                });
                fs.rmSync(outputAudioPath)
                fs.rmSync(outputVideoPath)
                return
            } else {
                console.error(`FFmpeg process exited with code ${code}`);
                fs.renameSync(loadingOutput, properOutput)
                return resolve({
                    type: "video",
                    url: `/api/view/?uuid=${uuid}`,
                });
            }
        });
    });
}

export default videoAudiotoVideo;
export {videoAudiotoVideo};
