import { db, collection, addDoc, getDocs, deleteDoc, setDoc, doc, getAuth } from './firebase.js';
console.log(getAuth);
export async function loadUserParcels(userId, drawnItemsGlobal) {
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

export async function saveParcel(userId, currentGeometry, name, crop) {
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
    await setDoc(doc(db, "users", userId, "parcels", parcelId), data);
    alert("Parcela actualizada");
  } else {
    const docRef = await addDoc(collection(db, "users", userId, "parcels"), data);
    alert("Parcela guardada");
    currentGeometry.feature = { id: docRef.id };
  }

  clearForm();
}

export async function deleteParcel(userId, drawnItemsGlobal, currentGeometry) {
  if (!currentGeometry || !currentGeometry.feature?.id) {
    alert("No hay parcela seleccionada.");
    return;
  }

  const parcelId = currentGeometry.feature.id;
  await deleteDoc(doc(db, "users", userId, "parcels", parcelId));
  drawnItemsGlobal.removeLayer(currentGeometry);
  alert("Parcela eliminada");

  clearForm();
}

export function clearForm() {
  document.getElementById("parcel-name").value = "";
  document.getElementById("parcel-crop").value = "";
  document.getElementById("parcel-area").value = "";
  document.getElementById("bottom-panel").classList.remove("active");
  currentGeometry = null;
}
