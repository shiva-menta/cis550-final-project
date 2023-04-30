import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div className="px-8 py-2 flex items-center justify-between h-16">
      <div className="w-36 text-center font-bold"><Link to="/" className="no-underline text-white hover:opacity-50">Check-In</Link></div>
      <div className="w-36 text-center font-bold"><Link to="/moodjourney" className="no-underline text-white hover:opacity-50">Mood Journey</Link></div>
      <div className="w-36 text-center font-bold"><Link to="/explorecreators" className="no-underline text-white hover:opacity-50">Creators</Link></div>
      <div className="w-36 text-center font-bold"><Link to="/world" className="no-underline text-white hover:opacity-50">World Emotion</Link></div>
      <div className="w-36 text-center font-bold"><Link to="/titleinfo" className="no-underline text-white hover:opacity-50">Title Info</Link></div>
    </div>
  );
}

export default NavBar;