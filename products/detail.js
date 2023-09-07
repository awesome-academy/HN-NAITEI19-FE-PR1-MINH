const mappingCategory = {
  all: "Tất cả",
  "red-wine": "Rượu vang đỏ",
  "white-wine": "Rượu trắng",
  champagne: "Champagne",
  "sparkling-wine": "Rượu vang sủi",
  "rosé-wine": "Rượu hoa hồng",
  "dessert-wine": "Rượu tráng miệng",
}
function loadCategory() {
  const productId = window.location.href.split("#").pop()
  const apiUrl = `http://localhost:3000/product/${productId}`
  let productData = {}
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      productData = data
    })
    .catch((error) => {
      console.error("Error:", error)
    })
    .finally(() => {
      const tmpCategory = productData.category.toLocaleLowerCase().replace(" ", "-")
      document.getElementById("breadcrumbCategoryName").innerText = mappingCategory[tmpCategory]
      document.title = mappingCategory[tmpCategory] ? mappingCategory[tmpCategory] : "Tất cả"
      document.getElementById("detailProductImage").src = `/Product/${productData.id}.jpg`
      document.getElementById("detailProductName").innerText = productData.name
      document.getElementById("detailProductPrice").innerHTML = formatMoney(productData.price)
      document.querySelectorAll(".detail__prodoct__description").forEach((e) => (e.innerText = productData.description))
    })
}
loadCategory()

const numberInput = document.getElementById("numberInput")
const addBtn = document.getElementById("add")
const subtractBtn = document.getElementById("subtract")

addBtn.addEventListener("click", () => {
  numberInput.value = parseInt(numberInput.value) + 1
})

subtractBtn.addEventListener("click", () => {
  numberInput.value = parseInt(numberInput.value) - 1
})

function formatMoney(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "<sup>đ</sup>"
}

window.addEventListener("load", function () {
  const apiUrl = `http://localhost:3000/product`
  let fetchData = {}
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      fetchData = data
      fetchData.forEach((e) => {
        document.getElementById(`productName${e.id}`).innerText = e.name
        document.getElementById(`productPrice${e.id}`).innerHTML = formatMoney(e.price)
      })
    })
    .catch((error) => {
      console.error("Error:", error)
    })
})

document.querySelectorAll(".product__card a").forEach((e) => {
  e.addEventListener("click", () => {
    window.location.replace(e.href)
    window.location.reload()
  })
})
