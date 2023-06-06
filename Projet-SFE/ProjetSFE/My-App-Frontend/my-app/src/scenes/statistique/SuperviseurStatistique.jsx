import { Box, useTheme, Typography, InputLabel, FormControl, MenuItem, Select } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import { getProgrammes, getProjectsByProgramme } from "../../utils/api";
import ProgrammeWithTauxAvancement from "../../BARChart/ProgrammWithTauxAvancement";
import StatusProjetByProgramme from "../../BARChart/StatusProjetByProgramme";
import PartnerContrProjetChart from "../../BARChart/PartnerContrProjetChart";
import Wordfile from "../../components/Wordfile";
import FileExport from "../../components/Excelfile";
import SecteurProgrammes from "../../PieChart/SecteurProgrammes";
import StatusProjetForAllProgrammes from "../../BARChart/StatusProjetForAllProgramme";
import ProgrammesWithNombreProj from "../../BARChart/ProgrammesWithNombreProj";


const SuperviseurStatistique = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [listprogrammesName, setlistprogrammesName] = useState([]);
    const [selectedProgramme, setSelectedProgramme] = useState("");
    const [listprojetsName, setlistprojetsName] = useState([]);
    const [selectedProjet, setSelectedProjet] = useState("");
    const [selectedProgrammeName, setSelectedProgrammeName] = useState("");
    const [shouldUpdateStatusProjet, setShouldUpdateStatusProjet] = useState(false);
    const [isProgramHasProjects, setIsProgramHasProjects] = useState(true);



    useEffect(() => {
        getProgrammes()
            .then((data) => setlistprogrammesName(data))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (selectedProgramme) {
            getProjectsByProgramme(selectedProgramme)
                .then((data) => {
                    setlistprojetsName(data);
                    setIsProgramHasProjects(data.length > 0);
                })
                .catch((error) => console.log(error));
        }
    }, [selectedProgramme]);


    useEffect(() => {
        if (shouldUpdateStatusProjet) {
            setShouldUpdateStatusProjet(false);
        }
    }, [shouldUpdateStatusProjet]);

    const handleProgrammeChange = (event) => {
        setSelectedProjet("");
        setSelectedProgramme(event.target.value);
        const selectedProgrammeIndex = listprogrammesName.findIndex(programme => programme.id === event.target.value);
        setSelectedProgrammeName(listprogrammesName[selectedProgrammeIndex].intitule_programme);
        setSelectedProjet("");
        setShouldUpdateStatusProjet(true);
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Statistiques" subtitle="Visualisez les statistiques des programmes et des projets pour une meilleure compréhension " />
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {selectedProjet && <Wordfile id_projet={selectedProjet} />}
                        {selectedProgramme && listprojetsName.length > 0 && <FileExport data={listprojetsName} />}
                    </Box>
                </Box>
            </Box>

            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
            >

                <Box
                    gridColumn="span 12"
                    gridRow="span 1"
                    backgroundColor={colors.primary[400]}
                    p="30px"
                >
                    <Typography variant="h5" fontWeight="600">
                        Veuillez sélectionner un programme pour afficher ses statistiques
                    </Typography>
                    <FormControl fullWidth variant="filled" style={{ marginTop: '16px' }}>
                        <InputLabel id="programme-select">Programme</InputLabel>
                        <Select
                            labelId="programme-select-label"
                            value={selectedProgramme}
                            name="intitule_programme"
                            onChange={handleProgrammeChange}
                        >
                            <MenuItem value="" disabled>
                                Choisissez un programme
                            </MenuItem>
                            {listprogrammesName.map((programme) => (
                                <MenuItem key={programme.id} value={programme.id}>
                                    {programme.intitule_programme}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                {!selectedProgramme && (

                    <Box
                        gridColumn="span 12"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                        p="30px"
                    >
                        <Typography variant="h5" fontWeight="600">
                            Répartition des programmes par nombre de projets
                        </Typography>
                        <ProgrammesWithNombreProj />
                    </Box>
                )}
                {!selectedProgramme && (

                    <Box
                        gridColumn="span 12"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                        p="30px"
                    >
                        <Typography variant="h5" fontWeight="600">
                            Statut des projets pour l'ensemble des programmes
                        </Typography>
                        <StatusProjetForAllProgrammes />
                    </Box>
                )}
                {!selectedProgramme && (

                    <Box
                        gridColumn="span 12"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                        p="30px"
                    >
                        <Typography variant="h5" fontWeight="600">
                            Taux d'avancement de tous les programmes
                        </Typography>
                        <ProgrammeWithTauxAvancement />
                    </Box>
                )}
                {!selectedProgramme && (

                    <Box
                        gridColumn="span 12"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                        p="30px"
                    >
                        <Typography variant="h5" fontWeight="600">
                            Répartition des secteurs dans l'ensemble des programmes
                        </Typography>
                        <SecteurProgrammes />
                    </Box>
                )}
                {selectedProgramme && !shouldUpdateStatusProjet && (
                    <Box
                        gridColumn="span 12"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                        p="30px"
                    >
                        <Typography variant="h5" fontWeight="600">
                            Répartition des statuts des projets pour le programme {selectedProgrammeName}
                        </Typography>
                        <StatusProjetByProgramme id_programme={selectedProgramme} />
                    </Box>

                )}



                {selectedProgramme && listprogrammesName.find(programme => programme.id === selectedProgramme) && (
                    <Box
                        gridColumn="span 12"
                        gridRow="span 1"
                        backgroundColor={colors.primary[400]}
                        p="30px"
                    >
                        <Typography variant="h5" fontWeight="600">
                            Sélectionnez un projet
                        </Typography>
                        {listprojetsName.length === 0 ? (
                            <Typography variant="body1">Aucun projet disponible pour ce programme.</Typography>
                        ) : (
                            <FormControl fullWidth variant="filled" style={{ marginTop: '16px' }}>
                                <InputLabel id="projet-select">Projet</InputLabel>
                                <Select
                                    labelId="projet-select-label"
                                    value={selectedProjet}
                                    name="intitule_projet"
                                    onChange={(event) => {
                                        setSelectedProjet(event.target.value);
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Choisissez un projet
                                    </MenuItem>
                                    {listprojetsName.map((project) => (
                                        <MenuItem key={project.id} value={project.id}>
                                            {project.intitule_projet}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                    </Box>
                )}
                {selectedProgramme && selectedProjet && (
                    <Box
                        gridColumn="span 12"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                        p="30px"
                    >
                        <Typography variant="h5" fontWeight="600">
                            Contribution des partenaires
                        </Typography>
                        <PartnerContrProjetChart id_projet={selectedProjet} id_programme={selectedProgramme} />
                    </Box>
                )}
                </Box>
        </Box>

    );
};

export default SuperviseurStatistique;