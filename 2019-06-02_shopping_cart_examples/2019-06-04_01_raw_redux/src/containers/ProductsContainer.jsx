import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addToCartAction } from '../actions/Actions'
import { getVisibleProducts } from '../reducers/ProductReducer'
import ProductItemComponent from '../components/ProductItemComponent'
import ProductListComponent from '../components/ProductListComponent'

const ProductsContainer = ({ products, addToCartAction }) => (
  <ProductListComponent title="Products">
    {products.map(product =>
      <ProductItemComponent
        key={product.id}
        product={product}
        onAddToCartClicked={() => addToCartAction(product.id)} />
    )}
  </ProductListComponent>
)

ProductsContainer.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    inventory: PropTypes.number.isRequired
  })).isRequired,
  addToCartAction: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  products: getVisibleProducts(state.ProductStore)
})

export default connect(
  mapStateToProps,
  { addToCartAction }
)(ProductsContainer)
