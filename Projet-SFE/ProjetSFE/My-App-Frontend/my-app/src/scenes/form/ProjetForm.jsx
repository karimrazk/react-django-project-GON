import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState, useContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import dayjs from "dayjs";
import { getProgrammesForEMP, getProjectsById, updateProjet } from "../../utils/api";
import AuthContext from "../../context/AuthContext";
import { useSnackbar } from 'notistack';




const FormProjet = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id_projet, intitule_projet } = useParams();
  const [listprogramme, setListprogramme] = useState([]);
  const [projetData, setProjetData] = useState(null);
  const { user } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    getProgrammesForEMP(user.user_id)
      .then((data) => setListprogramme(data))
      .catch((error) => enqueueSnackbar('Error!', { variant: 'error' }));
  }, []);

  useEffect(() => {
    getProjectsById(id_projet)
      .then((data) => setProjetData(data))
      .catch((error) => console.log(error));
  }, [id_projet]);


  const initialValues = {
    intitule_projet: "",
    localisation: "",
    budget_global: "",
    date_debut_previsionnelle: "",
    date_fin_previsionnelle: "",
    date_debut_reel: "",
    moa:"",
    moad:"",
    statue_etude:"",
    statue_projet:"",
    date_fin_reel: "",
    engagemet: "",
    taux_davancement: "",
    observation: "",
    paiement:"",
    secteur: "",
    programme: "",
  };

  const handleFormSubmit = async (values) => {
    try {
      await updateProjet(id_projet, values);
      enqueueSnackbar('Les modifications apportées au projet ont été enregistrées avec succès!', { variant: 'success' });

    } catch (error) {
      enqueueSnackbar('Error updating data!', { variant: 'error' });
    }
  };

  

  return (
    <Box m="20px">
      <Header title="Modifier les informations du projet" subtitle={intitule_projet} />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setValues,
        }) => {useEffect(() => {
          if (projetData) {
            const { intitule_projet, date_debut_previsionnelle, date_fin_previsionnelle,date_debut_reel,date_fin_reel, budget_global, moa,moad, localisation,engagemet,secteur,taux_davancement,paiement, observation,statue_etude,statue_projet,programme } = projetData;
            setValues({
              intitule_projet: intitule_projet || "",
              date_debut_previsionnelle: date_debut_previsionnelle ? dayjs(date_debut_previsionnelle).format("YYYY-MM-DD") : "",
              date_fin_previsionnelle: date_fin_previsionnelle ? dayjs(date_fin_previsionnelle).format("YYYY-MM-DD") : "",
              date_debut_reel: date_debut_reel ? dayjs(date_debut_reel).format("YYYY-MM-DD") : "",
              date_fin_reel: date_fin_reel ? dayjs(date_fin_reel).format("YYYY-MM-DD") : "",
              budget_global: budget_global || "",
              moa: moa || "",
              moad: moad || "",
              engagemet: engagemet || "",
              statue_etude: statue_etude || "",
              statue_projet: statue_projet || "",
              paiement: paiement || "",
              localisation: localisation || "",
              taux_davancement: taux_davancement || "",
              secteur: secteur || "",
              programme: programme || "",
              observation: observation || "",
            });
          }
        }, [projetData, setValues]);
         return (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Intitule du projet"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.intitule_projet}
                name="intitule_projet"
                error={!!touched.intitule_projet && !!errors.intitule_projet}
                helperText={touched.intitule_projet && errors.intitule_projet}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl fullWidth  sx={{ gridColumn: "span 2" }} variant="filled">
                    <InputLabel id="secteur-select">Programme</InputLabel>
                    <Select
                      labelId="secteur-select-label"
                      value={values.programme}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="programme"
                      error={!!touched.programme && !!errors.programme}
                      helpertext={touched.programme && errors.programme}
                    >
                      {listprogramme.map((programme) => (
                      <MenuItem key={programme.id} value={programme.id}>
                        {programme.intitule_programme}
                      </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                
                <FormControl fullWidth  sx={{ gridColumn: "span 2" }} variant="filled">
                    <InputLabel id="secteur-select">Secteur</InputLabel>
                    <Select
                      labelId="secteur-select-label"
                      value={values.secteur}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="secteur"
                      error={!!touched.secteur && !!errors.secteur}
                      helpertext={touched.secteur && errors.secteur}
                    >
                      <MenuItem value="" disabled>
                        Choisissez un secteur
                      </MenuItem>
                      <MenuItem value="Tourisme">Tourisme</MenuItem>
                      <MenuItem value="Economie sociale">Economie sociale</MenuItem>
                      <MenuItem value="Agriculture">Agriculture</MenuItem>
                      <MenuItem value="Sport">Sport</MenuItem>
                      <MenuItem value="Culture">Culture</MenuItem>
                    </Select>
                </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Localisation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.localisation}
                name="localisation"
                error={!!touched.localisation && !!errors.localisation}
                helperText={touched.localisation && errors.localisation}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="MOA"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.moa}
                name="moa"
                error={!!touched.moa && !!errors.moa}
                helperText={touched.moa && errors.moa}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="MOAD"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.moad}
                name="moad"
                error={!!touched.moad && !!errors.moad}
                helperText={touched.moad && errors.moad}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Bugget global"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.budget_global}
                name="budget_global"
                error={!!touched.budget_global && !!errors.budget_global}
                helperText={touched.budget_global && errors.budget_global}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Taux d'avancement"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                value={values.taux_davancement}
                name="taux_davancement"
                error={!!touched.taux_davancement && !!errors.taux_davancement}
                helperText={touched.taux_davancement && errors.taux_davancement}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Engagement"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.engagemet}
                name="engagemet"
                error={!!touched.engagemet && !!errors.engagemet}
                helperText={touched.engagemet && errors.engagemet}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Paiement"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.paiement}
                name="paiement"
                error={!!touched.paiement && !!errors.paiement}
                helperText={touched.paiement && errors.paiement}
                sx={{ gridColumn: "span 2" }}
              />
               <FormControl fullWidth  sx={{ gridColumn: "span 2" }} variant="filled">
                    <InputLabel id="secteur-select">Statut des études</InputLabel>
                    <Select
                      labelId="secteur-select-label"
                      value={values.statue_etude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="statue_etude"
                      error={!!touched.statue_etude && !!errors.statue_etude}
                      helpertext={touched.statue_etude && errors.statue_etude}
                    >
                      <MenuItem value="" disabled>
                        Choisissez le statut des études
                      </MenuItem>
                      <MenuItem value="Aucun">Aucun</MenuItem>
                      <MenuItem value="Planifié">Planifié</MenuItem>
                      <MenuItem value="En cours">En cours</MenuItem>
                      <MenuItem value="Achevée">Achevée</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth  sx={{ gridColumn: "span 2" }} variant="filled">
                    <InputLabel id="secteur-select">Statut de projet</InputLabel>
                    <Select
                      labelId="secteur-select-label"
                      value={values.statue_projet}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="statue_projet"
                      error={!!touched.statue_projet && !!errors.statue_projet}
                      helpertext={touched.statue_projet && errors.statue_projet}
                    >
                      <MenuItem value="" disabled>
                        Choisissez le statut du projet
                      </MenuItem>
                      <MenuItem value="En cours de démarrage">En cours de démarrage</MenuItem>
                      <MenuItem value="Planifié">Planifié</MenuItem>
                      <MenuItem value="En cours de réalisation">En cours de réalisation</MenuItem>
                      <MenuItem value="Achevée">Achevée</MenuItem>
                    </Select>
                </FormControl>

              <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Date début previsionnelle"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date_debut_previsionnelle}
                  name="date_debut_previsionnelle"
                  error={!!touched.date_debut_previsionnelle && !!errors.date_debut_previsionnelle}
                  helperText={touched.date_debut_previsionnelle && errors.date_debut_previsionnelle}
                  sx={{ gridColumn: "span 1" }}
                />

              <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Date fin previsionnelle"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date_fin_previsionnelle}
                  name="date_fin_previsionnelle"
                  error={!!touched.date_fin_previsionnelle && !!errors.date_fin_previsionnelle}
                  helperText={touched.date_fin_previsionnelle && errors.date_fin_previsionnelle}
                  sx={{ gridColumn: "span 1" }}
                />

              <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Date début réel"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date_debut_reel || ""}
                  name="date_debut_reel"
                  error={!!touched.date_debut_reel && !!errors.date_debut_reel}
                  helperText={touched.date_debut_reel && errors.date_debut_reel}
                  sx={{ gridColumn: "span 1" }}
                />
              <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Date fin réel"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date_fin_reel || ""}
                  name="date_fin_reel"
                  error={!!touched.date_fin_reel && !!errors.date_fin_reel}
                  helperText={touched.date_fin_reel && errors.date_fin_reel}
                  sx={{ gridColumn: "span 1" }}
                />
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="filled"
                type="text"
                label="Observation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.observation}
                name="observation"
                error={!!touched.observation && !!errors.observation}
                helperText={touched.observation && errors.observation}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Modifier
              </Button>
            </Box>
          </form>
          );
        }}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  intitule_projet: yup.string().required("Requis"),
  localisation: yup.string().required("Requis"),

  budget_global: yup
  .number()
  .typeError("Budget global doit être un nombre")
  .required("Requis")
  .min(0, "Budget global doit être d'au moins 0"), 

  date_debut_previsionnelle: yup
  .date()
  .typeError("Date invalide")
  .required("Requis")
  .max(yup.ref("date_fin_previsionnelle"), "La date de début ne peut pas être supérieure à la date de fin"),

  date_fin_previsionnelle: yup
  .date()
  .typeError("Date invalide")
  .required("Requis")
  .min(yup.ref("date_debut_previsionnelle"), "La date de fin ne peut pas être inféfieure à la date de début"),

  date_fin_reel: yup
  .date()
  .typeError("Date invalide")
  .required("Requis")
  .min(yup.ref("date_debut_reel"), "La date de fin ne peut pas être inférieure à la date de début"),

  date_debut_reel: yup
  .date()
  .typeError("Date invalide")
  .required("Requis")
  .max(yup.ref("date_fin_reel"), "La date de début ne peut pas être supérieure à la date de fin"),

  taux_davancement: yup
  .number()
  .transform((value) => (isNaN(value) ? undefined : value))
  .required("Requis")
  .min(0, "Le taux d'avancement ne peut pas être inférieur à 0")
  .max(100, "Le taux d'avancement ne peut pas être supérieur à 100"),

  secteur: yup.string().required("Requis"),
  paiement: yup
  .number()
  .typeError("Le paiement doit être un nombre")
  .required("Requis")
  .min(0, "Le paiement doit être d'au moins 0"), 
  engagemet: yup
  .number()
  .typeError("L'engagement doit être un nombre")
  .required("Requis")
  .min(0, "L'engagement doit être d'au moins 0"), 
  moa: yup.string().required("Requis"),
  moad: yup.string().required("Requis"),
  statue_etude: yup.string().required("Requis"),
  statue_projet: yup.string().required("Requis"),
  observation: yup.string().required("Requis"),
  programme: yup.string().required("Requis"),
});


export default FormProjet;