import React from 'react';
import {useState} from 'react';
import '../styles/global.css';

const CreateProject = () =>{
    const [isOpen, setIsOpen] = React.useState(false);

    return(
        <div id="Create">
            <button onClick={() => setIsOpen(true)}><span className="material-symbols-outlined">add</span></button>

              <div className={`${isOpen ? 'show' : 'close'}`} >
                <h2>Add New Repository</h2>
                  <h3>Repository Name</h3>
                  <input
                    id="repo-name"
                    placeholder="Project Name"
                    required
                  />
                  <h3>Description</h3>
                  <input
                    id="repo-description"
                    placeholder="A brief description of your project"
                    required
                  />
                <button type="submit" onClick={() => setIsOpen(false)}>
                  Add Repository
                </button>
              </div>
        </div>
    );
} 

export default CreateProject;