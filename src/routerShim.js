import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext({ path: "/", navigate: () => {} });
const ParamsContext = createContext({});

const matchPath = (pattern, path) => {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    const current = pathParts[i];
    if (pp.startsWith(":")) {
      params[pp.slice(1)] = decodeURIComponent(current);
    } else if (pp !== current) {
      return null;
    }
  }
  return params;
};

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(() => window.location.pathname || "/");
  useEffect(() => {
    const handler = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);
  const navigate = (to) => {
    if (to === path) return;
    window.history.pushState({}, "", to);
    setPath(to || "/");
  };
  const value = useMemo(() => ({ path, navigate }), [path]);
  return React.createElement(RouterContext.Provider, { value }, children);
}

export function Routes({ children }) {
  const { path } = useContext(RouterContext);
  let match = null;
  React.Children.forEach(children, (child) => {
    if (match) return;
    if (!React.isValidElement(child)) return;
    const params = matchPath(child.props.path, path);
    if (params) match = { element: child.props.element, params };
  });
  if (!match) return null;
  return React.createElement(ParamsContext.Provider, { value: match.params }, match.element);
}

export function Route() {
  return null;
}

export function Link({ to, children, ...rest }) {
  const { navigate } = useContext(RouterContext);
  return React.createElement(
    "a",
    {
      href: to,
      onClick: (e) => {
        e.preventDefault();
        navigate(to);
      },
      ...rest,
    },
    children
  );
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}

export function useParams() {
  return useContext(ParamsContext);
}

export default { BrowserRouter, Routes, Route, Link, useNavigate, useParams };
