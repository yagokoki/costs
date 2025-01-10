import { useLocation } from "react-router-dom";

import Message from "../layout/Message";
import styles from "./Project.module.css"

function Projects() {

  const location = useLocation()
  let message = ''
  if(location.state){
    message = location.state.message
  }

    return (
      <div className={styles.projects}>
        <h1>Meus Projetos</h1>
        {message && <Message type="sucess" msg={message} />}
      </div>
    );
  }
  
  export default Projects;