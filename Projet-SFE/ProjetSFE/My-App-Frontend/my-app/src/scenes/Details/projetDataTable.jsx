import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper,useTheme } from '@mui/material';
import { tokens } from '../../theme';


const ProjectDetails = ({ project }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    intitule_projet,
    date_debut_previsionnelle,
    date_fin_previsionnelle,
    budget_global,
    statue_etude,
    statue_projet,
    engagemet,
    paiement,
    moa,
    localisation,
    moad,
    date_debut_reel,
    date_fin_reel,
    taux_davancement,
    secteur,
    observation
  } = project;

  return (
    <TableContainer component={Paper} 
    sx={{ backgroundColor: colors.primary[400] }}
    >
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Intitulé du projet</TableCell>
            <TableCell>{intitule_projet}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Budget global</TableCell>
            <TableCell>{budget_global} dh</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date de début prévisionnelle</TableCell>
            <TableCell>{date_debut_previsionnelle}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date de fin prévisionnelle</TableCell>
            <TableCell>{date_fin_previsionnelle}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Maître d'ouvrage (MOA)</TableCell>
            <TableCell>{moa}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Localisation</TableCell>
            <TableCell>{localisation}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Maître d'ouvrage délégué (MOAD)</TableCell>
            <TableCell>{moad}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Statut du projet</TableCell>
            <TableCell>{statue_projet}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Statut des études</TableCell>
            <TableCell>{statue_etude}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date de début réelle</TableCell>
            <TableCell>{date_debut_reel}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date de fin réelle</TableCell>
            <TableCell>{date_fin_reel}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Taux d'avancement</TableCell>
            <TableCell>{taux_davancement}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Engegement</TableCell>
            <TableCell>{engagemet}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Paiement</TableCell>
            <TableCell>{paiement}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Secteur</TableCell>
            <TableCell>{secteur}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Observation</TableCell>
            <TableCell>{observation}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectDetails;
