import {
  Home,
  ProductResult,
  Category,
  Product,
  Payment,
  Success,
  CreateUser,
  Orders,
  CreateProduct,
} from "./pages";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Dashboard from "./pages/Seller/Dashboard";
import Deliver from "./pages/Delivery/Deliver";
import { ChatIcon } from "./assets";
import Chat from "./pages/Chat";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/chat">
          <div className="fixed bottom-10 right-10 w-20 h-20 rounded-full bg-primaryColor cursor-pointer ">
            <ChatIcon className="w-[60%] translate-x-4" />
          </div>
        </Link>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/category" exact element={<Category />} />
          <Route path="/result/:id" exact element={<ProductResult />} />
          <Route path="/product/:id" exact element={<Product />} />
          <Route path="/payment/:id" exact element={<Payment />} />
          <Route path="/success/:id" exact element={<Success />} />
          <Route path="/seller/dashboard" exact element={<Dashboard />} />
          <Route path="/delivery/:id" exact element={<Deliver />} />
          <Route path="/create/user" exact element={<CreateUser />} />
          <Route path="/create/product" exact element={<CreateProduct />} />
          <Route path="/orders" exact element={<Orders />} />
          <Route path="/chat" exact element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
