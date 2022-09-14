import { Link, BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Container from 'react-bootstrap/Container'
import { LinkContainer } from 'react-router-bootstrap'
import { Badge, Nav, NavDropdown } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import { useContext } from 'react'
import './App.css'
import {
  HomeScreen,
  ProductScreen,
  CartScreen,
  SigninScreen,
  ShippingAddressScreen,
  SignupScreen,
  PaymentMethodScreen,
  PlaceOrderScreen,
} from './screens'
import { Store } from './Store'
import OrderScreen from './screens/OrderScreen'

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart, userInfo } = state

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('paymentMethod')
  }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer
          position="top-right"
          limit={3}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
        <header>
          <Navbar className="navbar-container" bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      to="#signout"
                      onClick={signoutHandler}
                      className="dropdown-item"
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <>
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                    <Link className="nav-link" to="/signup">
                      Sign Up
                    </Link>
                  </>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
