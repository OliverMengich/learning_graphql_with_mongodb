import React, {Component} from 'react';
import authContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
class BookingPage extends Component{
    state={
        isLoading: false,
        bookings: [],
        
    }
    static contextType = authContext;
    componentDidMount(){
        this.fetchBookings()
    }
    deleteBookingHandler=bookingId=>{
        this.setState({isLoading: true})
        const requestBody = {
            query: `
                mutation{
                    cancelBooking(bookingId: "${bookingId}") {
                        _id
                        title
                    }
                }
            `
        }
        fetch('http://localhost:8000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer '+ this.context.token
            }
        })
        .then(res=>{
            if(res.status !== 200 && res.status !==201){
                throw new Error("Failed");
            }
            return res.json();
        })
        .then(()=>{
            this.setState(prevState=>{
                const updatedBookings = prevState.bookings.filter(booking=>{
                    return booking._id !==bookingId;
                });
                return{bookings: updatedBookings, isLoading: false}
            });
        })
        .catch(err=>{
            console.log(err)
            this.setState({isLoading: false});
        })
    }
    fetchBookings=()=>{
        this.setState({isLoading: true})
        const requestBody = {
            query: `
                query{
                    bookings {
                        _id
                        createdAt,
                        event{
                            _id,
                            title,
                            date,
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
                Authorization: 'Bearer '+ this.context.token
            }
        })
        .then(res=>{
            if(res.status !== 200 && res.status !==201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(resData=>{
            const bookings= resData.data.bookings;
            // console.log(bookings);
            this.setState({bookings, isLoading: false});
        })
        .catch(err=>{
            console.log(err);
            this.setState({isLoading: false});
        })
    }
    render(){
        
        return(
            <React.Fragment>
                {
                    this.state.isLoading ? <p>Loading.....</p> : (
                        this.state.bookings.length !== 0?
                            (
                                <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/>
                            ): <h2>You have no Bookings Go to events and book an event</h2>
                        
                    )
                }
            </React.Fragment>
        );
    }
}
export default BookingPage;