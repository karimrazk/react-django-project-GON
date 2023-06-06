import axios from 'axios';
import { BASE_URL } from './url'; 



export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}users`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}users/${id}/`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUsersEMPLOYE = async () => {
  try {
    const response = await axios.get(`${BASE_URL}users/employe_users/`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}users/`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Une erreur s'est produite lors de l'ajout du fonctionnaire.");
    }
  }
};

export const updateUser = async (id_fonctionnaire, editedata) => {
  try {
    const response = await axios.put(`${BASE_URL}users/${id_fonctionnaire}/`, editedata);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Cette adresse e-mail est déjà utilisée.");
    }
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCountProgProjByUser = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}users/${userId}/program_and_project_counts/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting data");
  }
};

export const getProgrammesForEMP = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/user/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting program data");
  }
};

export const getProgrammes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProgrammesWithNombreProj = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/get_programmes_with_nombre_projet/`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getNewlyCreatedProjet = async () => {
  try {
    const response = await axios.get(`${BASE_URL}projets/newly_created_projets`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const getProgrammeById = async (id_programme) => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/${id_programme}/`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};



export const addProgramme = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}programmes/`, formData);
      return response.data;
    } catch (error) {
      console.error(error.response);
      throw new Error('Error creating program');
    }
  };

  export const updateProgramme = async (id_programme, editedrow) => {
    try {
      const response =await axios.put(`${BASE_URL}programmes/${id_programme}/`, editedrow);
    } catch (error) {
      throw new Error(error);
    }
  };



export const deleteProgramme = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}programmes/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };


  export const getProjectsByProgramme = async (id_programme) => {
    try {
      const response = await axios.get(`${BASE_URL}programme/${id_programme}/prgramme_projects/`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const getProjectsById = async (id_projet) => {
    try {
      const response = await axios.get(`${BASE_URL}project_programme_data/${id_projet}/`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const getProjectsForUser = async (id_user) => {
    try {
      const response = await axios.get(`${BASE_URL}users/${id_user}/projects/`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };


  export const getProjectCount = async (programmeId) => {
    try {
      const response = await axios.get(`${BASE_URL}programmes/${programmeId}/count_projectsforOneProgramme/`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const getMoyenneTauxAvancement = async (programmeId) => {
    try {
      const response = await axios.get(`${BASE_URL}programmes/${programmeId}/calculate_moyenne_taux_avancement/`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };


  export const addProjet = async (formData, idProgramme) => {
    try {
      formData.append('programme', idProgramme);
      const response = await axios.post(`${BASE_URL}projets/`, formData);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };


  export const updateProjet = async (id_projet, values) => {
    try {
       await axios.put(`${BASE_URL}projets/${id_projet}/`, values);
    } catch (error) {
      throw new Error(error);
    }
  };

  export const deleteProjet = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}projets/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };



  export const getListOfProjectsName = async (id_programme) => {
    try {
      const response = await axios.get(`${BASE_URL}listOfprojetname/${id_programme}/`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const getListOfPartenairesName = async () => {
    try {
      const response = await axios.get(`${BASE_URL}partenairelist`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };


  export const getListOfParticipations = async (programId,projectId) => {
    try {
      const response = await axios.get(`${BASE_URL}participations/contributions_by_project/?program_id=${programId}&project_id=${projectId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const addParticipation = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}participations/`, formData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.non_field_errors) {
        const errorMessage = error.response.data.non_field_errors[0];
        throw new Error(errorMessage);
      }else {
        throw new Error("Une erreur s'est produite lors de l'ajout de la participation.");
      }
    }
  };
  
  export const updateParticipation = async (id, updatedData) => {
    try {
      const response = await axios.put(`${BASE_URL}participations/${id}/`, updatedData);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour de participation");
    }
  };

  export const deleteParticipation = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}participation/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const getPartenaires = async () => {
    try {
      const response = await axios.get(`${BASE_URL}partenaires`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching partenaires");
    }
  };

  export const addPartenaire = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}partenaires/`, formData);
      return response.data; 
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        console.error('Error creating partner:', error);
      }
      throw error;
    }
  };

  export const updatePartenaire = async (id, updatedData) => {
    try {
      const response = await axios.put(`${BASE_URL}partenaires/${id}/`, updatedData);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour de partenaire");
    }
  };

  export const deletePartenaire = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}partenaires/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting partenaire");
    }
  };

 

  export const getNbrReunionForUser = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}reunion/count_for_user/${id}/`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching reunion");
    }
  };

  export const getUpComingReunion = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}reunion/upcoming_reunions/?user_id=${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching reunion");
    }
  };
  
  export const getReunions = async (user_id) => {
    try {
      const response = await axios.get(`${BASE_URL}reunions/${user_id}`);
      const events = response.data.map((event) => {
        return {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          description: event.description,
        };
      });
      return events;
    } catch (error) {
      console.error(`Error retrieving events for user ${user_id}: ${error}`);
      throw new Error(`Error retrieving events for user ${user_id}: ${error}`);
    }
  };

  export const updateReunion = async (userId, eventId, updatedData) => {
    try {
      const response = await axios.put(`${BASE_URL}reunion/${userId}/${eventId}/`, updatedData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const addReunion = async (title, start, end, description, user_id) => {
    try {
      const response = await axios.post(`${BASE_URL}reunion/`, {
        title: title,
        start: start,
        end: end,
        description: description,
        user: user_id,
      });
      return {
        id: response.data.id,
        title: response.data.title,
        start: response.data.start,
        end: response.data.end,
        description: response.data.description,
      };
    } catch (error) {
      console.log(error.response);
    }
  };

  export const deleteReunion = async (userId, eventId) => {
    const response = await axios.delete(`${BASE_URL}user/${userId}/reunion/${eventId}/`);
    return response.data;
  };


// ******************************statistiques**********************************


export const getNbrPrjPrgPartUserforAdminSup = async () => {
  try {
    const response = await axios.get(`${BASE_URL}statistics/`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching data");
  }
};

export const getRoleDistribution = async () => {
  try {
    const response = await axios.get(`${BASE_URL}statistics/role_distribution/`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching data");
  }
};

export const getDivisionDistribution = async () => {
  try {
    const response = await axios.get(`${BASE_URL}statistics/user_distribution_by_division/`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching data");
  }
};

export const getContributionPartenaireForAllProgramme = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/contributions/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};

export const getSecteurforAllProgramme = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/sector_percentages/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};


export const getSecteurforAllProgrammeByUser = async (user_id) => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/sector_percentagesByUser/${user_id}/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};

export const getStatusProjetForAllProgramme = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/count_projectsforAllProgramme/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};

export const getStatusProjetForAllProgrammeByUser = async (user_id) => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/count_statusProjet_for_all_programsUser/?user_id=${user_id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};

export const getStatusProjetForAllProgrammes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/statusProjetForAllProgramme/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};


export const getBudgetProjetProgramme = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/programmes_with_budget_global`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};

export const getMinMaxBudgetGlobalProget = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/get_budget_stats/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};


export const getPartnerContributionPerProjet = async (id_projet,id_programme) => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/${id_programme}/partner_contribution_projet/?project_id=${id_projet}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};

export const get_programmes_with_tauxavancement = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/get_programmes_with_tauxavancement`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};

export const getcountStatusProjetByProgramme = async (id_programme) => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/count_projectsforSpecificProgramme/?program_id=${id_programme}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};


export const getPartnerContributionPerProgramme = async () => {
  try {
    const response = await axios.get(`${BASE_URL}programmes/5/partner_contribution_programme/`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching data");
  }
};

