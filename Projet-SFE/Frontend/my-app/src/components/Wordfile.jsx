import React, { useEffect, useState } from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import saveAs from "file-saver";
import { getProjectsById } from "../utils/api";
import { Button, useTheme } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import { tokens } from '../theme';


const Wordfile = ({ id_projet }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    getProjectsById(id_projet)
      .then((data) => setProjectData(data))
      .catch((error) => console.log(error));
  }, [id_projet]);

  const handleExport = () => {
    if (projectData) {
      // Load the template file
      const templatePath = "/WordTemplate.docx";
      const xhr = new XMLHttpRequest();
      xhr.open("GET", templatePath, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (xhr.status === 200) {
          const templateData = new Uint8Array(xhr.response);
          const zip = new PizZip(templateData);
          const doc = new Docxtemplater().loadZip(zip);

          // Set the data to be merged with the template
          doc.setData(projectData);

          // Perform the template merging
          doc.render();

          // Get the generated document as a Blob
          const generatedDoc = doc.getZip().generate({ type: "blob" });

          // Save the generated document
          saveAs(generatedDoc, "PlanTrack.docx");
        }
      };
      xhr.send();
    }
  };

  return (
    <Button
    onClick={handleExport}
    sx={{
      backgroundColor: colors.blueAccent[700],
      color: colors.grey[100],
      fontSize: '14px',
      fontWeight: 'bold',
      padding: '10px 20px',
      marginRight: '10px',
    }}
  >
    <GetAppIcon sx={{ mr: '10px' }} />
  Fiche de projet -WORD
  </Button>
  );
};

export default Wordfile;
