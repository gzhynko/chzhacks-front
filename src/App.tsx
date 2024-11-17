import { Auth0ProviderWithNavigate } from "@/components/Auth0ProviderWithNavigate";
import { AuthenticationGuard } from "@/components/AuthenticationGuard";
import { Toaster } from "@/components/shadcn-ui/toaster";
import { Dashboard } from "@/routes/Dashboard";
import Home from "@/routes/Home";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

const Auth0ProviderWithNavigateWrapper: React.FC = () => {
  return (
    <Auth0ProviderWithNavigate>
      <Outlet />
    </Auth0ProviderWithNavigate>
  )
};

const router = createBrowserRouter([
  {
    element: <Auth0ProviderWithNavigateWrapper />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard/*",
        element: <AuthenticationGuard component={Dashboard} />,
      }    
    ]
  }
]);

export const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};
