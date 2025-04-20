import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '@styles/NavigationBar.css';

function NavigationBar() {
  const [menuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isOnHomePage = location.pathname === '/';
  const isOnFavouritesPage = location.pathname === '/favourites';
  const toggleMenu = () => {
    setIsMenuOpen(!menuOpen);
  };

  //Close the menu when a link is clicked
  useEffect(() => {
    setIsMenuOpen(false); // Close the menu when the location changes
  }, [location]);

  //Reset localStorage function within burger menu
  const resetLocalStorage = () => {
    const confirmed = window.confirm(
      'are you sure you want to reset all user data?'
    );
    if (confirmed) {
      localStorage.clear(); // Clear all local storage data
      alert('All user data has been reset!'); // User feedback - data reset
      window.location.reload(); // Reload the page to reflect changes
    }
  };

  return (
    <nav className="navbar">
      <div
        id="burger-menu"
        className={menuOpen ? 'close' : 'open'}
        onClick={toggleMenu}
      >
        <span></span>
      </div>
      <div id="menu" className={menuOpen ? 'overlay' : ''}>
        <ul>
          {!isOnHomePage && (
            <li>
              <Link to="/">Home</Link>
            </li>
          )}
          {!isOnFavouritesPage && (
            <li>
              <Link to="/favourites">Favourites</Link>
            </li>
          )}
          <li>
            <button onClick={resetLocalStorage}>Reset ALL User Data</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;
