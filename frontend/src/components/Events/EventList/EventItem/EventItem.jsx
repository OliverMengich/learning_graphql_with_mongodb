import React from "react";
import './EventItem.css';
const EventItem = (props) => {
    return (
    <li className='events__list-item'>
        <div>
            <h1>{props.title}</h1>
            <h3>${props.price +" - "+ new Date(props.date).toLocaleDateString()}</h3>
            <p>{props.description}</p>
        </div>
        <div>
            {props.userId === props.creatorId?<p>Your the Owner of this Event</p> : <button onClick={props.onDetail.bind(this, props.eventId)} className="btn">View Details</button>}
        </div>
    </li>)
}
export default EventItem;