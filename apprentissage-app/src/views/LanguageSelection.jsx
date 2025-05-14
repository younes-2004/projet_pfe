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
        { name: "Anglais", image: "/images/flags/english.png", members: "16,1 M" },
        { name: "Francais", image: "/images/flags/france.png", members: "15,4 M" },
        { name: "Espagnol", image: "/images/flags/espagnol.png", members: "5 M" },
        { name: "Italien", image: "/images/flags/italia.png", members: "2,38 M" },
        { name: "Allemand", image: "/images/flags/allmend.png", members: "1,82 M" },
        { name: "Portugais", image: "/images/flags/portugal.png", members: "1,09 M" },
        { name: "Japonais", image: "/images/flags/japan.png", members: "63,1 k" },
        { name: "Chinois", image: "/images/flags/china.png", members: "45,9 k" },
        { name: "Coréen", image: "/images/flags/korea.png", members: "27,4 k" },
        { name: "Turc", image: "/images/flags/Turquie.png", members: "15,4 M" },
        { name: "Indien", image: "/images/flags/india.png", members: "15,4 M" },
       

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