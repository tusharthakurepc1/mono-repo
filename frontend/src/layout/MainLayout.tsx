import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { TRoutes } from "@/typings/common";
import SideNavV2 from "@/layout/SideNavV2";
import Header from "@/layout/Header";
import { useLocation } from "react-router-dom";
import { FlexboxGrid } from "rsuite";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import { RootState } from "@/store";
import { setCurrentRoute } from "@/store/route";
import { incrementByValue } from "@/store/auth";

const flatternRoutes = (routes: TRoutes[]): TRoutes[] => {
  let flatRoutes: TRoutes[] = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    if (route.children) {
      flatRoutes.push(route);
      route.children = route.children.map((child) => {
        return {
          ...child,
          parent: route,
        };
      });
      flatRoutes = [...flatRoutes, ...flatternRoutes(route.children)];
    } else {
      flatRoutes.push(route);
    }
  }

  return flatRoutes;
};

const MainLayout = (props: { routes: TRoutes[] }) => {
  const { routes } = props;
  const location = useLocation();
  const dispatch = useDispatch();

  const flatternRoutesTree = React.useMemo(() => {
    return flatternRoutes(routes);
  }, [routes]);

  const getCurrentRoute = React.useMemo(() => {
    const currentRoute =
      flatternRoutesTree.find((route) => {
        return route.path === location.pathname;
      }) || flatternRoutesTree[0];

    // Store the current route in the redux store
    dispatch(setCurrentRoute(currentRoute));
    dispatch(incrementByValue(500));
    // console.log("STORE SUCESS REDUX>>>", currentRoute)
    return currentRoute;
  }, [routes, location]);

  return (
    <>
      {/* {count} */}
      {/* <section>
        <SideNavV2 routes={routes} selectedRoute={getCurrentRoute} />
        <Header routes={routes} selectedRoute={getCurrentRoute} />
      </section> */}
      {/* <button onClick={()=> {dispatch(incrementByValue(4))}}>Click me</button> */}

      <FlexboxGrid>
        <FlexboxGridItem colspan={2}>
          <SideNavV2 routes={routes} selectedRoute={getCurrentRoute} />
        </FlexboxGridItem>
        <FlexboxGridItem colspan={22}>
          <FlexboxGrid>
            <FlexboxGridItem colspan={24}>
              <Header routes={routes} selectedRoute={getCurrentRoute} />
            </FlexboxGridItem>
            {/* <FlexboxGridItem>
              BODY
            </FlexboxGridItem> */}
          </FlexboxGrid>
        </FlexboxGridItem>
      </FlexboxGrid>
    </>
  );
};

export default MainLayout;
