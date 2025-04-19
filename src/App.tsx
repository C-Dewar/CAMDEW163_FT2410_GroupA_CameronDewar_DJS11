import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShowDetails from './pages/ShowDetails';
import Favourites from '@/pages/Favourites.tsx';
import NavigationBar from '@components/NavigationBar/NavigationBar';
import '@styles/NavigationBar.css'; // Import your CSS file for styles
function App() {
  return (
    <Router>
      <NavigationBar />
      <div style={{ marginTop: '60px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
