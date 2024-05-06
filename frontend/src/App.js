import logo from './logo.svg';
import './App.css';

import Header from './components/Header';
import AppContent from './components/AppContent';
import Footer from "./components/Footer";


function App() {
  return (
    <div className="App">

      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <AppContent />
          </div>
        </div>
      </div>
        <Footer />
    </div>
  );
}

export default App;
