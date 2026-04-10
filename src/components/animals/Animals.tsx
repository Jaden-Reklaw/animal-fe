import { useState, useEffect } from "react";
import AnimalComponent from "./AnimalComponent";
import { DataService } from "../../services/DataService";
import { NavLink } from "react-router-dom";
import type { AnimalEntry } from "../../models/animal.model";

interface AnimalsProps {
    dataService: DataService
}

export default function Animals(props: AnimalsProps) {

    const [animals, setAnimals] = useState<AnimalEntry[]>();
    const [reservationText, setReservationText] = useState<string>();

    useEffect(() => {
        const getAnimals = async () => {
            console.log('getting animals....')
            const animals = await props.dataService.getAnimals();
            setAnimals(animals);
        }
        getAnimals();
    }, [])

    async function reserveSpace(animalId: string, animalName: string) {
        const reservationResult = await props.dataService.reserveSpace(animalId);
        setReservationText(`You reserved ${animalName}, reservation id: ${reservationResult}`);
    }

    function renderAnimals() {
        if (!props.dataService.isAuthorized()) {
            return <NavLink to={"/login"}>Please login</NavLink>
        }
        const rows: any[] = [];
        if (animals) {
            for (const animalEntry of animals) {
                rows.push(
                    <AnimalComponent
                        key={animalEntry.id}
                        id={animalEntry.id}
                        location={animalEntry.location}
                        name={animalEntry.name}
                        photoUrl={animalEntry.photoUrl}
                        reserveSpace={reserveSpace}
                    />
                )
            }
        }

        return rows;
    }

    return (
        <div>
            <h2>Welcome to the Animals page!</h2>
            {reservationText ? <h2>{reservationText}</h2> : undefined}
            {renderAnimals()}
        </div>
    )


}