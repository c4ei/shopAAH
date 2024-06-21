// /shop.c4ei.net/backend/routers/products/index.js
const express = require("express");
const {
  addProduct,
  getListProduct,
  getListProduct10,
  getProductById,
  panigationProduct,
  deleteProduct,
  updateProduct,
  getProductByCategory,
  searchProducts, // 검색 함수 가져오기
  getTotalProductsCount,
} = require("../../services/products");
const productRouter = express.Router();

productRouter.post("/", async (req, res) => {
  const {
    good_name,
    description,
    price,
    img1,
    img2,
    img3,
    img4,
    category,
    originalPrice,
    promotionPercent,
  } = req.body;

  const newProduct = await addProduct({
    good_name,
    description,
    price,
    img1,
    img2,
    img3,
    img4,
    category,
    originalPrice,
    promotionPercent,
  });

  if (!newProduct) {
    return res.status(500).send("Can't add product");
  }

  res.status(200).send(newProduct);
});

productRouter.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const size = Number.parseInt(req.query.size) || 10;
    const keyWordSearch = req.query.search || "";
    const category = req.query.category || "all";
    const sort = req.query.sort || "default"; // sort 매개변수 추가
    
    const offset = (page - 1) * size;
    const limit = size;
    let products, totalProducts;

    if (keyWordSearch || category !== "all") {
      products = await searchProducts(keyWordSearch, category, offset, limit, sort);
      totalProducts = await getTotalProductsCount(keyWordSearch, category);
    } else {
      products = await getListProduct();
      totalProducts = products.length;
      products = products.slice(offset, offset + limit);
    }

    res.status(200).send({ products, totalProducts });
  } catch (error) {
    console.error("제품 목록 조회 오류:", error);
    res.status(500).send({ error: "서버 내부 오류" });
  }
});

productRouter.get("/main", async (req, res) => {
  const page = Number.parseInt(req.query.page);
  const size = Number.parseInt(req.query.size);
  const keyWordSearch = req.query.search || "";
  const category = req.query.category || "";
  let products;

  if (page && size) {
    let start = (page - 1) * size;
    let end = page * size;

    if (category === "all") {
      products = await getListProduct10();
    } else {
      products = await getProductByCategory(category);
    }

    let panigationProducts = products.slice(start, end);

    if (!keyWordSearch) {
      res.status(200).send(panigationProducts);
    } else {
      try {
        let newProduct = panigationProducts.filter((value) => {
          // value.name과 keyWordSearch가 둘 다 정의되어 있는지 확인
          if (!value.name || !keyWordSearch) {
            return false;
          }
          return value.name.toLowerCase().indexOf(keyWordSearch.toLowerCase()) !== -1;
        });
        // 결과를 반환
        res.status(200).send(newProduct);
      } catch (error) {
        // 오류가 발생했을 경우 로그를 남기고 에러 메시지 반환
        console.error("Error filtering products:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  } else if (category || keyWordSearch) {
    if (category === "all") {
      products = await getListProduct10();
    } else {
      products = await getProductByCategory(category);
    }
    res.status(200).send(products);
  } else {
    const products = await getListProduct10();
    if (!products) {
      return res.status(500).send("Can't get panigation page");
    }
    res.status(200).send(products);
  }
});

productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const product = await getProductById(id);

  if (!product) {
    return res.status(500).send(`Can't get product id: ${id}`);
  }

  res.status(200).send(product);
});

productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    good_name,
    description,
    price,
    img1,
    img2,
    img3,
    img4,
    category,
    originalPrice,
    promotionPercent,
  } = req.body;

  const isProductExist = getProductById(id);

  if (!isProductExist) {
    return res.status(500).send(`Product ${id} is not exists in db`);
  }

  const data = {
    good_name,
    description,
    price,
    img1,
    img2,
    img3,
    img4,
    category,
    originalPrice,
    promotionPercent,
  };

  await updateProduct(id, data);

  res.status(200).send(data);
});

productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const isProductExist = getProductById(id);

  if (!isProductExist) {
    return res.status(500).send(`Product ${id} is not exists in db `);
  }

  const productDeleted = await deleteProduct(id);

  res.status(200).send(`User id : ${productDeleted} successfully`);
});

module.exports = productRouter;
