import genericImage from "../../assets/generic-photo.png";
import type { AnimalEntry } from "../../models/animal.model";
import './AnimalComponent.css';

interface AnimalComponentProps extends AnimalEntry {
    reserveSpace: (animalId: string, animalName: string) => void;
}

export default function AnimalComponent(props: AnimalComponentProps) {
    function renderImage() {
        if (props.photoUrl) {
            return <img src={props.photoUrl} alt={props.name} />;
        } else {
            return <img src={genericImage} alt="Generic animal" />;
        }
    }

    return (
        <div className="animalComponent">
            {renderImage()}
            <label className="name">{props.name}</label>
            <br />
            <label className="location">{props.location}</label>
            <br />
            <button onClick={() => props.reserveSpace(props.id, props.name)}>Reserve</button>
        </div>
    );
}