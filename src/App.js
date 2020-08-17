import React from "react";
//import { render } from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Componentes/Home";
import About from "./Componentes/About";
import Shop from "./Componentes/Shop";
import NavBar from "./Componentes/Navbar";

function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/about" component={About} exact />
        <Route path="/shop" component={Shop} exact />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );

  /*
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/about" component={About} exact />
        <Route path="/contacts" component={Contacts} exact />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>


  );
  */
}

export default App;
