import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state() {
    return {
    diffrentProductsQuantity: 0,
    productsInfo: [
    ],
    }
  },
  getters: {
    getProducts() {
        return this.productsInfo
    },
    totalPrice() {
        return this.productsInfo.reduce((total, product) => total + product.price * product.quantity, 0)
      }
},
  actions: {
    addProductToCard(product) {
        let id = this.productsInfo.findIndex(p => p.id === product.id)
        if (id !== -1) {
            this.productsInfo[id].quantity += 1
        } else {
            this.diffrentProductsQuantity += 1
            this.productsInfo.push({
            id: product.id,
            name: product.name,
            price: product.unit_price,
            quantity: 1
        })
        }
  },
} 
})