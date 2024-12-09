import React from "react";
import input from "./input";
import Button from "./Button";


function NavBar() {
    
  return (
    <>
        <nav class="navbar navbar-dark navbar-expand bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand">Sistemas Operativos 1</a>
                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                    <a class="nav-link active" aria-current="page">Clase 3</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link">Juan Enrique Gomez</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link">202004745</a>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    </>
  );
}

export default NavBar;