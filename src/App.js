import './App.scss';
import Header from './components/Header';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './page/Home';
import Map from './page/Map';
import Plastic from './page/Plastic';

function App() {
  return (
    <div className='app-container'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/map' element={<Map />} />
        <Route path='/plastic' element={<Plastic />} />
      </Routes>
    </div>
  );
}

export default App;
