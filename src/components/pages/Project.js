import {parse, v4 as uuidv4} from 'uuid'

import styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import Message from '../layout/Message'
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

function Project() {

    const {id} = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [message, setMessage] =useState()
    const [type, setType] = useState()
    const [showServiceForm, setShowServiceForm] = useState(false)



    useEffect(() =>{
      setTimeout(() => {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
                },
            }).then(resp => resp.json())
            .then((data) =>{
                setProject(data)
                setServices(data.services)
            })
            .catch(err => console.log)
    
      }, 300)  
    }, [id])


function editPost (project){
    setMessage('')

    // budget validation 
    if(project.budget < project.cost){
        setMessage('O orçamento não pode ser menor que o custo do projeto!')
        setType('error')
        return false
    }

    fetch(`http://localhost:5000/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(project),
    })
    .then(resp => resp.json())
    .then((data => {

        setProject(data)
        setShowProjectForm(false)
        setMessage('Projeto atualizado com sucesso!')
        setType('success')

    }))
    .catch(err => console.log(err))
}

function createService(project){
    setMessage('')
    // last service
    const lastService = project.services[project.services.length - 1]

    lastService.id = uuidv4()

    const lastServiceCost = lastService.cost

    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
    
    // maximum value validation
    if(newCost > parseFloat(project.budget)){
        setMessage('Orçamento ultrapassado, verifique o valor do serviço');
        setType('error');
        project.services.pop();
        return false;
    }
        //add service cost to project total cost
        project.cost = newCost

        // update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setShowServiceForm(false)
        })
        .catch(err => console.log(err))

    }

function removeService (){

}



function toggleProjectForm() {
    setShowProjectForm(!showProjectForm)
}

function toggleServiceForm(){
    setShowServiceForm(!showServiceForm)
}

    return (<>
    {project.name ? (
        <Container customClass="column">
            <div className={styles.project_details}>
                {message && <Message type={type} msg={message} />}
                <div className={styles.details_container}>
                    <h1>Projeto: {project.name}</h1>
                    <button onClick={toggleProjectForm} className={styles.btn}>
                        {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria: </span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de orçameto: </span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total utilizado: </span> R${project.cost}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.project_info}>
                                <ProjectForm handleSubmit={editPost} btnText="Concluir edição" projectData={project} />
                            </div>
                        )}
                </div>
                <div className={styles.service_form_container}>
                    <h2>Adicione um serviço</h2>
                    <button onClick={toggleServiceForm} className={styles.btn}>
                    {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                    </button>
                    <div className={styles.project_info}>
                        {showServiceForm && (
                            <ServiceForm
                            handleSubmit={createService}
                            btnText="Adicionar Serviço"
                            projectData = {project}
                            /> 
                        )}
                    </div>
                </div>
                <h2>Serviços</h2>
                <Container customClass="start">
                    {services.length > 0 &&
                        services.map((service) =>(
                            <ServiceCard 
                                id={service.id}
                                name={service.name}
                                cost={service.cost}
                                description={service.description}
                                key={service.id}
                                handleRemove ={removeService}

                            />
                        ))
                    }
                    {services.length === 0 && <p>Não há serviços cadastrados.</p>} 
                </Container>
                </div>
            </Container>
        
    ): (
        <Loading />
    )}
    </>);
}
export default Project