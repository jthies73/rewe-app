import { Photo } from "@capacitor/camera";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import React, { useState } from "react";

import { Expense } from "../model/expense";
import { uploadPhoto } from "../utils/api";
import Bill from "./Bill";

const ImageGrid: React.FC<ImageGridProps> = ({ photos }) => {
	const [expenses, setExpenses] = useState<Expense[]>([]);

	return (
		<>
			<IonGrid>
				<IonRow>
					{photos.map((photo) => (
						<IonCol size-md="6" size-xs="12" key={photo.webPath}>
							<img
								key={photo.webPath}
								src={photo.webPath}
								style={{ width: "100%", height: "auto" }}
								alt={"whats that??"}
							/>
							<IonButton
								onClick={async () => {
									const expenses = await uploadPhoto(photo);
									setExpenses((prevState) => [
										...prevState,
										...expenses,
									]);
								}}
							>
								Upload
							</IonButton>
						</IonCol>
					))}
				</IonRow>
			</IonGrid>
			<Bill expenses={expenses} />
		</>
	);
};

interface ImageGridProps {
	photos: Photo[];
}

export default ImageGrid;
