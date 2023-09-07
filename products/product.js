let fetchData = []
let currentPage = 1
const productsPerPage = 6
let currentViewMode = 0
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
  const category = window.location.href.split("#").pop()
  document.getElementById("breadcrumbCategoryName").innerText = mappingCategory[category]
  document.title = mappingCategory[category] ? mappingCategory[category] : "Tất cả"
  document.querySelectorAll(".category__list_item").forEach((e) => {
    if (e.innerHTML.includes(mappingCategory[category])) {
      e.className = "category__list_item--active"
    }
  })
}
loadCategory()
window.addEventListener("popstate", loadCategory)

window.addEventListener("load", function () {
  const apiUrl = `http://localhost:3000/product`
  let categoryCounter = {}
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
        if (!categoryCounter.hasOwnProperty(e.category)) {
          categoryCounter[e.category] = 1
        } else {
          categoryCounter[e.category]++
        }
      })
    })
    .catch((error) => {
      console.error("Error:", error)
    })
    .finally(() => {
      const categoryList = document.getElementById("categoryList")
      document.querySelector(".category__list").children[0].addEventListener("click", (event) => {
        document.querySelectorAll(".category__list_item--active").forEach((e) => {
          e.className = "category__list_item"
        })
        const parentElement = event.target.parentNode
        parentElement.classList.add("category__list_item--active")
      })

      for (const [key, value] of Object.entries(categoryCounter)) {
        const listItem = document.createElement("li")
        const tmpCategory = key.toLocaleLowerCase().replace(" ", "-")
        listItem.addEventListener("click", (event) => {
          document.querySelectorAll(".category__list_item--active").forEach((e) => {
            e.className = "category__list_item"
          })
          const parentElement = event.target.parentNode
          parentElement.classList.add("category__list_item--active")
        })
        listItem.className = "category__list_item"
        listItem.innerHTML = `<a href="#${tmpCategory}">${mappingCategory[tmpCategory]} (${value})</a>`
        categoryList.appendChild(listItem)
      }
      paginateProducts()
    })
})

function displayProductsGrid(products) {
  const productListContainer = document.getElementById("productListContainer")
  productListContainer.innerHTML = ""
  productListContainer.className = "container"
  const rowTemplate = document.createElement("div")
  rowTemplate.className = "row"

  products.forEach((product) => {
    const productItem = document.createElement("div")
    productItem.classList.add("d-flex", "flex-column", "product__card__grid", "col-md-6", "col-lg-4")
    productItem.innerHTML = `
      <div class="prouct__img__ctn overflow-hidden ">
        <a href="/products/detail.html#${product.id}">
          <img src="/Product/${product.id}.jpg" alt="product image" class="img-fluid"/>
        </a>
      </div>

      <div class="product__infomation__grid" >
        <h3 class="product__name__grid">
          <a href="/products/detail.html#${product.id}">${product.name}</a>
        </h3>
        <div class="product__price__grid">${formatMoney(product.price)}</div>
        <button class="btn-custom">ADD TO CART</button>
      </div>
    `
    rowTemplate.appendChild(productItem)
  })
  productListContainer.appendChild(rowTemplate)
}

function displayProductsList(products) {
  const productListContainer = document.getElementById("productListContainer")
  productListContainer.innerHTML = ""

  products.forEach((product) => {
    const productItem = document.createElement("div")
    productItem.classList.add("product-detail-item")
    productItem.innerHTML = `
    <div class = "d-flex product__card__list">
      <div class="prouct__img__ctn overflow-hidden col-md-3 col-lg-4">
      <a href="/products/detail.html#${product.id}">
        <img src="/Product/${product.id}.jpg" alt="product image" class="img-fluid"/>
      </a>
      </div>

      <div class="product__infomation col-md-9 col-lg-8">
        <h3 class="product__name__list">
          <a href="/products/detail.html#${product.id}">${product.name}</a>
        </h3>
        <div class="product__price__list">${formatMoney(product.price)}</div>
        
        <p class="product__description__list">${product.description}</p>
        <button class="btn-custom">ADD TO CART</button>
        <button class="btn-custom-type2"><span class="material-symbols-outlined">
        favorite
        </span>Yêu thích</button>
        <button class="btn-custom-type2"><span class="material-symbols-outlined">
        signal_cellular_alt
        </span>So sánh</button>
      </div>
    </div>
    <hr>
    `
    productListContainer.appendChild(productItem)
  })
}

function updatePagination() {
  const prevPageBtn = document.getElementById("prevPageBtn")
  const nextPageBtn = document.getElementById("nextPageBtn")
  const totalPages = Math.ceil(fetchData.length / productsPerPage)

  prevPageBtn.disabled = currentPage === 1
  nextPageBtn.disabled = currentPage === totalPages

  document.getElementById("currentPage").textContent = `${currentPage}/${totalPages}`
}

function paginateProducts() {
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const displayedProducts = fetchData.slice(startIndex, endIndex)

  document.querySelector("#gridView").addEventListener("click", () => {
    currentViewMode = 0
    displayProductsGrid(displayedProducts)
  })
  document.querySelector("#listView").addEventListener("click", () => {
    currentViewMode = 1
    displayProductsList(displayedProducts)
  })
  if (currentViewMode) {
    displayProductsList(displayedProducts)
  } else {
    displayProductsGrid(displayedProducts)
  }
  updatePagination()
}

document.getElementById("prevPageBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--
    paginateProducts()
  }
})

document.getElementById("nextPageBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(fetchData.length / productsPerPage)
  if (currentPage < totalPages) {
    currentPage++
    paginateProducts()
  }
})

paginateProducts()

function formatMoney(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "<sup>đ</sup>"
}
