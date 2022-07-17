import React, {Component} from 'react';
import { BrowserRouter, Route,Routes, Navigate} from 'react-router-dom'
import './App.css';
import AuthPage from './pages/AuthPage';
import BookingsPage from './pages/BookingsPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import './App.css';
import AuthContext from './context/auth-context';
import MainNavigation from './components/Navigation/MainNavigation.jsx';
class App extends Component{
  
  state = {
    token: null,
    userId: null
  }
  login = (token, userId,tokenExpiration) =>{
    this.setState({token: token, userId, tokenExpiration});
  }
  logout = () =>{
    this.setState({
      token: null,
      userId: null
    })
  }
    render(){
        return(
          <BrowserRouter>
          <AuthContext.Provider 
              value={{
                token: this.state.token, 
                userId: this.state.userId, 
                login: this.login, 
                logout: this.logout
              }}
            >
            <MainNavigation />
              <main className="main-content">
                <Routes>
                  {!this.state.token && (
                    <Navigate from="/"  to="/auth" exact />
                  )}
                  {this.state.token && (
                    <Navigate from="/"  to="/events" exact />
                  )}
                  {this.state.token && (
                    <Navigate from="/auth"  to="/events" exact />
                  )}
                  {!this.state.token && (
                    <Route path="/auth" element={<AuthPage/>}/>
                  )}
                  <Route path="/events" element={<EventsPage/>} exact/>
                  { this.state.token && (
                    <Route path="/bookings" element={<BookingsPage/>} />
                  )}
                </Routes>
              </main>
          </AuthContext.Provider>
          </BrowserRouter>
        )
    }
}
export default App;