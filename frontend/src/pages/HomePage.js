import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/sidebar';
import Feed from '../components/Feed';
import RepositoryList from '../components/RepoList';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        <RepositoryList />
        <Feed />
      </main>
    </div>
  );
};

export default HomePage;