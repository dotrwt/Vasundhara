import { createBrowserRouter } from "react-router";
import { Root } from "@/app/components/Root.jsx";
import { Login } from "@/app/components/Login.jsx";
import { Signup } from "@/app/components/Signup.jsx";
import { Dashboard } from "@/app/components/Dashboard.jsx";
import { CreateUser } from "@/app/components/CreateUser.jsx";
import { EditUser } from "@/app/components/EditUser.jsx";
import { ViewUser } from "@/app/components/ViewUser.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Login },
      { path: "signup", Component: Signup },
      { path: "dashboard", Component: Dashboard },
      { path: "create-user", Component: CreateUser },
      { path: "edit-user/:id", Component: EditUser },
      { path: "view-user/:id", Component: ViewUser },
    ],
  },
]);