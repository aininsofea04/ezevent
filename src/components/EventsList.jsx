import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLocation } from "react-router-dom"; // Import useLocation to check URL
import { db } from "../firebase";
import EventCard from "./EventCard";
import "../css/EventsList.css";

export default function EventsList({
    collectionName = "events",
    onClickAction,
    ActionText,
    userId,
    userRole
}) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Hook to get current route

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            console.log("Fetching events for role:", userRole, "and userId:", userId);
            try {
                let eventsData = [];
                const eventsCollection = collection(db, "events");


                if (userRole === "participant" && location.pathname.includes("registration")) {
                    

                    const regQuery = query(
                        collection(db, "registrations"), 
                        where("userId", "==", userId)
                    );
                    const regSnapshot = await getDocs(regQuery);
                    const registeredEventIds = regSnapshot.docs.map(doc => doc.data().eventId);


                    if (registeredEventIds.length === 0) {
                        setEvents([]);
                        setLoading(false);
                        return;
                    }

                    // Now fetch all events and filter for the ones in the list
                    // (Note: Firestore 'in' query supports max 10 items, so client-side filtering is safer for larger lists)
                    const eventSnapshot = await getDocs(eventsCollection);
                    eventsData = eventSnapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(event => registeredEventIds.includes(event.id));

                } 
                
                // --- 2. ALL OTHER CASES (Organizer, Admin, Participant on Home) ---
                else {
                    const snapshot = await getDocs(eventsCollection);
                    let rawEvents = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    // Logic: Organizer
                    // "if role = organizer, it will only show events that have user id same as it"
                    if (userRole === "organizer") {
                        eventsData = rawEvents.filter(event => event.ownerId === userId);
                    }

                    // Logic: Participant (Available Events)
                    // "if role = participant and is on url '' or 'event', show available events with date not exceeded"
                    else if (userRole === "participant") {
                        const currentDate = new Date();
                        
                        eventsData = rawEvents.filter(event => {
                            // Convert the Firestore string date to a JS Date object
                            // Assuming format: "December 18, 2025 at 10:17:00 PM UTC+8"
                            const eventDate = new Date(event.date); 
                            return eventDate > currentDate; // Only show future events
                        });
                    }

                    // Logic: Admin
                    // "if role = admin just show all events"
                    else if (userRole === "admin") {
                        eventsData = rawEvents;
                    } 
                    
                    // Fallback (e.g. guest user)
                    else {
                        eventsData = rawEvents;
                    }
                }

                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [collectionName, userId, userRole, location.pathname]); // Re-run if user, role, or page changes

    if (loading) return <p>Loading events...</p>;

    return (
        <div className="events-container">
            {events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <div className="events-grid">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={onClickAction}
                            buttonText={ActionText}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}