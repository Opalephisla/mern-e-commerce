import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'
import Rating from './Rating'
import axios from 'axios'
import { Store } from '../Store'
import { toast } from 'react-toastify'

const Product = (props) => {
  const { product } = props
  const [productAmount, setProductAmount] = useState(1)
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state
  let OutOfStock = product.countInStock === 0
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id)
    const quantity = existItem
      ? existItem.quantity + productAmount
      : productAmount
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      toast.error('Sorry. Product out of Stock !')
      return
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
    toast.success(`${item.name} added to cart !`, {
      autoClose: 500,
      hideProgressBar: true,
    })
  }

  const handleAmountChange = (e) => {
    const amount = parseInt(e.target.value)
    setProductAmount(amount)
  }
  return (
    <Card className="product" key={product.slug}>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text className="mt-2">${product.price}</Card.Text>
        {!OutOfStock && (
          <input
            type="number"
            min="1"
            max={product.countInStock}
            value={productAmount}
            id="product-amount"
            onChange={handleAmountChange}
          />
        )}
        <Button
          onClick={() => addToCartHandler(product)}
          disabled={OutOfStock}
          className={OutOfStock ? 'btn-secondary' : 'btn-primary'}
        >
          {' '}
          {OutOfStock ? 'Out of Stock' : 'Add to Cart'}{' '}
        </Button>
      </Card.Body>
    </Card>
  )
}

export default Product
