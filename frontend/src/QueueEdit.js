import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

class QueueEdit extends Component {
    emptyItem = {
        name: '',
        participants: ['', '']
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const client = await (await fetch(`/queue/${this.props.match.params.id}`)).json();
            this.setState({item: client});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        if (name === "name") {
            item[name] = value;
        }
        else {
            item.participants[name] = value;
        }
        this.setState({item});
    }

async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    await fetch('/queue' + (item.id ? '/' + item.id : ''), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
    });
    this.props.history.push('/queue');
}

    render() {
        const {item} = this.state;
        const title = <h2>{item.id ? 'Edit Queue' : 'Add Queue'}</h2>;
        const inputField = (participant, index) => <FormGroup key={index} className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">#{index + 1}</span>
            </div>
            <Input type="text" name={index} id={index} value={participant}  autoComplete={participant} onChange={this.handleChange} style={{width: "50%"}}></Input>
            <Button color="primary" 
                onClick={() => {
                    if (index > 0) {
                        item.participants[index] = item.participants[index - 1];
                        item.participants[index - 1] = participant;
                    }
                    this.setState({item});
                }}> Up
            </Button>
            <Button color="secondary" 
                onClick={() => {
                    if (index !== item.participants.length - 1) {
                        item.participants[index] = item.participants[index + 1];
                        item.participants[index + 1] = participant;
                    }
                    this.setState({item});
                }}> Down
            </Button>
            <Button color="danger" 
                onClick={() => {
                    if (item.participants.length > 2) {
                        this.state.item.participants.splice(index, 1);
                    }
                    this.setState({item});
                }}> Remove
            </Button>
        </FormGroup>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup className="mb-3">
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={item.name || ''}
                               onChange={this.handleChange} autoComplete="name"/>
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <Label for="participants">Participants</Label>{'  '}
                        <Button color="primary" 
                            onClick={() => {
                                item.participants.push(""); 
                                this.setState({item});
                            }}> Add
                        </Button>{'  '}
                        <Button color="success" onClick={() =>{
                                item.participants.sort( () => .5 - Math.random() );
                                this.setState({item});
                            }}>Shuffle
                        </Button>
                    </FormGroup>
                        {item.participants.map((participant, index) => inputField(participant, index))}
                    <FormGroup className="mb-3">
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/queue">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(QueueEdit);