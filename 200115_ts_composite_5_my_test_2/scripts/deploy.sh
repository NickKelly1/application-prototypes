# Linux:
# @see https://stackoverflow.com/questions/53712169/how-do-i-deploy-monorepo-code-to-aws-lambda-using-lerna
# replace symbolic links in node_modules directories with copies of their references
# makes a directory / project self contained and deployable
# (-L forces symlink directories to be copied into the folder)
# TODO: this is BAD - we should get NPM / Yarn to build our node_modules!
# cp -rL lambdas/funcA/node_modules lambdas/funcA/packaged/node_modules

# Mac: ?
