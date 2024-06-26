// /shop.c4ei.net/backend/services/products/index.js
const { Product } = require("../../models"); // Sequelize 모델 가져오기
const { Op } = require("sequelize"); // Sequelize 연산자 가져오기

const addProduct = async (data) => {
  try {
    const newProduct = await Product.create(data);
    return newProduct;
  } catch (err) {
    console.log(err);
  }
};

const getListProduct = async () => {
  try {
    const listProduct = await Product.findAll();
    // const listProduct = await Product.findAll({limit: 100});
    return listProduct;
  } catch (err) {
    console.log(err);
  }
};

const getListProduct10 = async () => {
  try {
    const listProduct = await Product.findAll({
      limit: 10
    });
    return listProduct;
  } catch (err) {
    console.log(err);
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findOne({
      where: {
        id,
      },
    });
    return product;
  } catch (err) {
    console.log(err);
  }
};

const getProductByCategory = async (category) => {
  try {
    const product = await Product.findAll({
      where: {
        category,
      },
    });
    return product;
  } catch (err) {
    console.log(err);
  }
};

const panigationProduct = async (size, page) => {
  try {
    const product = await Product.findAndCountAll({
      limit: size,
      offset: (page - 1) * size,
    });
    return product;
  } catch (err) {
    console.log(err);
  }
};

const deleteProduct = async (id) => {
  try {
    const productId = await Product.destroy({
      where: {
        id,
      },
    });
    return productId;
  } catch (err) {
    console.log(err);
  }
};

const updateProduct = async (id, data) => {
  try {
    const product = await Product.update(data, {
      where: {
        id,
      },
    });
    return product;
  } catch (err) {
    console.log(err);
  }
};

const searchProduct = async (search) => {
  try {
    const product = await Product.findAll({
      where: {
        [Op.or]: [
          {
            good_name: {
              [Op.like]: "%search%",
            },
          },
          {
            price: {
              [Op.like]: "%search%",
            },
          },
          {
            category: {
              [Op.like]: "%search",
            },
          },
        ],
      },
    });
    return product;
  } catch (err) {}
};

// 검색 기능 추가
const searchProducts = async (keyword, category, offset, limit, sort) => {
  try {
    const where = {
      [Op.or]: [
        {
          good_name: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          price: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    };

    if (category && category !== "all") {
      where.category = {
        [Op.like]: `%${category}%`,
      };
    }
    
    const order = getOrder(sort); // 정렬 기준을 가져옴
    console.log("### searchProducts where:", where);
    console.log("### searchProducts order:", order);
    
    const products = await Product.findAll({
      where,
      offset: offset,
      limit: limit,
      order: order, // 정렬 기준 적용
    });
    return products;
  } catch (err) {
    console.error("Error searching products:", err);
    throw err;
  }
};

// 정렬 기준을 반환하는 함수
function getOrder(sort) {
  switch (sort) {
    case "DownToUp":
      return [["price", "ASC"]];
    case "UpToDown":
      return [["price", "DESC"]];
    default:
      return [];
  }
}

const getTotalProductsCount = async (keyWordSearch = "", category = "all") => {
  try {
    const whereClause = {};
    if (keyWordSearch) {
      whereClause.name = { [Op.like]: `%${keyWordSearch}%` };
    }
    if (category !== "all") {
      whereClause.category = category;
    }
    const count = await Product.count({ where: whereClause });
    // console.log("### 171 ### /backend/services/products/index.js getTotalProductsCount count : "+count);
    return count;
  } catch (error) {
    console.error("전체 제품 수를 가져오는 중 오류 발생:", error);
    throw error;
  }
};

module.exports = {
  addProduct,
  getProductById,
  getProductByCategory,
  getListProduct,
  getListProduct10,
  panigationProduct,
  deleteProduct,
  updateProduct,
  searchProduct,
  searchProducts,
  getTotalProductsCount,
};
