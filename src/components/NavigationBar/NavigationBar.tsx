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
        </ul>
      </div>
    </nav>
  );
}
export default NavigationBar;
