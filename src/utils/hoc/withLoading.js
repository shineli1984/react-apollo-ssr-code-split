import { propOr } from 'ramda'
import { branch, renderComponent } from 'recompose'
import Loading from '../../components/Loading'

export default (...params) =>
  console.log(params) ||
  branch(propOr(true, 'loading'), renderComponent(Loading))(...params)
