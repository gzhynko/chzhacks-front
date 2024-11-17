import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";

interface AuthenticationGuardProps {
  component: React.ComponentType;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ component }) => {
  const Component = withAuthenticationRequired(component);
  return <Component />;
};