import React from 'react';
import { Preview } from '../../types/preview';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const GENRE_MAP: Record<number, string> = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

interface Props {
  show: Preview;
}

const ShowCard: React.FC<Props> = ({ show }) => {
  if (!show) return <div> Invalid show data </div>; //Show doesn't exist/isn't available

  const seasonCount = typeof show.seasons === 'number' ? show.seasons : 0;
  const genres = show.genres ? show.genres : [];
  return (
    <Link to={`/show/${show.id}`}>
      <div>
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
          <strong>Updated:</strong>
          {formatDistanceToNow(new Date(show.updated), { addSuffix: true })}
        </p>
      </div>
    </Link>
  );
};

export default ShowCard;
