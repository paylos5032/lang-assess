import { supabase } from "./supabase";

let cameraRecorder: MediaRecorder | null = null;
let screenRecorder: MediaRecorder | null = null;
let cameraChunks: Blob[] = [];
let screenChunks: Blob[] = [];
let cameraStream: MediaStream | null = null;
let screenStream: MediaStream | null = null;

export function isRecording() {
  return Boolean(cameraRecorder && screenRecorder);
}

export function previewStreams() {
  return { cameraStream, screenStream };
}

export async function startRecording() {
  cameraStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  cameraChunks = [];
  screenChunks = [];

  cameraRecorder = new MediaRecorder(cameraStream);
  screenRecorder = new MediaRecorder(screenStream);
  cameraRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) cameraChunks.push(event.data);
  };
  screenRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) screenChunks.push(event.data);
  };
  cameraRecorder.start(1000);
  screenRecorder.start(1000);
}

function stopOne(recorder: MediaRecorder | null) {
  return new Promise<void>((resolve) => {
    if (!recorder || recorder.state === "inactive") {
      resolve();
      return;
    }
    recorder.onstop = () => resolve();
    recorder.stop();
  });
}

async function upload(id: string, name: string, chunks: Blob[]) {
  const blob = new Blob(chunks, { type: "video/webm" });
  const path = id + "-" + name + ".webm";
  const { error } = await supabase.storage
    .from("recordings")
    .upload(path, blob, { contentType: "video/webm", upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("recordings").getPublicUrl(path);
  return data.publicUrl;
}

export async function stopAndSave(id: string) {
  await stopOne(cameraRecorder);
  await stopOne(screenRecorder);
  const cameraUrl = await upload(id, "camera", cameraChunks);
  const screenUrl = await upload(id, "screen", screenChunks);
  await supabase
    .from("assessments")
    .update({ camera_url: cameraUrl, screen_url: screenUrl })
    .eq("id", id);
  cameraStream?.getTracks().forEach((track) => track.stop());
  screenStream?.getTracks().forEach((track) => track.stop());
  cameraRecorder = null;
  screenRecorder = null;
}