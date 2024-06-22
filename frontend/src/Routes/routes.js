// /frontend/src/Routes/routes.js
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import CartProduct from "../components/CartProduct";
import Checkout from "../components/Checkout";
import DetailProduct from "../components/DetailProduct";
import Shop from "../components/Shop";
import Goods from "../components/Goods"; // 새로 만든 Goods 컴포넌트
import HistoryUser from "../components/User/HistoryUser";
import Home from "../page/Home";
import ManageShop from "../components/ManageShop";
import MyFriend from "../components/MyFriend";

const publicRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/detail/:id",
    component: DetailProduct,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/cart",
    component: CartProduct,
  },
  {
    path: "/shop",
    component: Shop,
  },
  {
    path: "/Goods",
    component: Goods,
  },
  {
    path: "/Checkout",
    component: Checkout,
  },
  {
    path: "/HistoryUser",
    component: HistoryUser,
  },
  {
    path: "/manage",
    component: ManageShop,
  },
  {
    path: "/MyFriend",
    component: MyFriend,
  },
  
];

export default publicRoutes;
