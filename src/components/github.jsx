import React, { useState } from 'react';

const APIURL = 'https://api.github.com/users/';

const GithubProfiles = () => {
  const [user, setUser] = useState('');
  const [userData, setUserData] = useState(null);
  const [userRepos, setUserRepos] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const response = await fetch(APIURL + user);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          getRepos(user);
          setUser('');
        } else {
          createErrorCard('No profile with this username');
        }
      } catch (err) {
        createErrorCard('Error occurred while fetching data');
      }
    }
  };

  const getRepos = async (username) => {
    try {
      const response = await fetch(APIURL + username + '/repos?sort=created');
      if (response.ok) {
        const data = await response.json();
        setUserRepos(data.slice(0, 5));
      } else {
        createErrorCard('Problem fetching repos');
      }
    } catch (err) {
      createErrorCard('Error occurred while fetching repos');
    }
  };

  const createErrorCard = (msg) => {
    return (
      <div className="card">
        <h1>{msg}</h1>
      </div>
    );
  };

  const createUserCard = () => {
    const userID = userData.name || userData.login;
    const userBio = userData.bio ? <p>{userData.bio}</p> : null;

    return (
      <div className="card">
        <div>
          <img src={userData.avatar_url} alt={userData.name} className="avatar" />
        </div>
        <div className="user-info">
          <h2>{userID}</h2>
          {userBio}
          <ul>
            <li>
              {userData.followers} <strong>Followers</strong>
            </li>
            <li>
              {userData.following} <strong>Following</strong>
            </li>
            <li>
              {userData.public_repos} <strong>Repos</strong>
            </li>
          </ul>

          <div id="repos">
            {userRepos.map((repo) => (
              <a
                key={repo.id}
                className="repo"
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repo.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <form className="user-form" onSubmit={handleSearch}>
        <input
          type="text"
          id="search"
          placeholder="Search a Github User"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </form>

      <main id="main">
        {userData ? createUserCard() : <div style={{color:"black"}}>Search for a GitHub user....</div>}
      </main>
    </div>
  );
};

export default GithubProfiles;