import React from "react";
import { Switch, Route } from "react-router-dom";

import './App.css';
import './login-register.css';


import Home from "./components/home.component";
import Favorites from "./components/favorites.component";
import Cnbst from "./components/cnbst.component";
import Profile from "./components/profile.component";
import Logout from "./components/logout.component";
import Login from "./components/login.component";
import Register from "./components/register.component";


function App() {
  
  return (     
    <BrowserRouter  basename="http://toilahuong.tech/giphy">
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/favorites" exact component={Favorites} />
        <Route path="/bst/:id" exact component={Cnbst} />
        <Route path="/profile/" component={Profile} />
        {/* <Route path="/profile/:username" component={Profile} /> */}
        <Route path="/logout" exact component={Logout} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
      </Switch> 
    </BrowserRouter>
  );
}

export default App;
