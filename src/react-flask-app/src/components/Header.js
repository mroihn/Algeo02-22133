import React from 'react';

function Header() {
  const jumbotronStyle = {
    marginTop: '80px',
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 text-center">
          <div className="jumbotron" style={jumbotronStyle}>
            <h1 className="display-4">Image Search App</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
