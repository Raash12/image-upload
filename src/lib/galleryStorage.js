import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// Helper function oo file-ka u beddesha Base64 (Sidii hore uun)
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// 1. Inaad xog cusub ku kaydiso Firebase (Upload)
export async function addGalleryItemToFirebase({ title, imageName, image }) {
  try {
    const docRef = await addDoc(collection(db, "gallery_items"), {
      title: title,
      imageName: imageName || 'No Name',
      image: image, // Base64 string
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

// 2. Inaad xogta ka soo aqriso Firebase (Load)
export async function loadGalleryItemsFromFirebase() {
  try {
    const q = query(collection(db, "gallery_items"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
}

// 3. Inaad xogta ku update-garayso Firebase (Edit)
export async function updateGalleryItemInFirebase(id, { title, imageName, image }) {
  try {
    const itemRef = doc(db, "gallery_items", id);
    await updateDoc(itemRef, {
      title: title,
      imageName: imageName,
      image: image
    });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}

// 4. Inaad xogta ka tirtirto Firebase (Delete)
export async function deleteGalleryItemFromFirebase(id) {
  try {
    await deleteDoc(doc(db, "gallery_items", id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
}

export function sanitizeFilename(name) {
  return name ? name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'image'
}

export function downloadImage(base64Data, filename) {
  const link = document.createElement('a')
  link.href = base64Data
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}