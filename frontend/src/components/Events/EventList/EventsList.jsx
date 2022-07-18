import React from "react";
import './EventsList.css';
import EventItem from "./EventItem/EventItem";
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
                        title={event.title} 
                        userId= {props.authUserId} 
                        creatorId={event.creator._id}
                        price={event.price}/>
                    );
                })
            }
        </ul>
    );
}
export default EventList;