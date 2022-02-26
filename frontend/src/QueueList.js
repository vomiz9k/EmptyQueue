import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class QueueList extends Component {

    constructor(props) {
        super(props);
        this.state = {queues: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/queue')
            .then(response => response.json())
            .then(data => this.setState({queues: data}));
        
    }

    async remove(id) {
        await fetch(`/queue/${id}`, {
            method: 'DELETE',
            // headers: {
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json'
            // }
        }).then(() => {
            let updatedQueues = [...this.state.queues].filter(i => i.id !== id);
            this.setState({queues: updatedQueues});
        });
    }

    async iterate(id) {
        fetch(`/queue/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'origin-list'
            }
        }).then(() => {
            let updatedQueues = [...this.state.queues].map((queue, index) => {
                if (index + 1 === id) {
                    queue.current = (queue.current + 1) % queue.participants.length;
                }
                return queue;
            });
            this.setState({queues: updatedQueues});
        });
    }

    render() {
        const {queues} = this.state;

        const queueList = queues.map(queue => {
            return <tr key={queue.id}>
                <td style={{whiteSpace: 'nowrap'}}>{queue.name}</td>
                <td>{queue.participants[queue.current]}</td>
                <td> {queue.participants.map((participant, index) => {
                    return <div key={index}>{participant}<br/></div>
                })}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" onClick={() => this.iterate(queue.id)}>Iterate</Button>
                        <Button size="sm" color="secondary" tag={Link} to={"/queue/" + queue.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(queue.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/queue/new">Add Queue</Button>
                    </div>
                    <h3>Queues</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Name</th>
                            <th width="30%">Next</th>
                            <th width="30%">Participants</th>
                            <th width="40%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {queueList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default QueueList;