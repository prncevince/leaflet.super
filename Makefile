.PHONY: all build_pkgdown build_r_pkg r_pkg_check preview

build_pkgdown:
	Rscript utils/build_pkgdown.R

build_r_pkg:
	Rscript utils/build_r_pkg.R

r_pkg_check:
	Rscript utils/r_pkg_check.R

preview:
	Rscript utils/preview.R
