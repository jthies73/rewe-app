import { Photo } from "@capacitor/camera";

import { Expense } from "../model/expense";
import { generateDateFileName } from "./stringUtils";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// A function that uploads a photo to the server in multipart/form-data format
export async function uploadPhoto(photo: Photo, token: string) {
	try {
		// Create a FormData object
		const formData = new FormData();
		const fileName = generateDateFileName(new Date()) + ".jpeg";

		console.log("converting photo to blob...", photo.webPath);
		// Convert photo to Blob to append to FormData object
		await fetch(photo.webPath + "")
			.then((response) => response.blob())
			.then((blob) => {
				// Append the image file to the FormData object
				formData.append("file", blob, fileName);
			});

		console.log("uploading photo...", fileName);

		// Send FormData object to API
		const res = await fetch(API_BASE_URL + "/images", {
			method: "POST",
			body: formData,
			headers: {
				Authorization: "Bearer " + token,
			},
		});

		const expenses: Expense[] = await res.json();
		console.log("Expenses server response:", expenses);
		return expenses;
	} catch (error) {
		console.error("Error:", error);
		return [];
	}
}

// A function that uploads a file to the server in multipart/form-data format
export async function uploadPDF(file: File, token: string) {
	try {
		// Create a FormData object
		const formData = new FormData();
		const fileName = generateDateFileName(new Date()) + ".pdf";

		// convert file to Blob to append to FormData object
		const blob = await file.arrayBuffer();
		formData.append("file", new Blob([blob]), fileName);

		console.log("uploading PDF...", fileName);

		// Send FormData object to API
		const res = await fetch(API_BASE_URL + "/pdfs", {
			method: "POST",
			body: formData,
			headers: {
				Authorization: "Bearer " + token,
			},
		});

		const expenses: Expense[] = await res.json();
		console.log("Expenses server response:", expenses);
		return expenses;
	} catch (error) {
		console.error("Error:", error);
		return [];
	}
}
