import React from 'react';
import { Preview } from '@/types/preview';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { GENRE_MAP } from '@/constants/genres';
import styles from '@styles/ShowCard.module.css'; // Import the CSS module

interface Props {
  show: Preview;
}

const ShowCard: React.FC<Props> = ({ show }) => {
  if (!show) return <div>Invalid show data</div>; // Show doesn't exist/isn't available

  const seasonCount = typeof show.seasons === 'number' ? show.seasons : 0;
  const genres = show.genres ? show.genres : [];

  return (
    <Link to={`/show/${show.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <h3>{show.title}</h3>
        <p>{show.description}</p>
        <p>
          <strong>Seasons:</strong> {seasonCount}
        </p>
        <p>
          <strong>Genres: </strong>
          {genres.length > 0
            ? show.genres.map((id) => GENRE_MAP[id]).join(', ')
            : 'No genres available'}
        </p>
        <p>
          <strong>Updated: </strong>
          {formatDistanceToNow(new Date(show.updated), { addSuffix: true })}
        </p>
      </div>
    </Link>
  );
};

export default ShowCard;
