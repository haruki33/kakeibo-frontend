import "./App.css";
import MyAppBar from "./MyAppBar.tsx";
import MyRegister from "./Register.tsx";
import CategoriesForm from "./CategoriesForm.tsx";
import CategoriesList from "./CategoriesList.tsx";

function App() {
  return (
    <>
      <MyAppBar />
      <MyRegister />
      <CategoriesForm />
      <CategoriesList />
    </>
  );
}

export default App;
