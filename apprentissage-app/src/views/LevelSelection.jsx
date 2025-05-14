import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function LevelSelection() {
    const [selectedLevel, setSelectedLevel] = useState("");
    const navigate = useNavigate();

    const handleLevelSelect = async () => {
        if (!selectedLevel) {
            alert("Veuillez sélectionner un niveau.");
            return;
        }

        try {
            await axiosClient.post("/update-level", { niveauchoisie: selectedLevel });
            alert("Niveau enregistré avec succès !");
            navigate("/"); // Redirige vers le tableau de bord ou une autre page
        } catch (err) {
            console.error("Erreur lors de l'enregistrement du niveau :", err);
            alert("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    const levels = [
        { name: "Débutant", image: "/images/levels/beginner-level.png" },
        { name: "Intermédiaire", image: "/images/levels/intermediate-level.png"},
        { name: "Avancé", image: "/images/levels/high-level.png"},
    ];

    return (
        <div className="level-selection-container">
            <h1>Choisissez votre niveau</h1>
            <div className="level-options">
                {levels.map((level) => (
                    <div
                        key={level.name}
                        className={`level-option ${selectedLevel === level.name ? "selected" : ""}`}
                        onClick={() => setSelectedLevel(level.name)}
                    >
                        <img src={level.image} alt={level.name} />
                        <p className="level-name">{level.name}</p>
                    </div>
                ))}
            </div>
            <button onClick={handleLevelSelect} className="btn btn-block">
                Confirmer
            </button>
        </div>
    );
}