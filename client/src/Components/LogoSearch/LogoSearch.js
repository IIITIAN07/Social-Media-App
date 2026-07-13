import React, { useEffect, useState } from 'react'
import './LogoSearch.css'
import Logo from '../../Img/logo.png';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { getAllUser } from '../../api/UserRequest';
import publicFolder from '../../utils/publicFolder';

const LogoSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await getAllUser();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const matches = query.trim()
    ? users.filter((user) => `${user.firstname} ${user.lastname}`.toLowerCase().includes(query.toLowerCase()))
    : [];

  const openProfile = (userId) => {
    setQuery('');
    setShowResults(false);
    navigate(`/profile/${userId}`);
  };

  const handleSearch = () => {
    if (matches.length > 0) {
      openProfile(matches[0]._id);
    } else if (query.trim()) {
      window.alert('No user found');
    }
  };

  return (
    <div className='LogoSearch'>

      <img src={Logo} alt="" />

      <div className="Search">
        <input
          type="text"
          placeholder='Search users'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />

        <div className="s-icon" onClick={handleSearch}>
          <SearchIcon />
        </div>

        {showResults && matches.length > 0 && (
          <div className="searchResults">
            {matches.slice(0, 5).map((person) => (
              <div className="searchResult" key={person._id} onClick={() => openProfile(person._id)}>
                <img src={person.profilePicture ? publicFolder + person.profilePicture : publicFolder + 'defaultProfile.png'} alt="" />
                <span>{person.firstname} {person.lastname}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default LogoSearch
