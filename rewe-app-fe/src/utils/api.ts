import { Photo } from "@capacitor/camera";

import { generateDateFileName } from "./stringUtils";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

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

		const bill = await res.json();
		console.log("Photo upload server response:", bill);
		return bill;
	} catch (error) {
		console.error("Error:", error);
		return [];
	}
}

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

		const bill = await res.json();
		console.log("PDF upload server response:", bill);
		return bill;
	} catch (error) {
		console.error("Error:", error);
		return [];
	}
}

export async function fetchDailyChartData(token: string) {
	return await fetch(process.env.REACT_APP_API_BASE_URL + "/charts/daily", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			if (response.status !== 200) {
				console.error("Daily Data fetching failed", response);
				throw new Error("Daily Data fetching failed");
			} else return response;
		})
		.then((response) => response.json());
}

export async function fetchYearlyChartData(token: string) {
	return await fetch(process.env.REACT_APP_API_BASE_URL + "/charts/yearly", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			if (response.status !== 200) {
				console.error("Yearly Data fetching failed", response);
				throw new Error("Yearly Data fetching failed");
			} else return response;
		})
		.then((response) => response.json());
}

export async function fetchBills(token: string) {
	return await fetch(process.env.REACT_APP_API_BASE_URL + "/bills", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			if (response.status !== 200) {
				console.error("Daily Data fetching failed", response);
				throw new Error("Daily Data fetching failed");
			} else return response;
		})
		.then((response) => response.json());
}
