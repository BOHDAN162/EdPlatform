import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext({ path: "/", navigate: () => {} });
const ParamsContext = createContext({});

const normalizePath = (value) => {
  if (!value) return "/";
  return value.startsWith("/") ? value : `/${value}`;
};

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
  const getPath = () => {
    const hash = window.location.hash.replace(/^#/, "");
    return normalizePath(hash || "/");
  };

  const [path, setPath] = useState(getPath);
  useEffect(() => {
    const handler = () => setPath(getPath());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = (to) => {
    if (to === path) return;
    const next = normalizePath(to);
    window.location.hash = next;
    setPath(next);
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

export function Link({ to, children, onClick, ...rest }) {
  const { navigate } = useContext(RouterContext);
  const normalized = normalizePath(to);
  return React.createElement(
    "a",
    {
      href: `#${normalized}`,
      onClick: (e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        navigate(normalized);
      },
      ...rest,
    },
    children
  );
}

export function NavLink({ to, children, className, end, onClick, ...rest }) {
  const { navigate, path } = useContext(RouterContext);
  const normalized = normalizePath(to);
  const isActive = end ? path === normalized : path.startsWith(normalized);
  const resolvedClass =
    typeof className === "function" ? className({ isActive }) : className;
  return React.createElement(
    "a",
    {
      href: `#${normalized}`,
      className: resolvedClass,
      onClick: (e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        navigate(normalized);
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

export default { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams };
