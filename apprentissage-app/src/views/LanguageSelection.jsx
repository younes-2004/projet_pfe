import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function LanguageSelection() {
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const navigate = useNavigate();

    const handleLanguageSelect = async () => {
        if (!selectedLanguage) {
            alert("Veuillez sélectionner une langue.");
            return;
        }

        try {
            await axiosClient.post("/update-language", { languechoisie: selectedLanguage });
            alert("Langue enregistrée avec succès !");
            navigate("/level-selection");
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de la langue :", err);
            alert("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    const languages = [
        { name: "Anglais", image: "/images/flags/english.png", members: "0" },
        { name: "Francais", image: "/images/flags/france.png", members: "3" },
        { name: "Espagnol", image: "/images/flags/espagnol.png", members: "0 " },
        { name: "Italien", image: "/images/flags/italia.png", members: "0" },
        { name: "Allemand", image: "/images/flags/allmend.png", members: "0" },
        { name: "Portugais", image: "/images/flags/portugal.png", members: "0" },
        { name: "Japonais", image: "/images/flags/japan.png", members: "0" },
        { name: "Chinois", image: "/images/flags/china.png", members: "0" },
        { name: "Coréen", image: "/images/flags/korea.png", members: "0" },
        { name: "Turc", image: "/images/flags/Turquie.png", members: "0" },
        { name: "Indien", image: "/images/flags/india.png", members: "0" },
       

       ,
        
    ];

    return (
        <div className="language-selection-container">
            <h1>Choisissez votre langue préférée</h1>
            <div className="language-options">
                {languages.map((language) => (
                    <div
                        key={language.name}
                        className={`language-option ${selectedLanguage === language.name ? "selected" : ""}`}
                        onClick={() => setSelectedLanguage(language.name)}
                    >
                        <img src={language.image} alt={language.name} />
                        <p className="language-name">{language.name}</p>
                        <p className="language-members">{language.members} membres</p>
                    </div>
                ))}
            </div>
            <button onClick={handleLanguageSelect} className="btn btn-block">
                Confirmer
            </button>
        </div>
    );
}