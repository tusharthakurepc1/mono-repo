import React from "react";
import { Outlet } from "react-router-dom";
import { TRoutes } from "@/typings/common";
import Payment from "@/atoms/icons/Payment";

export const BASE_URL = "/pmt";

const getPaymentRoutes = () => {
  const routes: TRoutes[] = [
    {
      path: BASE_URL,
      element: (
        <>
          Payment Page <Outlet />
        </>
      ),
      icon: <Payment />,
      showOnSideNav: true,
      key: "payment",
      label: "Payment",
    },
  ];

  return routes;
};

export default getPaymentRoutes;
