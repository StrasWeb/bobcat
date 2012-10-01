AC_PREREQ([2.68])
AC_INIT(Bobcat, 0.1pre, rudloff@strasweb.fr)

# Checks for programs.
AC_PATH_PROG(HAVE_SEED, seed, false)
if test $HAVE_SEED = false; then
	AC_MSG_ERROR([Gnome Seed not found!])
fi

AC_CONFIG_SRCDIR(bobcat.js)
AM_INIT_AUTOMAKE
AC_CONFIG_FILES(Makefile)
AC_OUTPUT
