import {Component} from "react"
import {TextInput, Card, Button, Callout, Subtitle, Grid, Col} from "@tremor/react"
import {ExclamationIcon} from "@heroicons/react/solid"
import {signIn} from "../api/auth_api"
import AuthContext from "./AuthContext"
import {Link} from "react-router-dom"
import apiErrors from "../api/errors"
import logo from "../assets/logo.svg"

export default class Login extends Component {
	static contextType = AuthContext

	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			error: undefined,
			email: "",
			emailError: undefined,
			password: "",
			passwordError: undefined
		}
	}

	async login() {
		let ready = true
		if (this.state.email === "") {
			this.setState({emailError: "Email is Empty"})
			ready = false
		} else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(this.state.email)) {
			this.setState({emailError: "Email is not valide"})
			ready = false
		}
		if (this.state.password === "") {
			this.setState({passwordError: "Password is Empty"})
			ready = false
		}
		if (ready) {
			this.setState({loading: true})
			const result = await signIn(this.state.email, this.state.password)
			if (result.error) {
				this.setState({loading: false, error: apiErrors[result.error]})
			} else {
				this.context.setToken(result.yuriToken)
			}
		}
	}

	update(e) {
		if (e.target.value !== "") {
			this.setState({[e.target.name + "Error"]: undefined})
		}
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	render() {
		return (
			<>
				<Link to={"/"}>
					<img className={"w-[20%] mt-32 mb-10 m-auto"} src={logo} alt="YuriSense Logo" />
				</Link>
				<div className={"flex"}>
					<Card className={"h-fit m-auto w-1/2"}>
						{!!this.state.error && (
							<Callout title="Login Failed" icon={ExclamationIcon} color="rose">
								{this.state.error}
							</Callout>
						)}
						<TextInput
							className={"m-1"}
							placeholder={"Email"}
							name={"email"}
							value={this.state.email}
							error={!!this.state.emailError}
							errorMessage={this.state.emailError}
							onChange={this.update.bind(this)}
							disabled={this.state.loading}
						/>
						<TextInput
							className={"m-1"}
							placeholder={"Password"}
							name={"password"}
							type={"password"}
							value={this.state.password}
							error={!!this.state.passwordError}
							errorMessage={this.state.passwordError}
							onChange={this.update.bind(this)}
							disabled={this.state.loading}
						/>
						<Link className={"mt-3 text-center"} to={"/admin/signup"}>
							<Subtitle className={"hover:text-blue-600"}>Create Account</Subtitle>
						</Link>
						<Button className={"w-[100%] m-1"} loading={this.state.loading} onClick={this.login.bind(this)}>
							Login
						</Button>
					</Card>
				</div>
			</>
		)
	}
}

export class LogoutButton extends Component {
	static contextType = AuthContext

	render() {
		return (
			<Button {...this.props} onClick={() => this.context.logout(this.props.to)}>
				{this.props.children}
			</Button>
		)
	}
}
