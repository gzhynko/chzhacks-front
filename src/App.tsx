import { Auth0ProviderWithNavigate } from "@/components/Auth0ProviderWithNavigate";
import { AuthenticationGuard } from "@/components/AuthenticationGuard";
import { Dashboard } from "@/routes/Dashboard";
import { BrowserRouter, createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

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
        path: "/dashboard/*",
        element: <AuthenticationGuard component={Dashboard} />,
      }    
    ]
  }
]);

export const App: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};
