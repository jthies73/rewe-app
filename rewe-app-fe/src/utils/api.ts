import { Photo } from "@capacitor/camera";

import { Expense } from "../model/expense";
import { generateFileNameWithDate } from "./stringUtils";

const BASE_URL =
	process.env.REACT_APP_API_BASE_URL || "https://rewe-app.yafa.app/api";

// A function that uploads a photo to the server in multipart/form-data format
export async function uploadPhoto(photo: Photo) {
	// Create a FormData object
	const formData = new FormData();
	const fileName = generateFileNameWithDate(new Date());

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
	const res = await fetch(BASE_URL + "/images", {
		method: "POST",
		body: formData,
	});

	const expenses: Expense[] = await res.json();

	// const expenses: Expense[] = [
	// 	{
	// 		tags: "test",
	// 		expense_id: 1,
	// 		bill_id: 1,
	// 		user_id: 1,
	// 		name: "test",
	// 		value: 1,
	// 		price_per_item: 1,
	// 		weight: 1,
	// 		price_per_kg: 1,
	// 	},
	// ];

	console.log("Expense response: ", expenses);
	return expenses;
}
