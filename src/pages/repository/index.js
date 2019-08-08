import React, { Component } from 'react';
import api from '../../services/api'
import PropTypes from 'prop-types'
import { Loading, Owner, Issues } from './styles';
import Container from '../../Components/Conteiner'
import { Link } from 'react-router-dom'

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({

      params: PropTypes.shape({
        repository: PropTypes.string,
      })

    }).isRequired,

  };
  state = {
    repository: {},
    issues: [],
    loading: true
  }

  async componentDidMount() {
    const { match } = this.props
    const repoNome = decodeURIComponent(match.params.repository)


    const [repository, issues] = await Promise.all([
      api.get(`repos/${repoNome}`),
      api.get(`repos/${repoNome}/issues`, {
        params: {
          state: 'open',
          per_page: 30
        }
      })
    ])
    this.setState({
      repository: repository.data,
      loading: false,
      issues: issues.data,
    })
  }
  render() {
    const { issues, loading, repository } = this.state;
    if (loading) {
      return <Loading>Caregando</Loading>
    }
    return <Container>
      <Owner>
        <Link to="/">Voltar a Todos os Repositorios</Link>
        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
        <h1>repository.name</h1>
        <p>repository.descripition</p>

      </Owner>
      <Issues>
        {issues.map(item => (
          <li key={String(issues.id)}>
            <img src={item.user.avatar_url} alt={item.user.login} />
            <div>
              <strong>
                <a href={item.html_url}> {item.title}</a>
                {item.labels.map(label => (<span key={String(label.id)}>{label.name}</span>))}

              </strong>
              <p>{item.user.login}</p>
            </div>
          </li>
        ))}
      </Issues>

    </Container>;
  }
}
