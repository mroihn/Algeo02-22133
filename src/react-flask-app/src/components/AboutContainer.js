import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Image from '../img/Foto_kelompok.jpg';

function AboutContainer() {
  return (
    <div className="container mt-5 mb-5">
      <header className="text-center mb-5">
        <h1>About Us</h1>
      </header>
      <div className="row">
        <div className="col-md-6">
          <img
            src={Image}
            alt="Team"
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h2>Our Story</h2>
          <p>
            Web ini merupakan hasil dari kerja keras dalam menyelesaikan 
            tugas Aljabar Linear dan Geometri.
          </p>
          <Button variant="primary" as={Link} to="https://github.com/mroihn/Algeo02-22133">
            Visit GitHub
          </Button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6">
          <h2>Our Team</h2>
          <ul className="list-group">
            <li className="list-group-item">Yosef Rafael Joshua - 13522133</li>
            <li className="list-group-item">Muhammad Roihan  - 13522152</li>
            <li className="list-group-item">Rayhan Ridhar Rahman - 13522160</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h2>Contact Us</h2>
          <p>Email (Yosef) : 13522133@std.stei.itb.ac.id</p>
          <p>Email (Roihan) : 13522152@std.stei.itb.ac.id</p>
          <p>Email (Rayhan) : 13522160@std.stei.itb.ac.id</p>
        </div>
      </div>
    </div>
  );
}

export default AboutContainer;
