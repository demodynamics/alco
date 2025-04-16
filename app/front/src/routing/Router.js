import { Routes, Route } from "react-router-dom";
import Main from "../components/main/Main";
import Pages from "../components/main/pages/Pages";
import Basket from "../components/basket/Basket";
import Admin from "../components/admin/Admin";
import AdminCategory from "../components/admin/AdminCategory";
import AdminCatalog from "../components/admin/AdminCatalog";
import Contact from "../components/contact/Contact";
import AddProduct from "../components/admin/AddProduct";
import Catalog from "../components/main/catalog/Catalog";
import NotFound from "./NotFound";


function Router() {

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/category" element={<Catalog />} />
      <Route path="/category/:name" element={<Pages />} />
      <Route path="/basket" element={<Basket />} />
      <Route path="/nimda" element={<Admin />} />
      <Route path="/nimda/category" element={<AdminCategory />} />
      <Route path="/nimda/category/:name" element={<AdminCatalog />} />
      <Route path="/nimda/category/add/:name" element={<AddProduct />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/*" element={<NotFound />} status={404} />
    </Routes>
  );
}

export default Router;
