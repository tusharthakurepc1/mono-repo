import React from "react";
import { Outlet } from "react-router-dom";
import { TRoutes } from "@/typings/common";
import Payment from "@/atoms/icons/Payment";
import { Login, LoginOrganism } from "@/organism/Login";

export const BASE_URL = "/login";

const getLoginRoutes = () => {
  const routes: TRoutes[] = [
    {
      path: BASE_URL,
      element: (
        <>
          <Login />
          <Outlet />
        </>
      ),
      icon: <Payment />,
      showOnSideNav: false,
      key: "login",
      label: "Login",
      
    },
  ];

  return routes;
};

export default getLoginRoutes;
