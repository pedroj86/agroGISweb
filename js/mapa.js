// Importa desde tu archivo firebase.js en lugar de URLs directas
import {
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getAuth,
} from './firebase.js'; // Ajusta la ruta según tu estructura de carpetas
console.log(getAuth);
let drawnItemsGlobal;
let currentUserId = null;
let currentGeometry = null;

// Cargar las parcelas del usuario
export async function loadUserParcels(userId) {
  currentUserId = userId;
  drawnItemsGlobal = window.drawnItems;

  const parcelsRef = collection(db, "users", userId, "parcels");
  const querySnapshot = await getDocs(parcelsRef);

  querySnapshot.forEach((docSnap) => {
    const parcel = docSnap.data();
    const layer = L.geoJSON(parcel.geometry).getLayers()[0];

    layer.bindPopup(`<strong>${parcel.name}</strong><br>${parcel.crop}`);
    layer.on("click", () => selectParcelForEdit(parcel, docSnap.id, layer));
    drawnItemsGlobal.addLayer(layer);
  });
}

// Guardar nueva parcela o actualizarla
document.getElementById("save-parcel").addEventListener("click", async () => {
  const name = document.getElementById("parcel-name").value;
  const crop = document.getElementById("parcel-crop").value;

  if (!currentGeometry || !name || !crop) {
    alert("Por favor, completa todos los campos y dibuja una parcela.");
    return;
  }

  const geojson = currentGeometry.toGeoJSON();
  const area = L.geoJSON(geojson).getLayers()[0].getArea() / 10000;

  const data = {
    name,
    crop,
    area: parseFloat(area.toFixed(2)),
    geometry: geojson.geometry,
    updatedAt: new Date().toISOString(),
  };

  const isEditing = currentGeometry.feature && currentGeometry.feature.id;

  if (isEditing) {
    const parcelId = currentGeometry.feature.id;
    await setDoc(doc(db, "users", currentUserId, "parcels", parcelId), data);
    alert("Parcela actualizada");
  } else {
    const docRef = await addDoc(collection(db, "users", currentUserId, "parcels"), data);
    alert("Parcela guardada");
    currentGeometry.feature = { id: docRef.id };
  }

  clearForm();
});

// Eliminar parcela
document.getElementById("delete-parcel-btn").addEventListener("click", async () => {
  if (!currentGeometry || !currentGeometry.feature?.id) {
    alert("No hay parcela seleccionada.");
    return;
  }

  const parcelId = currentGeometry.feature.id;
  await deleteDoc(doc(db, "users", currentUserId, "parcels", parcelId));
  drawnItemsGlobal.removeLayer(currentGeometry);
  alert("Parcela eliminada");

  clearForm();
});

function selectParcelForEdit(parcel, id, layer) {
  currentGeometry = layer;
  currentGeometry.feature = { id };
  document.getElementById("parcel-name").value = parcel.name;
  document.getElementById("parcel-crop").value = parcel.crop;
  document.getElementById("parcel-area").value = parcel.area;
  document.getElementById("bottom-panel").classList.add("active");
}

document.getElementById("cancel-edit").addEventListener("click", clearForm);

function clearForm() {
  document.getElementById("parcel-name").value = "";
  document.getElementById("parcel-crop").value = "";
  document.getElementById("parcel-area").value = "";
  document.getElementById("bottom-panel").classList.remove("active");
  currentGeometry = null;
}
