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
            name: {
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
const searchProducts = async (keyword, category, offset, limit) => {
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
    
    const products = await Product.findAll({
      where,
      offset: offset,
      limit: limit,
    });
    return products;
  } catch (err) {
    console.error("Error searching products:", err);
    throw err;
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
};
