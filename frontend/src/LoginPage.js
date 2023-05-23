import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { FormGroup, Button} from 'reactstrap';
import "./LoginPage.css";
import { globalStateContext } from "./Context"


window.getCsrfToken = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\s*([^;]*).*$)|^.*$/, '$1');
}

class Input extends Component {

  constructor(props){
    super(props)
    this.state = {
      value: props.value? props.value : '',
      className: props.className? props.className : '',
      error: false
    }
  }

  inputChange = (event) => {
    const value = event.target.value
    this.setState({ value: value })
  }

  render (){
    const {handleError, ...opts} = this.props
    this.handleError = handleError
    return (
      <input {...opts} value={this.state.value} onChange={this.inputChange} className={this.state.className} /> 
    )
  }
}

class Forms extends Component {

  constructor(props){
    super(props)
    this.change = props.changer
    this.childProps = { ...this.props }
    delete this.childProps.changer
    if(props.error){
      this.state = { failure: 'wrong username or password!', errcount: 0 }
    }else{
      this.state = { errcount: 0 }
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if(!this.state.errcount) {
      const data = new FormData(this.form)
      fetch(this.form.action, {
        method: this.form.method,
        body: new URLSearchParams(data),
        headers: { 'X-XSRF-TOKEN': window.getCsrfToken() },
      }).then(v => {
        if(v.redirected) window.location = v.url
        this.change(true);
      })
      .catch(e => {
        this.setState({ failure: 'wrong username or password!', errcount: 0 })
      })
    }
  }

  handleError = (field, errmsg) => {
    if(!field) return

    if(errmsg){
      this.setState((prevState) => ({
        failure: '',
        errcount: prevState.errcount + 1, 
        errmsgs: {...prevState.errmsgs, [field]: errmsg}
      }))
    } else {
      this.setState((prevState) => ({
        failure: '',
        errcount: prevState.errcount===1? 0 : prevState.errcount-1,
        errmsgs: {...prevState.errmsgs, [field]: ''}
      }))
    }
  }

  renderError = () => {
    if(this.state.errcount || this.state.failure) {
      const errmsg = this.state.failure || Object.values(this.state.errmsgs).find(v=>v)
      console.log(`error: ${errmsg}`)
      return <div className="error">{errmsg}</div>
    }
  }

  render() {
    const inputs = this.props.inputs.map(
            ({name, placeholder, type, value, className}, index) => {
                return <FormGroup className="mb-3"key={index} >
                  { className ? <Button key={index} name={name} placeholder={placeholder} type={type} value={value} color="success" className='btn'>Submit</Button>
                  : <Input size="lg" key={index} name={name} placeholder={placeholder} type={type} value={value} handleError={this.handleError} />
                }
                </FormGroup>;
            }
          )
    const errors = this.renderError()
    return (
      <div className='Login'>
        <h1>Welcome!</h1>
        <form {...this.childProps} onSubmit={this.handleSubmit} ref={fm => {this.form=fm}} >
            {inputs}
            {errors}
        </form>
      </div>)
      
  }
}


const inputs = [{
    name: "username",
    placeholder: "username",
    type: "text"
  },{
    name: "password",
    placeholder: "password",
    type: "password"
  },{
    type: "submit",
    value: "Submit",
    className: "btn" 
  }]

  
class LoginPage extends Component {
    render() {
        const props = {name: 'loginForm', method: 'POST', action: '/perform_login', inputs: inputs}
        const params = new URLSearchParams(window.location.search)
        return (<>                
            <AppNavbar/>
            <globalStateContext.Consumer>{({change}) => (
              <Forms {...props} error={params.get('error')} changer={change} />
            )}</globalStateContext.Consumer>
            </>
        );
    }
}

export default LoginPage;