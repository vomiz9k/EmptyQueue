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

    async componentDidMount() {
        while(true)
         {
            await fetch('/queue')
                .then(response => response.json())
                .then(data => {
                    if (this.state.queues !== data) {
                        this.setState({queues: data})
                    }
                });
            await new Promise(resolve => setTimeout(resolve, 100));        
        }
        
    }

    async remove(id) {
        await fetch(`/queue/${id}`, {
            method: 'DELETE',
        })
    }

    async iterate(id) {
        fetch(`/queue/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
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
                        <Button size="sm" color="primary" onClick={() => {if (window.confirm('Are you sure you wish to iterate this queue?')) this.iterate(queue.id)}}>Iterate</Button>
                        <Button size="sm" color="success" onClick={() => {
                            fetch(`/log/${queue.id}`).then(response => response.json()).then(
                                logs => {
                                    var str = "";
                                    logs.map(log => str = str + log + "\n");
                                    window.alert(str)
                                }
                            )
                        }}>Logs</Button>
                        <Button size="sm" color="danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this queue?')) this.remove(queue.id)}}>Delete</Button>
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