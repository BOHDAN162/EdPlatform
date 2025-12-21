import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const RouterContext = createContext({ path: "/", navigate: () => {} });
const ParamsContext = createContext({});

const normalizePath = (value) => {
  if (!value) return "/";
  return value.startsWith("/") ? value : `/${value}`;
};

const stripQuery = (value) => value.split("?")[0];

const matchPath = (pattern, path) => {
  const patternParts = stripQuery(pattern).split("/").filter(Boolean);
  const pathParts = stripQuery(path).split("/").filter(Boolean);
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
  const historyRef = useRef([getPath()]);
  useEffect(() => {
    const handler = () => {
      const next = getPath();
      const existingIndex = historyRef.current.lastIndexOf(next);
      if (existingIndex >= 0) {
        historyRef.current = historyRef.current.slice(0, existingIndex + 1);
      } else {
        historyRef.current.push(next);
      }
      setPath(next);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = (to) => {
    if (typeof to === "number") {
      if (to < 0 && historyRef.current.length > 1) {
        historyRef.current.pop();
        const target = historyRef.current[historyRef.current.length - 1];
        window.location.hash = target;
        setPath(target);
        return;
      }
      window.history.go(to);
      return;
    }
    if (to === path) return;
    const next = normalizePath(to);
    if (historyRef.current[historyRef.current.length - 1] !== next) {
      historyRef.current.push(next);
    }
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
  const userOnClick = onClick;
  const handleClick = (e) => {
    userOnClick?.(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    navigate(normalized);
  };
  return React.createElement(
    "a",
    {
      href: `#${normalized}`,
      onClick: handleClick,
      ...rest,
    },
    children
  );
}

export function NavLink({ to, children, className, end, ...rest }) {
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

export function useLocation() {
  const { path } = useContext(RouterContext);
  const [pathname, search = ""] = path.split("?");
  return { pathname: normalizePath(pathname || "/"), search: search ? `?${search}` : "" };
}

export function useParams() {
  return useContext(ParamsContext);
}

export default { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams, useLocation };
