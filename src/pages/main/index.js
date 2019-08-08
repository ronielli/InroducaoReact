import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Form, SubmitButton, List } from './styles';
import Container from '../../Components/Conteiner'
import { Link } from 'react-router-dom'
import api from '../../services/api'
export default class Main extends Component {
  state = {
    newRepo: "",
    repositories: [],
    loading: false
  }
  async componentDidMount() {

    const repositories = await localStorage.getItem('repositories')

    if (repositories) {

      this.setState({ repositories: JSON.parse(repositories) })
    }
  }
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }

  }
  handleImputChange = e => {
    this.setState({ newRepo: e.target.value })
  }
  handleSubmit = async e => {
    e.preventDefault();
    const { newRepo, repositories } = this.state
    this.setState({ loading: true })
    const response = await api.get(`repos/${newRepo}`)

    const data = {
      name: response.data.full_name,
    }
    this.setState({
      repositories: [...repositories, data],
      newRepo: "",
      loading: false,

    })

  }
  render() {
    const { newRepo, loading, repositories } = this.state
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Reposióties
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            value={newRepo}
            onChange={this.handleImputChange}

            type="text"
            placeholder='Adicionar repositorio' />
          <SubmitButton loading={loading}>
            {loading ? <FaSpinner color="#FFF" size={14} /> : <FaPlus color="#FFF" size={14} />}
          </SubmitButton>

        </Form>
        <List>
          {repositories.map(item => (
            <li key={item.name}>
              <span>{item.name}</span>
              <Link to={`/repository/${encodeURIComponent(item.name)}`}> Detalhe</Link>
            </li>
          ))}
        </List>

      </Container >
    )
  }

}
