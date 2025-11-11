export const ADMIN_BASE_PATH = "/blog-admin";
export const ADMIN_APP_RELATIVE_BASE_PATH = "/admin";
export const ADMIN_APP_BASE_PATH = `${ADMIN_BASE_PATH}${ADMIN_APP_RELATIVE_BASE_PATH}`;

export const stripAdminBasePath = (path: string) => {
  if (!path.startsWith(ADMIN_BASE_PATH)) {
    return path || "/";
  }
  const stripped = path.slice(ADMIN_BASE_PATH.length);
  return stripped.length > 0 ? stripped : "/";
};

export const withAdminBasePath = (path: string) => {
  if (!path) {
    return ADMIN_BASE_PATH;
  }
  if (path.startsWith(ADMIN_BASE_PATH)) {
    return path;
  }
  return `${ADMIN_BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
};
