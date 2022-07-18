import React from "react";
import './EventItem.css';
const EventItem = (props) => {
    console.log("User id: " +props.userId);
    console.log("Creator id: " + props.creatorId)
    return (
    <li className='events__list-item'>
        <div>
            <h1>{props.title}</h1>
            <h2>${props.price}</h2>
        </div>
        <div>
            {props.userId === props.creatorId?<p>Your the Owner of this Event</p> : <button className="btn">View Details</button>}
            
        </div>
    </li>)
}
export default EventItem;