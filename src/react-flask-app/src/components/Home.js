// Home.js
import React from 'react';
import Header from './Header';
import ImageUploadButton from './ImageUploadButton';
import Result from './Result';
import Navbars from './Navbar';

function Home() {
  return (
    <div className="justify-content-center">
    <Navbars/>
      <Header/>
      <ImageUploadButton/>
      <Result/>
   </div>
  );
}

export default Home;