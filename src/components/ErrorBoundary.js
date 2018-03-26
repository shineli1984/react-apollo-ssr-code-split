import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true })
    // add error logging here
    // logErrorToMyService(error, info)
  }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      return <div />
    }
    return this.props.children
  }
}

export default ErrorBoundary
