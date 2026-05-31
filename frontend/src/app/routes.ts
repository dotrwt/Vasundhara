import { createBrowserRouter } from "react-router-dom";
import { Root } from "@/app/components/Root";
import { Login } from "@/app/components/Login";
import { Signup } from "@/app/components/Signup";
import { Dashboard } from "@/app/components/Dashboard";
import { CreateUser } from "@/app/components/CreateUser";
import { EditUser } from "@/app/components/EditUser";
import { ViewUser } from "@/app/components/ViewUser";

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