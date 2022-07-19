import React from "react";
import './EventsList.css';
import EventItem from "./EventItem/EventItem";
// import Modal from "../../modal/Modal";
const EventList = (props) => {
    // const events = props.events.map(event=>{
    //     return <EventItem key={event._id} title={event.title}/>
    // });
    return (
        <ul className='events__list'>
            {
                props.events.map(event=>{
                    return (
                    <EventItem 
                        key={event._id} 
                        eventId = {event._id}
                        title={event.title} 
                        description={event.description}
                        userId= {props.authUserId} 
                        date={event.date}
                        creatorId={event.creator._id}
                        onDetail={props.onViewDetail}
                        price={event.price}/>
                    );
                })
            }
        </ul>
    );
}
export default EventList;