import React, {Component} from 'react';
import '../index.css';
import './EventsPage.css';
import authContext from '../context/auth-context';
import Modal from '../components/modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventsList';
class EventsPage extends Component{
    state={
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    }
    isActive=true
    static contextType = authContext;
    constructor(props){
        super(props);
        this.titleElRef= React.createRef();
        this.dateElRef= React.createRef();
        this.priceElRef= React.createRef();
        this.descriptionElRef= React.createRef();
    }
    componentDidMount(){
        this.fetchEvents();
    }
    createEventHandler = () =>{
        this.setState({creating: true});
    }
    modalConfirmHandler = () =>{
        this.setState({creating: false});
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;
        console.log(title, price, date, description);
    
        if(title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0){
            return;
        }
        //send it to backend
        const requestBody = {
            query: `
                mutation{
                    createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}){
                        _id
                        title
                        description
                        date
                        price
                        
                    }
                }
            `
        }
        const token = this.context.token;
        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            if(res.status !== 200 && res.status !==201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(resData=>{
            // this.fetchEvents();
            this.setState((prevState)=>{
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator: {
                        _id: this.context.userId,
                        email: this.context.userEmail
                    }
                });
                return {events: updatedEvents};  
            })
            console.log(resData);
        })
        .catch(err=>{
            console.log(err)
        })
    }
    modalCancelHandler = () =>{
        this.setState({creating: false, selectedEvent: null});
    }
    showDetailHandler = (eventId)=>{
        console.log(this.state);
        console.log(eventId);
        console.log("Hello");
        this.setState(prevState=>{
            const selectedEvent = prevState.events.find(e=>e._id ===eventId)
            console.log(selectedEvent);
            return {selectedEvent: selectedEvent}
        })
    }
    bookEventHandler= ()=>{
        if(!this.context.token){
            this.setState({
                selectedEvent: null
            });
            return;
        }
        const requestBody = {
            query: `
                mutation{
                    bookEvent(eventId: "${this.state.selectedEvent._id}"){
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `
        }
        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.context.token
            }
        })
        .then(res=>{
            if(res.status !== 200 && res.status !==201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(resData=>{
            this.setState({selectedEvent: null});
            console.log(resData);
        })
        .catch(err=>{
            console.log(err)
        })
    }
    fetchEvents(){
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                query{
                    events{
                        _id
                        title
                        description
                        date
                        price
                        creator{
                            _id
                            email
                        }
                    }
                }
            `
        }
        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res=>{
            if(res.status !== 200 && res.status !==201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(resData=>{
            const events= resData.data.events;
            this.setState({events: events, isLoading: false});
            if(this.isActive){
                this.setState({events: events, isLoading: false});
            }
        })
        .catch(err=>{
            console.log(err)
            if(this.isActive){
                this.setState({isLoading: false});
            }
        })
    }
    componentWillUnmount(){
        this.isActive=false
    }
    render(){
        // console.log(this.context);
        return(
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent)&& <Backdrop/>}
                {this.state.creating && 
                    <Modal title="Add Event" confirmText="Confirm" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}> 
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" name="title" placeholder="Name of the event" ref={this.titleElRef}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" name="price" placeholder="Price of the event" ref={this.priceElRef}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" name="date" placeholder="Date of the event" ref={this.dateElRef}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" name="description" placeholder="Description of the event" ref={this.descriptionElRef}></textarea>
                            </div>
                        </form>
                    </Modal>
                }
                {
                    this.state.selectedEvent &&(
                        <Modal 
                            title={this.state.selectedEvent.title}
                            canCancel
                            confirmText={this.context.token ?"Book" : 'COnfirm'}
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.bookEventHandler}
                            >
                                <h1>{this.state.selectedEvent.title}</h1>
                                <h2>{"$"+ this.state.selectedEvent.price + " - "+ new Date(this.state.selectedEvent.date).toLocaleDateString() }</h2>
                        </Modal>
                    )
                }
                {this.context.token &&
                    (
                        <div className='events-control'>
                            <p>Events Page</p>
                            <button onClick={this.createEventHandler}  className='btn'>Create Event</button>
                        </div>
                    )
                }
                {
                    this.state.isLoading ? (<p>Loading...</p>) :(<EventList events={this.state.events} onViewDetail={this.showDetailHandler} authUserId={this.context.userId}/>)
                }
                
            </React.Fragment>
        );
    }
}
export default EventsPage;