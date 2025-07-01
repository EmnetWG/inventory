function authorizePermission(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user || req.session.user; // support both JWT and session-based auth

    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Unauthorized to access this route' });
    }

    next();
  };
}

module.exports = authorizePermission;
