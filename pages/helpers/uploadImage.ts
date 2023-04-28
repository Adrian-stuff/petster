import { getStorage, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import firebase_app from "../config";

const storage = getStorage(firebase_app);
const db = getFirestore(firebase_app);

function generateUniqueDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function generateUniqueId(): string {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
  const randomChars = Math.random().toString(36).substr(2, 5); // Generate 5 random chars
  const uniqueId = timestamp + randomChars; // Concatenate timestamp and random chars
  return uniqueId;
}

async function uploadImageBlob(
  info: {
    username: string | undefined | null;
    profileImg: string | undefined | null;
    profileName: string | undefined | null;

    caption: string;
  },
  file: Blob
) {
  // 'file' comes from the Blob or File API
  const postID = generateUniqueId();
  const postRef = doc(db, `posts`, `${postID}`);
  await setDoc(postRef, {
    user: info.username,
    caption: info.caption,
    postID: postID,
    profileImg: info.profileImg,
    profileName: info.profileName,
    timestamp: serverTimestamp(),
  });

  const imageUrl = `posts/${postRef.id}/image`;
  const storageRef = ref(storage, imageUrl);
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log("Uploaded a blob or file!", snapshot);
  });
  return postRef.id;
}

export { uploadImageBlob };
