import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MyRegister from "./MyRegister";
import MyTable from "./MyTable";
import MySetting from "./MySetting";
import Layout from "./Layout";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <MyRegister /> },
        { path: "MyTable", element: <MyTable /> },
        { path: "MySetting", element: <MySetting /> },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
