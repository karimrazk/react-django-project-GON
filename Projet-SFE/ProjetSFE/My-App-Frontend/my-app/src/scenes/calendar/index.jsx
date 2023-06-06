import { useState, useEffect, useContext } from "react";
import React from 'react';
import '@fullcalendar/react/dist/vdom';
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import AuthContext from "../../context/AuthContext";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { addReunion, getReunions, deleteReunion, updateReunion } from "../../utils/api";


const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const { user } = useContext(AuthContext)


  const handleDateClick = async (selected) => {
    const title = prompt("Veuillez entrer un nouveau titre pour votre événement");
    const start = selected.start.toISOString();
    const end = selected.end.toISOString();
    const description = prompt("Veuillez saisir une description de votre événement (facultatif)");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEvent = await addReunion(title, start, end, description, user.user_id);
      if (newEvent) {
        setCurrentEvents((currentEvents) => [...currentEvents, newEvent]);
      }
    }
  };


  const handleEventClick = async (selected) => {
    const action = prompt(
      "Veuillez sélectionner une action :\n1. Mettre à jour l'événement\n2. Supprimer l'événement"
    );

    if (action === "1") {
      // Update event
      const updatedTitle = prompt(
        "Veuillez entrer un nouveau titre pour l'événement.",
        selected.event.title
      );
      const updatedDescription = prompt(
        "Veuillez saisir une nouvelle description pour l'événement.",
        selected.event.extendedProps.description
      );

      if (updatedTitle) {
        const eventId = selected.event.id;
        try {
          await updateReunion(user.user_id, eventId, {
            title: updatedTitle,
            description: updatedDescription,
          });

          const updatedEvents = currentEvents.map((event) => {
            if (event.id === eventId) {
              return {
                ...event,
                title: updatedTitle,
                description: updatedDescription,
              };
            } else {
              return event;
            }
          });
          setCurrentEvents(updatedEvents);
  
          // Fetch updated events
          const start = selected.view.calendar.view.activeStart;
          const end = selected.view.calendar.view.activeEnd;
          const events = await getReunions(user.user_id, start, end);
          setCurrentEvents(events);
        } catch (error) {
          console.log(error);
        }
      }
    } else if (action === "2") {
      // Delete event
      if (
        window.confirm(`Êtes-vous sûr(e) de vouloir supprimer l'événement'${selected.event.title}'?`)
      ) {
        const eventId = selected.event.id;
        try {
          await deleteReunion(user.user_id, eventId);
          const calendarApi = selected.view.calendar;
          const updatedEvents = await getReunions(user.user_id, calendarApi.view.activeStart, calendarApi.view.activeEnd);
          setCurrentEvents(updatedEvents);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleDatesSet = async (fetchInfo) => {
    try {
      const start = fetchInfo.startStr;
      const end = fetchInfo.endStr;
      const events = await getReunions(user.user_id, start, end);
      setCurrentEvents(events);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleDatesSet({ startStr: "", endStr: "" }); // Fetch initial events when the component mounts
  }, []);


  return (
    <Box m="20px" >
      <Header title="Calendrier" subtitle="N’hésiter pas d’ajouter vous évènement" />

      <Box display="flex" justifyContent="space-between">

        {/* CALENDAR SIDEBAR */}

        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Événements</Typography>
          {currentEvents.length === 0 ? (
            <Typography variant="body1">Aucun événement à afficher.</Typography>
          ) : (
            <List>
              {currentEvents.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {formatDate(event.start, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {event.description}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

        </Box>
        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            eventClick={handleEventClick}
            events={currentEvents}
            datesSet={handleDatesSet}
            select={handleDateClick}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;